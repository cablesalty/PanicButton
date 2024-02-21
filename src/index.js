const { app, BrowserWindow, Tray, Menu, dialog } = require('electron');
const path = require('path');
const gkm = require('gkm');
const { exec } = require('child_process');
const os = require('os');
const fs = require("fs");

let tray = null

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
        resizable: false,
        width: 1000,
        height: 650,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });

    if (platform == "win32") {
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
    const panicWindow = new BrowserWindow({
        fullscreen: true,
        resizable: false,
        focusable: true,
        autoHideMenuBar: true,
        hiddenInMissionControl: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });


    if (platform == "win32") {
        panicWindow.removeMenu();
    }

    panicWindow.loadFile(path.join(__dirname, 'panic.html'));

    if (devmode == "true") {
        panicWindow.webContents.openDevTools(); // Open the DevTools.
    }

    panicWindow.webContents.on('did-finish-load', function () {
        panicWindow.setVisibleOnAllWorkspaces(true);
        panicWindow.focus();
        panicWindow.show();
    });
};

// External Panic Page
const createExternalPanicPageWindow = (url) => {
    // Create the browser window.
    const panicWindow = new BrowserWindow({
        fullscreen: true,
        resizable: false,
        focusable: true,
        autoHideMenuBar: true,
        hiddenInMissionControl: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });


    if (platform == "win32") {
        panicWindow.removeMenu();
    }

    panicWindow.loadURL(url);

    if (devmode == "true") {
        panicWindow.webContents.openDevTools(); // Open the DevTools.
    }

    panicWindow.webContents.on('did-finish-load', function () {
        panicWindow.setVisibleOnAllWorkspaces(true);
        panicWindow.focus();
        panicWindow.show();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (event) => {
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }

    // Prevent from quitting (tray)
    event.preventDefault();
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    tray = new Tray(__dirname + "/logo.png");

    tray.on("click", (event, bounds, position) => {
        createWindow();
    });

    const contextMenu = Menu.buildFromTemplate([
        { type: 'separator' },
        {
            label: 'Quit PanicButton',
            click: () => {
                app.quit();
                process.exit(0);
            }
        },
        { type: 'separator' },
        {
            label: 'Open Panic Controller',
            click: () => {
                createWindow();
            }
        }
    ])
    tray.setToolTip('PanicButton');
    tray.setContextMenu(contextMenu);
})


// Functions
function poweroff() {
    if (platform == "win32") {
        exec(`shutdown -s -t 0`, (error, stdout, stderr) => {
            if (error) {
                createPanicWindow();
                console.error(`Error executing CMD command: ${error.message}`);
                return;
            }
            if (stderr) {
                createPanicWindow();
                console.error(`CMD error: ${stderr}`);
                return;
            }
            console.log('Shutdown command successful');
        });
    } else {
        createPanicWindow();
    }
}

function logout() {
    if (platform == "win32") {
        exec(`shutdown -l`, (error, stdout, stderr) => {
            if (error) {
                createPanicWindow();
                console.error(`Error executing CMD command: ${error.message}`);
                return;
            }
            if (stderr) {
                createPanicWindow();
                console.error(`CMD error: ${stderr}`);
                return;
            }
            console.log('Shutdown command successful');
        });
    } else {
        createPanicWindow();
    }
}

// Function to close all windows
function closeAllWindows() {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(window => {
        window.close();
    });
}

// Check for all keypresses
gkm.events.on('key.pressed', function (data) {
    // Check if the panic button has been pressed
    if (data == config.panickey) {
        closeAllWindows();
        console.log("PB has been pressed!");

        // Check if user is not in panic mode
        if (!panicMode) {
            console.log("Entering panic mode!");
            panicMode = true;
            switch (config.panicreaction) {
                case "fakedesktop":
                    createPanicWindow();
                    break;
                case "poweroff":
                    poweroff();
                    break;
                case "logout":
                    logout();
                    break;
                case "ythome":
                    createExternalPanicPageWindow("https://www.youtube.com/");
                    break;
                case "ytcablesalty":
                    createExternalPanicPageWindow("https://www.youtube.com/@cablesalty");
                    break;
                case "ytpearoo":
                    createExternalPanicPageWindow("https://www.youtube.com/@Pearoo");
                    break;
                case "github":
                    createExternalPanicPageWindow("https://github.com");
                    break;
                case "facebook":
                    createExternalPanicPageWindow("https://facebook.com");
                    break;
                default: // If invalid shit is selected
                    createPanicWindow();
                    break;
            }

            muteSystemAudio();

        } else {
            console.log("Leaving panic mode!");
            panicMode = false;
            unmuteSystemAudio();
            closeAllWindows();

        }
    }
});