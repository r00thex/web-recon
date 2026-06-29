const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, data) => callback(data)),
    onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (event, data) => callback(data)),
    onDownloadFailed: (callback) => ipcRenderer.on('download-failed', (event, data) => callback(data))
});

contextBridge.exposeInMainWorld('electronAPI', {
    getCurrentURL: () => ipcRenderer.invoke('get-current-url')
});


