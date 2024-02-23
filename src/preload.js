// Expose userData directory path to renderer process
window.userDataPath = require('electron').remote.app.getPath('userData');