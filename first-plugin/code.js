// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Hide the plugin UI to be able to see the whole Figma layer.
figma.ui.hide();
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

let layers = -1;
const nodes = [];
figma.ui.onmessage = (msg) => {
  // Messages sent from ui.html
  if (msg.type === "event") {
    if (msg.msg === "start-pinch") {
      layers++;
    }
  }
  if (msg.type === "create-rect") {
    if (layers === 0) {
      figma.currentPage.children[0].visible = true;
      figma.currentPage.children[0].x = msg.msg.topX;
      figma.currentPage.children[0].y = msg.msg.topY;
      nodes.push(figma.currentPage.children[0]);
    }
    if (layers === 1) {
      figma.currentPage.children[1].visible = true;
      figma.currentPage.children[1].x = msg.msg.topX;
      figma.currentPage.children[1].y = msg.msg.topY;
    }
    if (layers === 2) {
      figma.currentPage.children[2].visible = true;
      figma.currentPage.children[2].x = msg.msg.topX;
      figma.currentPage.children[2].y = msg.msg.topY;
    }
    if (layers === 3) {
      figma.currentPage.children[3].visible = true;
      figma.currentPage.children[3].x = msg.msg.topX;
      figma.currentPage.children[3].y = msg.msg.topY;
    }
  }
  if (msg.type === "pan") {
    // figma.viewport.center = { x: msg.msg.x, y: -msg.msg.y * 10 };
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  if (msg.type === "zoom") {
    const normalizedZoom = normalize(msg.msg, 1200, 0);
    figma.viewport.zoom = normalizedZoom;
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
const normalize = (val, max, min) =>
  Math.max(0, Math.min(1, (val - min) / (max - min)));
