const express = require("express");
const app = express();
const winston = require("winston");
const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:" + socket.id);

  // socket.broadcast.emit("userStatus", { id: socket.id, status: true });

  socket.on("joinRoom", (data) => {
    socket.join(data);
    io.emit("userStatus", { id: data, status: true });
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("declineCall", (data) => {
    io.to(data.to).emit("callDeclined");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:" + socket.id);
    //  io.emit("userStatus", { id: , status: false });
    // socket.broadcast.emit("userStatus", { id: socket.id, status: false });
  });
});

module.exports = io;

//require("./start/prod")(app);
require("./start/logging")();
require("./start/config")();
require("./start/db")();
require("./start/routes")(app);

server.listen(PORT, () => winston.info(`Server is listeninig at ${PORT}`));
