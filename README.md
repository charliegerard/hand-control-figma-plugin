# Create UIs with hand movements - Figma plugin prototype

This project uses TensorFlow.js' handpose detection model to add motion control to Figma.

Figma plugins don't allow access to the webcam for security reasons so the hands detection is done in a separate web app and the data is sent to the Figma plugin using websockets.

Demo video: 

[![](https://img.youtube.com/vi/AzV2ngmbiBw/0.jpg)](https://www.youtube.com/watch?v=AzV2ngmbiBw)

More info in [this blog post](https://charliegerard.dev/blog/hand-control-ui-figma-plugin)

## How to run

**For the hand detection:**

cd into `hand-control-ui` and follow the steps in the README.

**For the plugin:**

Open Figma desktop, `Plugins > Development > Import plugin from manifest.json`.

## Demo

The demo has a few layers already added to Figma that are then controlled by hand movements but it is possible to create new layers with gestures as well.
