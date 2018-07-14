#include <node.h>
#include <node_buffer.h>
#include <Windows.h>
#include <stdio.h>

HWND _workerw = nullptr;

BOOL CALLBACK EnumWindowsProc(_In_ HWND tophandle, _In_ LPARAM topparamhandle)
{
  HWND defview = FindWindowEx(tophandle, NULL, "SHELLDLL_DefView", NULL);
  if (defview != nullptr)
  {
    _workerw = FindWindowEx(NULL, tophandle, "WorkerW", NULL);
  }
  return true;
}

HWND GetWorkerW()
{
  int result;
  HWND windowHandle = FindWindow("Progman", NULL);
  SendMessageTimeout(windowHandle, 0x052c, 0, 0, SMTO_NORMAL, 0x3e8, (PDWORD_PTR)&result);
  EnumWindows(EnumWindowsProc, NULL);
  ShowWindow(_workerw, SW_HIDE);
  return windowHandle;
}

namespace demo
{

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void SetWallPaper(const FunctionCallbackInfo<Value> &args)
{
  Isolate *isolate = args.GetIsolate();

  if (args.Length() < 1)
  {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong number of arguments")));
    return;
  }

  unsigned char *bufferData = (unsigned char *)node::Buffer::Data(args[0]->ToObject());
  unsigned long handle = *reinterpret_cast<unsigned long *>(bufferData);
  HWND hwnd = (HWND)handle;

  SetParent(hwnd, GetWorkerW());

  HWND hTaskBar;

  hTaskBar = FindWindow("Shell_TrayWnd", 0 );
  SetLayeredWindowAttributes(hTaskBar, 0, 200 , LWA_ALPHA);

  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "done"));
}

void Initialize(Local<Object> exports)
{
  NODE_SET_METHOD(exports, "setWallpaper", SetWallPaper);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

} // namespace demo