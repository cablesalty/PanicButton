const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const fs = require("fs");

let tray = null

const platform = os.platform()

const { muteSystemAudio, unmuteSystemAudio } = require('./mute'); // Custom js file that *silences* the audio

var devmode = process.env.pb_devmode;

var panicMode = false;

const userDataPath = app.getPath('userData');
console.log(userDataPath);

const defaultConfig = { "panickey": "F9", "panicreaction": "fakedesktop", "muteaudio": "mute" };
const defaultConfigString = JSON.stringify(defaultConfig, null, 2); // Convert object to JSON string
const configPath = path.join(userDataPath, 'config.json');

function writeDefaultConfig(callback) {
    fs.writeFile(configPath, defaultConfigString, (err) => {
        if (err) {
            console.error('Error writing JSON to file:', err);
        } else {
            console.log('Default configuration has been written to config.json');
        }
        callback(); // Call the callback after writing the file
    });
}

function readConfigFile() {
    try {
        let configData = fs.readFileSync(configPath, 'utf8');
        let config = JSON.parse(configData);
        console.log('Current config:', config);
        return config;
    } catch (err) {
        console.error('Error reading config file:', err);
        // If there's an error, return null or handle it accordingly
        return null;
    }
}

if (!fs.existsSync(configPath)) {
    // If config file doesn't exist, write default config
    writeDefaultConfig(() => {
        // After writing, read the config file
        let config = readConfigFile();
        // Use config or perform any other operations with it
    });
} else {
    // If config file exists, just read it
    let config = readConfigFile();
    // Use config or perform any other operations with it
}



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
    tray = new Tray(path.join(__dirname, "logo.png"));

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

    registerGlobalShortcut(currentPanicKey); // Initial Key Registration
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

// Function to register a global shortcut
function registerGlobalShortcut(shortcut) {
    // Unregister existing shortcut
    globalShortcut.unregister(currentPanicKey);

    // Register new shortcut
    const ret = globalShortcut.register(shortcut, () => {
        console.log(`PB (${shortcut}) is pressed!`);
        closeAllWindows();

        // Check if user is not in panic mode
        if (!panicMode) {
            console.log("Entering panic mode!");
            panicMode = true;
            console.log(config.panicreaction);
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

            if (config.muteaudio == "mute") {
                muteSystemAudio();
            }

        } else {
            console.log("Leaving panic mode!");
            panicMode = false;
            if (config.muteaudio == "mute") {
                unmuteSystemAudio();
            }
            closeAllWindows();

        }
    });

    if (!ret) {
        console.log('Panic Key Registration failed');
    }

    // Update currentPanicKey variable
    currentPanicKey = shortcut;
}

// Watch config.json
const watcher = fs.watch(configPath, (eventType, filename) => {
    if (eventType === 'change') {
        console.log('config.json has been modified, reloading...');
        let configData = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(configData);
        registerGlobalShortcut(config.panickey);
    }
});
