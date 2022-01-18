# Hand detection using MediaPipe's handpose ML model

## How to run

After the first time:
`rm -rf .cache dist node_modules`

### 1st time:

1. `yarn build-dep`

2. `yarn`

3. `yarn watch`

At the same time in another terminal window, run the server side to start the websocket server:

`node server.js`

And open a browser window at `localhost:1234/?model=mediapipe_hands`.

## Available commands

Pinch left + pinch right = Make element visible
Palm left / right = Refocus viewport
Palm left + Palm right = zoom
