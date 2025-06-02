import {app, BrowserWindow} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ipcMain } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    window.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

ipcMain.handle('ping', () => {
    console.log('Ping recieved from front.');
    return 'pong';
});

console.log('Main');