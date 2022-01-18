const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/", express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  // socket.on("movement", (e) => {
  //   io.emit("ui-movement", e);
  // });
  socket.on("right_pinch", (e) => {
    io.emit("right-pinch", e);
  });

  socket.on("create_rect", (e) => {
    io.emit("create-rect", e);
  });

  socket.on("pan", (e) => {
    io.emit("pan", e);
  });
  socket.on("zoom", (e) => {
    io.emit("zoom", e);
  });
});

server.listen(8080, () => {
  console.log("listening on *:3000");
});
