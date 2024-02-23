// Modules
const fs = require('fs');
const { app } = require("electron");

const userDataPath = app.getPath('userData');
console.log(userDataPath);

const defaultConfig = { "panickey": "F9", "panicreaction": "fakedesktop", "muteaudio": "mute" };
const configPath = path.join(userDataPath, 'config.json');
const configData = fs.readFileSync(configPath, 'utf8'); // Read file
const config = JSON.parse(configData); // Parse json
const modifiedConfig = JSON.parse(JSON.stringify(config)); // Create duplicate (for modification)


// Update values based on config
document.getElementById("currentlyBoundKeyDisplay").innerHTML = "Currently bound key: " + config.panickey;



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