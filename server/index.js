const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Dummy puzzle JSON for now
const samplePuzzle = {
  title: "Sample",
  grid: [["C", "", "", "", ""], ["", "", "", "", ""]],
  clues: { across: ["1. A test clue"], down: ["1. A vertical clue"] },
};

let queue = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_queue", () => {
    queue.push(socket);
    if (queue.length >= 2) {
      const [player1, player2] = queue.splice(0, 2);
      const room = `match_${Date.now()}`;
      player1.join(room);
      player2.join(room);

      io.to(room).emit("puzzle", samplePuzzle);
    }
  });

  socket.on("disconnect", () => {
    queue = queue.filter((s) => s.id !== socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
