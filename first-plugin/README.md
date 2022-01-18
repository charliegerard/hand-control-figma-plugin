# Figma plugin - Motion-controlled UIs

[Official Figma docs](https://www.figma.com/plugin-docs/setup/)

**This plugin doesn't work without running the other part of the project found in the folder `webcam-part`.**

## Installation

This plugin template uses Typescript.

1. Install TypeScript using the command `npm install -g typescript`.

2. Get the latest type definitions for the plugin API by running `npm install --save-dev @figma/plugin-typings`.

## How to run

In the `ui.html` file, you have access to some browser APIs and can send messages to the `code.js` file to execute some figma-specific commands.

To test the plugin in Figma, run `npm run build` after your changes, open the Figma Desktop app (testing doesn't work in the browser app), press `Command + /` and look for the plugin name.
