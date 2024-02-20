const { app, BrowserWindow } = require('electron');
const path = require('path');
const gkm = require('gkm');
const { exec } = require('child_process');
const os = require('os');
const fs = require("fs");

const platform = os.platform()

const { muteSystemAudio, unmuteSystemAudio } = require('./mute'); // Custom js file that *silences* the audio

var devmode = process.env.pb_devmode;

var panicMode = false;
var panicButton = "F10";

const configPath = __dirname + '/config.json';
const configData = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configData);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });

    if (platform == "win32") { // Only remove on windows otherwise it crashes MacOS...
        mainWindow.removeMenu();
    }

    // Add OS checks
    // We assume that the mac user knows about compatibility issues...
    mainWindow.loadFile(path.join(__dirname, 'pconf.html')); // Load configuration UI


    if (devmode == "true") {
        mainWindow.webContents.openDevTools(); // Open the DevTools.
    }
};

// Panic window
const createPanicWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });


    if (platform == "win32") { // Only remove on windows otherwise it crashes MacOS...
        mainWindow.removeMenu();
    }
    
    mainWindow.loadFile(path.join(__dirname, 'panic.html'));

    if (devmode == "true") {
        mainWindow.webContents.openDevTools(); // Open the DevTools.
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Check for all keypresses
gkm.events.on('key.pressed', function (data) {
    // Check if the panic button has been pressed
    if (data == config.panickey) {
        console.log("PB has been pressed!");

        // Not yet in panic mode
        if (!panicMode) {
            console.log("Entering panic mode!");
            panicMode = true;
            createPanicWindow();
            muteSystemAudio();
        } else {
            console.log("Leaving panic mode!");
            panicMode = false;
            unmuteSystemAudio();
        }
    }
});