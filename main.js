import {app, BrowserWindow} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ipcMain } from 'electron';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            }
        });

        const emailInfo = await transporter.sendMail({
            from: '"Test Alias" <testsender@test.com>',
            to: 'testrecipient@test.com',
            subject: 'Test Subject',
            text: 'Test Body',
        });

        console.log('Test email sent.', nodemailer.getTestMessageUrl(emailInfo));
        return { success: true, previewUrl: nodemailer.getTestMessageUrl(emailInfo) };
    } catch (error) {
        console.error('Failed to send test email.', error);
        return { success: false, error: error.message };
    }
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