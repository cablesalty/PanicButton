<h1 style="text-align:center"><b>Panic Button</b></h1>

### Display a fake desktop and mute audio on a single keypress
Have you had enough of people going into your room unannounced while you are watching... *questionable content*? I got a solution!  
PanicButton helps you both hide *"your content"* and mute the audio with the press of a single button!

## Compatibility
Panic Button is compatible with **Windows 10 or above**. Mac functionality is in beta, and Linux compatibility is not possible right now due to inconsistencies between distros and systems.

## Setup
For an easy setup, you can go to the [Releases](https://github.com/cablesalty/PanicButton/releases/tag/Production) tab and download the latest installer.

### Manual setup
### Install node.js
Install node.js LTS [from the official site](https://nodejs.org/). The program was tested on **Node v20.6.1**. 

### Clone this project
```sh
git clone https://github.com/cablesalty/panicbutton
cd panicbutton
```
*(Or [download the .zip file](https://github.com/cablesalty/PanicButton/archive/refs/heads/main.zip))*

#### Install node dependencies:
```bat
npm init -y
npm install
```

### Start Panic Button
Run `npm start`. This will open a command prompt window.