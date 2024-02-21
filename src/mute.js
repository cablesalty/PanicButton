const { exec } = require('child_process');
const os = require('os');
const loudness = require("loudness");

// Function to mute system audio based on the operating system
function muteSystemAudio() {
    const platform = os.platform();
    switch (platform) {
        case 'darwin': // macOS
            muteMac();
            break;
        case 'win32': // Windows
            muteWindows();
            break;
        default:
            console.error(`Unsupported operating system: ${platform}`);
    }
}

// Function to unmute system audio based on the operating system
function unmuteSystemAudio() {
    const platform = os.platform();
    switch (platform) {
        case 'darwin': // macOS
            unmuteMac();
            break;
        case 'win32': // Windows
            unmuteWindows();
            break;
        default:
            console.error(`Unsupported operating system: ${platform}`);
    }
}

// Function to mute system audio on macOS
function muteMac() {
    loudness.setMuted(true, (error) => {
        if (error) {
            console.error(`Error muting system audio: ${error.message}`);
            return;
        }
        console.log('System audio muted.');
    });
}

// Function to unmute system audio on macOS
function unmuteMac() {
    loudness.setMuted(false, (error) => {
        if (error) {
            console.error(`Error unmuting system audio: ${error.message}`);
            return;
        }
        console.log('System audio unmuted.');
    });
}

// Function to mute system audio on Windows
function muteWindows() {
    exec('powershell.exe -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]173)"', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error muting system audio: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('System audio muted.');
    });
}

// Function to unmute system audio on Windows
function unmuteWindows() {
    loudness.setMuted(false, (error) => {
        if (error) {
            console.error(`Error unmuting system audio: ${error.message}`);
            return;
        }
        console.log('System audio unmuted.');
    });
}


module.exports = { muteSystemAudio, unmuteSystemAudio };
