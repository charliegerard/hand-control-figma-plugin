import "@tensorflow/tfjs-backend-webgl";
import * as mpHands from "@mediapipe/hands";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);

import * as handdetection from "@tensorflow-models/hand-pose-detection";

import { Camera } from "./camera";
import { STATE } from "./shared/params";
import { setBackendAndEnvFlags } from "./shared/util";

let detector, camera, stats;
let startInferenceTime,
  numInferences = 0;
let inferenceTimeSum = 0,
  lastPanelUpdate = 0;
let rafId;

let twoHands = false;
let leftPinch,
  rightPinch = false;
let palmLeft,
  palmRight = false;

let previousEvent;

async function createDetector() {
  switch (STATE.model) {
    case handdetection.SupportedModels.MediaPipeHands:
      const runtime = STATE.backend.split("-")[0];
      if (runtime === "mediapipe") {
        return handdetection.createDetector(STATE.model, {
          runtime,
          modelType: STATE.modelConfig.type,
          maxHands: STATE.modelConfig.maxNumHands,
          solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`,
        });
      } else if (runtime === "tfjs") {
        return handdetection.createDetector(STATE.model, {
          runtime,
          modelType: STATE.modelConfig.type,
          maxHands: STATE.modelConfig.maxNumHands,
        });
      }
  }
}

async function checkGuiUpdate() {
  if (STATE.isTargetFPSChanged || STATE.isSizeOptionChanged) {
    camera = await Camera.setupCamera(STATE.camera);
    STATE.isTargetFPSChanged = false;
    STATE.isSizeOptionChanged = false;
  }

  if (STATE.isModelChanged || STATE.isFlagChanged || STATE.isBackendChanged) {
    STATE.isModelChanged = true;

    window.cancelAnimationFrame(rafId);

    if (detector != null) {
      detector.dispose();
    }

    if (STATE.isFlagChanged || STATE.isBackendChanged) {
      await setBackendAndEnvFlags(STATE.flags, STATE.backend);
    }

    try {
      detector = await createDetector(STATE.model);
    } catch (error) {
      detector = null;
      alert(error);
    }

    STATE.isFlagChanged = false;
    STATE.isBackendChanged = false;
    STATE.isModelChanged = false;
  }
}

function beginEstimateHandsStats() {
  startInferenceTime = (performance || Date).now();
}

function endEstimateHandsStats() {
  const endInferenceTime = (performance || Date).now();
  inferenceTimeSum += endInferenceTime - startInferenceTime;
  ++numInferences;

  const panelUpdateMilliseconds = 1000;
  if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
    const averageInferenceTime = inferenceTimeSum / numInferences;
    inferenceTimeSum = 0;
    numInferences = 0;
    // stats.customFpsPanel.update(
    //   1000.0 / averageInferenceTime,
    //   120 /* maxValue */
    // );
    lastPanelUpdate = endInferenceTime;
  }
}

async function renderResult() {
  if (camera.video.readyState < 2) {
    await new Promise((resolve) => {
      camera.video.onloadeddata = () => {
        resolve(video);
      };
    });
  }

  let hands = null;
  // Detector can be null if initialization failed (for example when loading
  // from a URL that does not exist).
  if (detector != null) {
    // FPS only counts the time it takes to finish estimateHands.
    beginEstimateHandsStats();

    // Detectors can throw errors, for example when using custom URLs that
    // contain a model that doesn't provide the expected output.
    try {
      hands = await detector.estimateHands(camera.video, {
        flipHorizontal: true,
      });
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }

    endEstimateHandsStats();
  }

  // camera.drawCtx();

  // The null check makes sure the UI is not in the middle of changing to a
  // different model. If during model change, the result is from an old model,
  // which shouldn't be rendered.
  if (hands && hands.length > 0 && !STATE.isModelChanged) {
    if (hands.length > 1) {
      twoHands = true;
    } else {
      twoHands = false;
    }

    let leftThumbTip,
      rightThumbTip,
      leftIndexTip,
      rightIndexTip,
      leftIndexFingerDip,
      rightIndexFingerDip,
      rightMiddleFingerDip,
      rightRingFingerDip,
      rightMiddleFingerTip,
      leftMiddleFingerTip,
      leftMiddleFingerDip,
      leftRingFingerTip,
      leftRingFingerDip,
      rightRingFingerTip;
    hands.map((hand) => {
      // const thumbTip = hand.keypoints.find((p) => p.name === "thumb_tip");
      // // console.log(thumbTip.y);
      // const indexTip = hand.keypoints.find(
      //   (p) => p.name === "index_finger_tip"
      // );

      if (hand.handedness === "Left") {
        // -------------
        // DETECT PINCH
        // -------------
        leftThumbTip = hand.keypoints.find((p) => p.name === "thumb_tip");
        leftIndexTip = hand.keypoints.find(
          (p) => p.name === "index_finger_tip"
        );

        if (leftThumbTip.y - leftIndexTip.y < 15) {
          leftPinch = true;
          // socket.emit("left_pinch", { msg: "left pinch" });
        } else {
          leftPinch = false;
        }

        //---------------
        // DETECT PALM
        //---------------
        leftMiddleFingerTip = hand.keypoints.find(
          (p) => p.name === "middle_finger_tip"
        );
        leftRingFingerTip = hand.keypoints.find(
          (p) => p.name === "ring_finger_tip"
        );
        leftIndexFingerDip = hand.keypoints.find(
          (p) => p.name === "index_finger_dip"
        );
        leftMiddleFingerDip = hand.keypoints.find(
          (p) => p.name === "middle_finger_dip"
        );
        leftRingFingerDip = hand.keypoints.find(
          (p) => p.name === "ring_finger_dip"
        );

        if (
          leftIndexTip.y < leftIndexFingerDip.y &&
          leftMiddleFingerTip.y < leftMiddleFingerDip.y &&
          leftRingFingerTip.y < leftRingFingerDip.y
        ) {
          palmLeft = true;
        } else {
          palmLeft = false;
        }
      } else {
        // -------------
        // DETECT PINCH
        // -------------
        rightThumbTip = hand.keypoints.find((p) => p.name === "thumb_tip");
        rightIndexTip = hand.keypoints.find(
          (p) => p.name === "index_finger_tip"
        );
        if (rightThumbTip.y - rightIndexTip.y < 15) {
          rightPinch = true;
        } else {
          rightPinch = false;
        }
        //---------------
        // DETECT PALM
        //---------------
        rightMiddleFingerTip = hand.keypoints.find(
          (p) => p.name === "middle_finger_tip"
        );
        rightRingFingerTip = hand.keypoints.find(
          (p) => p.name === "ring_finger_tip"
        );
        rightIndexFingerDip = hand.keypoints.find(
          (p) => p.name === "index_finger_dip"
        );
        rightMiddleFingerDip = hand.keypoints.find(
          (p) => p.name === "middle_finger_dip"
        );
        rightRingFingerDip = hand.keypoints.find(
          (p) => p.name === "ring_finger_dip"
        );

        if (
          rightIndexTip.y < rightIndexFingerDip.y &&
          rightMiddleFingerTip.y < rightMiddleFingerDip.y &&
          rightRingFingerTip.y < rightRingFingerDip.y
        ) {
          palmRight = true;
        } else {
          palmRight = false;
        }

        if (
          palmRight &&
          palmLeft &&
          rightMiddleFingerTip &&
          leftMiddleFingerTip
        ) {
          // zoom

          socket.emit("zoom", rightMiddleFingerTip.x - leftMiddleFingerTip.x);
        } else if (palmRight || palmLeft) {
          socket.emit("pan", {
            x: rightMiddleFingerDip.x,
            y: rightMiddleFingerDip.y,
          });
        }
      }

      // Create shape pinch
      if (leftPinch && rightPinch && leftThumbTip && rightThumbTip) {
        if (!previousEvent || previousEvent === "end-pinch") {
          previousEvent = "start-pinch";
          socket.emit("event", "start-pinch");
        }
        socket.emit("create_rect", {
          topX: leftThumbTip.x * 5,
          topY: leftThumbTip.y * 5,
          width: rightThumbTip.x - leftThumbTip.x,
          height: rightThumbTip.y - leftThumbTip.y,
        });
      } else if (!leftPinch && !rightPinch) {
        previousEvent = "end-pinch";
        socket.emit("event", "end-pinch");
      }
    });

    // camera.drawResults(hands);
  }
}

async function renderPrediction() {
  await checkGuiUpdate();

  if (!STATE.isModelChanged) {
    await renderResult();
  }

  rafId = requestAnimationFrame(renderPrediction);
}

async function app() {
  // Gui content will change depending on which model is in the query string.
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("model")) {
    alert("Cannot find model in the query string.");
    return;
  }

  // await setupDatGui(urlParams);

  // stats = setupStats();

  camera = await Camera.setupCamera(STATE.camera);

  await setBackendAndEnvFlags(STATE.flags, STATE.backend);

  detector = await createDetector();

  renderPrediction();
}

app();
