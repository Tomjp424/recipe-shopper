import {app, BrowserWindow} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ipcMain } from 'electron';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Store from 'electron-store';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

function createWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    window.loadURL('http://localhost:5173');
    window.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

ipcMain.handle('send-test-email', async () => {
    try {

        const transporter = nodemailer.createTransport({
            service: process.env.emailService,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPass,
            }
        });

        const emailInfo = await transporter.sendMail({
            from: `"Recipe Shopper" ${process.env.emailUser}`,
            to: 'thomasp.devs@gmail.com',
            subject: 'Test Subject',
            text: 'Test Body',
        });

        console.log('Email sent.');
        return { success: true };
    } catch (error) {
        console.error('Failed to send test email.', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-recipes', () => {
    return store.get('recipes', []);
});

ipcMain.handle('save-recipes', (event, recipes) => {
    store.set('recipes', recipes);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});


console.log(store);
store.clear();