## Phaser3 Platformer Tutorial

#### Phaser3 + ES6 + Webpack

This repository is based on the getting started tutorial found on Phaser.io. The dev environment for this project is based on the Generic Platformer and Bootstrap Phaser Project by Niklas Berg (https://github.com/nkholski/phaser3-es6-webpack).

## Setup
You'll need to install a few things before you have a working project including coping this repo to a new project directory.

### 1. Install node.js and npm:
https://nodejs.org/en/

### 2. Install Dependencies:
Navigate to the project folder.

Run:
`npm install` or `yarn`

### 3. Run Development Server

Run:
`npm run dev`

This will run a server so that your game will nun in the browser in a browser. This will also start a watch process, that will recompile and refresh the browser when a change is saved to a source file.

Open your browser and enter `localhost:3000`

## Controls
left/right arrow keys: left/right
up arrow key: jump

#### XInput Support

One feature included in this example that is not found in the original tutorial is support for XBox 360 style controls. When a controller is connect, the keyboard controls are disabled.

D-Pad left/right: left/right
Left Analog stick: left/right
A Button: jumb

NOTE: This has only currently been tested with the 8Bitdo NES30 PRO.



## Development Build

Run: `npm run deploy`

This will optimize and minimize the compiled bundle.
