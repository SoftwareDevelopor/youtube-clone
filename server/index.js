const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const videoroute = require("./routes/VideoRoute");

const fs = require("fs");
const path = require("path");
const userrouter = require("./routes/UserRoute");
const socketio = require("socket.io");

const Recording = require("./Models/Recording.js"); // Fixed casing to match file system

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

app.use(cors());

io.on("Connection", (socket) => {
  console.log(socket);
  console.log("A user is connected", socket.id);
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected", userId); // Notify others in the room
  });

  // WebRTC Signaling
  socket.on("signal", (data) => {
    // data contains targetId (recipient socket ID) and signal (WebRTC signaling data)
    io.to(data.targetId).emit("signal", {
      senderId: socket.id,
      signal: data.signal,
    });
  });

  // Screen Sharing Signal
  socket.on("screen-share-signal", (data) => {
    io.to(data.targetId).emit("screen-share-signal", {
      senderId: socket.id,
      signal: data.signal,
    });
  });
  let currentRecording = null; // To store recording object

  socket.on("start-recording", async (roomId) => {
    console.log(`Recording started in room: ${roomId}`);
    io.to(roomId).emit("recording-status", "started");

    // Create a new recording entry in DB
    try {
      currentRecording = new Recording({
        roomId: roomId,
        recordedBy: socket.id, // Or actual user ID if authenticated
        startTime: new Date(),
      });
      await currentRecording.save();
      console.log("Recording entry created in DB:", currentRecording._id);
    } catch (err) {
      console.error("Error saving recording start to DB:", err);
    }
  });

  socket.on("stop-recording", async (roomId) => {
    console.log(`Recording stopped in room: ${roomId}`);
    io.to(roomId).emit("recording-status", "stopped");

    if (currentRecording) {
      try {
        currentRecording.endTime = new Date();
        // In a real app, you'd save the actual video file on the server
        // and store its path here. For now, just marking end time.
        await currentRecording.save();
        console.log("Recording entry updated in DB:", currentRecording._id);
      } catch (err) {
        console.error("Error saving recording stop to DB:", err);
      } finally {
        currentRecording = null;
      }
    }
  });

  socket.on("Disconnect", () => {
    console.log("User Connected", socket.id);
    socket.broadcast.emit("User connected", socket.id);
  });
});

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //this will implement the converting the backslash with the forward slash. then it works definitely.y

app.use(express.json({ extended: true }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.send("Youtube API Working !");
});

app.use(bodyparser.json());

app.use("/video", videoroute);
app.use("/api/user", userrouter);

server.listen(5000, () => {
  console.log("Server is Working Fine !");
});

const dburl = process.env.DB_URL;

mongoose
  .connect(dburl)
  .then(() => {
    console.log("Connection is Established !");
  })
  .catch((error) => {
    console.log(error);
  });
