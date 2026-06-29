const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        minWidth: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            nodeIntegration: false,
            contextIsolation: true,
            // webSecurity: false,
            //  allowRunningInsecureContent: true
            enableRemoteModule: false,
            webSecurity: true,
        }
    });
    mainWindow.loadFile('index.html');
    Menu.setApplicationMenu(null);
    mainWindow.webContents.session.on('will-download', (event, item) => {
        const filePath = path.join(app.getPath('downloads'), item.getFilename());

        item.setSavePath(filePath);

        item.on('updated', (event, state) => {
            if (state === 'progressing') {
                const progress = item.getReceivedBytes() / item.getTotalBytes();
                mainWindow.webContents.send('download-progress', {
                    filename: item.getFilename(),
                    progress: progress
                });
            }
        });

        item.once('done', (event, state) => {
            if (state === 'completed') {
                mainWindow.webContents.send('download-complete', {
                    filename: item.getFilename(),
                    filePath: filePath
                });
            } else {
                mainWindow.webContents.send('download-failed', {
                    filename: item.getFilename()
                });
            }
        });
    });
});

const { shell } = require('electron');
ipcMain.on('open-file', (event, filePath) => {
    shell.openPath(filePath);
});

