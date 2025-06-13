const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendTestEmail: () => ipcRenderer.invoke('send-test-email'),
    getRecipes: () => ipcRenderer.invoke('get-recipes'),
    saveRecipes: (recipes) => ipcRenderer.invoke('save-recipes', recipes),
});