import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ping: () => ipcRenderer.invoke('ping'),
});

//window.electron.ping();

console.log('preload');