const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/", express.static("public"));

// app.get("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://www.figma.com");
//   res.sendFile(__dirname + "/index.html");
// });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("movement", (e) => {
    // console.log("ui-movement", e);
    io.emit("ui-movement", e);
  });
});

server.listen(8080, () => {
  console.log("listening on *:3000");
});
