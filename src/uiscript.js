// Modules
const fs = require('fs');
const { ipcRenderer } = require('electron');
const path = require('path');

let userDataPath;
let configPath;
let configData;
let config;
let modifiedConfig;

// Request userData directory path from main process
ipcRenderer.invoke('get-userData-path').then((retUserDataPath) => {
    console.log('UserData directory path:', retUserDataPath);
    userDataPath = retUserDataPath;

    configPath = path.join(userDataPath, 'config.json');
    configData = fs.readFileSync(configPath, 'utf8'); // Read file
    config = JSON.parse(configData); // Parse json
    modifiedConfig = JSON.parse(JSON.stringify(config)); // Create duplicate (for modification)

    // Update values based on config
    document.getElementById("currentlyBoundKeyDisplay").innerHTML = "Currently bound key: " + config.panickey;
}).catch((error) => {
    console.error('Error getting userData directory path:', error);
});

// Key Identification
let isIdentifying = false;

function startKeyIdentification() {
    if (!isIdentifying) {
        document.getElementById("changeBindingBtn").innerHTML = "Press a button! (Click to cancel)";
        isIdentifying = true;
        document.addEventListener("keydown", keyDownHandler);
    } else {
        isIdentifying = false;
        document.removeEventListener("keydown", keyDownHandler);
        document.getElementById("changeBindingBtn").innerHTML = "Change key binding...";
    }
}

function keyDownHandler(event) {
    const keyPressedElement = document.getElementById("currentlyBoundKeyDisplay"); // Move this line here
    const pressedKey = event.key.toUpperCase();
    keyPressedElement.textContent = `Currently bound key: ${pressedKey}`;
    modifiedConfig.panickey = pressedKey;
    document.removeEventListener("keydown", keyDownHandler);
    isIdentifying = false;
    document.getElementById("changeBindingBtn").innerHTML = "Change key binding...";
}


// Resetting to default keybind
function resetToDefaultKeybind() {
    modifiedConfig.panickey = "F9";
}


// Function saving
async function saveConfig() {
    modifiedConfig.panicreaction = document.getElementById("pr").value;
    modifiedConfig.muteaudio = document.getElementById("muteaudioselection").value;

    fs.writeFileSync(configPath, JSON.stringify(modifiedConfig, null, 2));

    document.getElementById("saveConfigBtn").innerHTML = "Saved!";
    setTimeout(() => {
        document.getElementById("saveConfigBtn").innerHTML = "Save config";
    }, 2000);
}