const {
  app,
  BrowserWindow,
  Tray,
  Menu
} = require('electron');
const path = require('path');
const addon = require('../build/Release/addon');
const AutoLaunch = require('auto-launch');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/wp1/index.html`);

  const appIcon = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '花瓣',
      click: () => {
        mainWindow.loadURL(`file://${__dirname}/wp1/index.html`);
      },
    },
    {
      label: '田馥甄',
      click: () => {
        mainWindow.loadURL(`file://${__dirname}/wp2/index.html`);
      },
    },
    {
      label: '芽衣',
      click: () => {
        mainWindow.loadURL(`file://${__dirname}/wp3/index.html`);
      },
    },
     {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  appIcon.setContextMenu(contextMenu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.setFullScreen(true);
  mainWindow.setMenuBarVisibility(false);
  addon.setWallpaper(mainWindow.getNativeWindowHandle());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const autoLauncher = new AutoLaunch({
  name: 'dynamicwallpaper',
});

autoLauncher.isEnabled()
    .then((isEnabled) => {
      if (arg) {
        if (isEnabled) {
          return;
        }
        console.log('enable');
        autoLauncher.enable();
      } else {
        if (!isEnabled) {
          return;
        }
        console.log('disable');
        autoLauncher.disable();
      }
    }).catch(() => {});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.