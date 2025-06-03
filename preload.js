const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ping: () => ipcRenderer.invoke('ping'),
    sendTestEmail: () => ipcRenderer.invoke('send-test-email'),
});

console.log('preload');