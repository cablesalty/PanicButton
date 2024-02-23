<h1 style="text-align:center"><b>Panic Button</b></h1>

### Display a fake desktop and mute audio on a single keypress

## Compatibility
Panic Button is compatible with **Windows 10 or above**. Mac functionality is in beta, and Linux compatibility is not possible right now due to inconsistencies between distros and systems.

## Setup
You can either download and install Panic Button by using [the prebuilt installer](https://github.com/cablesalty/PanicButton/releases/download/Production/PanicButton-1.0.0-Setup.exe), or you can set up Panic Button manually.  
**We recommend using [the installer](https://github.com/cablesalty/PanicButton/releases/download/Production/PanicButton-1.0.0-Setup.exe).** The installer is always the most stable build of PanicButton.

### Manual installation (not recommended, use the [installer](https://github.com/cablesalty/PanicButton/releases/download/Production/PanicButton-1.0.0-Setup.exe).)
### Install node.js
Install node.js **LTS** [from the official site](https://nodejs.org/). Panic Button was tested on **node v20.6.1**. 

### Clone this project
```sh
git clone https://github.com/cablesalty/panicbutton
cd panicbutton
```
*(Or [download the .zip file](https://github.com/cablesalty/PanicButton/archive/refs/heads/main.zip))*

#### Install node dependencies:
```bat
npm init -y
npm i electron electron-forge electron-squirrel-startup gkm loudness
```

### Start Panic Button
Run the command `npm start`. This will create a cmd window. Or start Panic Button using `start.vbs`.

<!-- ## Donation
If you want to support the project financially, you can either [donate using GitHub](), [PayPal](), or [cryptocurrency]().

Any form of donation is well appreciated! -->
