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
let layers = -1;
const nodes = [];
figma.ui.onmessage = (msg) => {
    // console.log(figma.currentPage.children);
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
    let rect;
    if (msg.type === "event") {
        if (msg.msg === "start-pinch") {
            // rect = figma.createRectangle();
            // rectangles.push(rect);
            layers++;
        }
    }
    if (msg.type === "create-rect") {
        // const rect = rectangles[rectangles.length - 1];
        // rect.x = msg.msg.topX;
        // rect.y = msg.msg.topY;
        // if (msg.msg.height > 0.01) {
        //   rect.resize(msg.msg.width, msg.msg.height);
        //   rect.fills = [{ type: "SOLID", color: { r: 0.8, g: 0.14, b: 0.7 } }];
        //   figma.currentPage.appendChild(rect);
        // }
        // const background = figma.getNodeById(figma.currentPage.children[0].id);
        // console.log(background);
        // console.log(msg.msg.topX);
        // console.log(figma.currentPage.children[0]);
        if (layers === 0) {
            figma.currentPage.children[0].visible = true;
            figma.currentPage.children[0].x = msg.msg.topX;
            figma.currentPage.children[0].y = msg.msg.topY;
            nodes.push(figma.currentPage.children[0]);
            // figma.currentPage.children[0].resize(msg.msg.width, msg.msg.height);
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
        // if (rectangles.length) {
        const normalizedZoom = normalize(msg.msg, 1200, 0);
        figma.viewport.zoom = normalizedZoom;
        // }
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
const normalize = (val, max, min) => Math.max(0, Math.min(1, (val - min) / (max - min)));
