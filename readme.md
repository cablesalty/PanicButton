<h1 style="text-align:center"><b>Panic Button</b></h1>

### Display a fake desktop and mute audio on a single keypress

## Compatibility
Panic Button is compatible with **Windows 10 or above**. Mac functionality is in beta, and Linux compatibility is not possible right now due to inconsistencies between distros and systems.

## Setup
You can either download and install Panic Button by using [the prebuilt installer](), or you can set up Panic Button manually.

### Install node.js
[Install node.js from the official site](). Panic Button was tested on **node v20.6.1**.

### Clone this project
```sh
git clone https://github.com/cablesalty/panicbutton
cd panicbutton
```
*(Or [download the .zip file]())*

#### Or install manually:
```bat
npm init -y
npm i electron electron-forge electron-squirrel-startup gkm loudness
```
*(requires node.js. Recommended version is v20.6.1 or above)*

### Start Panic Button
Run the command `npm start`

## Donation
If you want to support the project financially, you can either [donate using GitHub](), [PayPal](), or [cryptocurrency]().

Any form of donation is well appreciated!