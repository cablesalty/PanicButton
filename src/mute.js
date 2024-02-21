const { exec } = require('child_process');
const os = require('os');

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
    exec('osascript -e "set volume with output muted"', (error, stdout, stderr) => {
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

// Function to unmute system audio on macOS
function unmuteMac() {
    exec('osascript -e "set volume without output muted"', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error unmuting system audio: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('System audio unmuted.');
    });
}

// Function to mute system audio on Windows
function muteWindows() {
    // We cant see if audio is already muted. If it is, it will unmute. We dont want that.
    // Instead, we unmute audio then mute again. Perfect solution
    exec('New-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "UseVolumePopup" -Value 0 -PropertyType DWORD -Force | Out-Null', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error unmuting system audio: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('Disabled audio overlay.');
    });
    exec('powershell.exe -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]174)"', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error unmuting system audio: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('System audio unmuted, ready for muting.');
    });
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
    exec('New-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "UseVolumePopup" -Value 1 -PropertyType DWORD -Force | Out-Null', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error muting system audio: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('Re-enabled audio overlay.');
    });
}

// Function to unmute system audio on Windows
function unmuteWindows() {
    exec('powershell.exe -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]175)"', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error unmuting system audio: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log('System audio unmuted.');
    });
}

module.exports = { muteSystemAudio, unmuteSystemAudio };
