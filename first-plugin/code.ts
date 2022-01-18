// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.hide();

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
const rectangles = [];
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === "create-rectangles") {
  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

  // if (msg.type === "move-rectangle-x") {
  //   // rectangles[0].resize(msg.msg.x, 10);
  //   // rect.y = msg.msg.y;

  //   const rect = figma.createRectangle();
  //   rect.x = Math.random() * 10 * 150;
  //   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
  //   figma.currentPage.appendChild(rect);
  //   nodes.push(rect);
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

  if (msg.type === "create-rect") {
    if (rectangles.length === 0) {
      const rect = figma.createRectangle();
      rect.x = msg.msg.topX;
      rect.y = msg.msg.topY;
      if (msg.msg.height > 0.01) {
        rect.resize(msg.msg.width, msg.msg.height);
        rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
        rectangles.push(rect);
        figma.currentPage.appendChild(rect);
      }
    }

    if (rectangles.length === 1) {
      rectangles[0].x = msg.msg.topX;
      rectangles[0].y = msg.msg.topY;
      rectangles[0].resize(msg.msg.width, msg.msg.height);
    }

    // figma.currentPage.selection = rect;
    // figma.viewport.scrollAndZoomIntoView(rect);
  }

  if (msg.type === "pan") {
    if (rectangles.length) {
      rectangles[0].x = msg.msg.x;
      rectangles[0].y = msg.msg.y;
    }
  }

  if (msg.type === "zoom") {
    if (rectangles.length) {
      // console.log(msg.msg);
      // rectangles[0].x = msg.msg;
      // rectangles[0].y = msg.msg;
      const normalizedZoom = normalize(msg.msg, 1200, 0);
      // console.log(normalizedZoom);
      figma.viewport.zoom = normalizedZoom;
    }
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};

const normalize = (val, max, min) =>
  Math.max(0, Math.min(1, (val - min) / (max - min)));

// const rectangles = [];
// const nodes: SceneNode[] = [];
// for (let i = 0; i < 5; i++) {
//   const rect = figma.createRectangle();
//   rect.x = i * 150;
//   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
//   figma.currentPage.appendChild(rect);
//   nodes.push(rect);
//   rectangles.push(rect);
// }
// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);
