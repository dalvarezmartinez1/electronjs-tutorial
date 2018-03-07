const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

const inDevelopment = true;

let mainWindow, showMapWindow;

const createWindow = (pathToHtmlAsArray, windowProps, menuItems) => {
  let window = new BrowserWindow(windowProps);

  const pathToIndexHtml = url.format({
    pathname: path.join(__dirname, ...pathToHtmlAsArray),
    protocol: 'file:',
    slashes: true
  });

  window.loadURL(pathToIndexHtml);

  window.on('closed', () => {
    window = null;
  });

  window.setMenu(Menu.buildFromTemplate(menuItems));

  return window;
};

const getMainMenuEntries = () => {
  return [{
    label: 'File',
    submenu: [
      {
        label: 'Show Map',
        click: () => {
          showMapWindow = createWindow(['src', 'showMap', 'show-map.html'], {width: 700, height: 500, title: 'Show map', alwaysOnTop: true, show: true}, [getDevelopmentMainMenuEntry()]);
        }
      },
      {label: 'Exit', role: 'quit'}
    ]
  }];
};

const getDevelopmentMainMenuEntry = () => {
  return {
    label: 'Development',
    submenu: [
      {label: 'Reload', role: 'forcereload'},
      {label: 'DevTools', role: 'toggledevtools'}
    ]
  }
};

app.on('ready', () => {
  const mainMenuEntries = getMainMenuEntries();
  if (inDevelopment) {
    mainMenuEntries.push(getDevelopmentMainMenuEntry());
  }

  mainWindow = createWindow(['index.html'], {width: 800, height: 600, title: 'Electron maps'}, mainMenuEntries);

});

ipcMain.on('showMap:lastVisitedCity', (event, item) => {
  mainWindow.webContents.send('showMap:lastVisitedCity', item);
});
