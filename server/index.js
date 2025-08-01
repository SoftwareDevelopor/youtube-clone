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
const userdataroute = require("./routes/userdataroute.js");
const authRouter = require("./routes/AuthRoute");



dotenv.config();

const app = express();

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ['https://youtube-clone-one-dun.vercel.app', 'https://youtube-clone-one-dun.vercel.app/'],
    methods: ["GET", "POST"],
    credentials: true
  },
});


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const allowedOrigins = [
      'https://youtube-clone-one-dun.vercel.app',
      'https://youtube-clone-one-dun.vercel.app/'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

io.on("Connection", (socket) => {
  
  
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    
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
    
    io.to(roomId).emit("recording-status", "started");

    // Create a new recording entry in DB
    try {
      currentRecording = new Recording({
        roomId: roomId,
        recordedBy: socket.id, // Or actual user ID if authenticated
        startTime: new Date(),
      });
      await currentRecording.save();
      
    } catch (err) {
      console.error("Error saving recording start to DB:", err);
    }
  });

  socket.on("stop-recording", async (roomId) => {
    
    io.to(roomId).emit("recording-status", "stopped");

    if (currentRecording) {
      try {
        currentRecording.endTime = new Date();
        // In a real app, you'd save the actual video file on the server
        // and store its path here. For now, just marking end time.
        await currentRecording.save();
        
      } catch (err) {
        console.error("Error saving recording stop to DB:", err);
      } finally {
        currentRecording = null;
      }
    }
  });

  socket.on("Disconnect", () => {
    
    socket.broadcast.emit("User connected", socket.id);
  });
});

// Serve uploads folder statically
const uploadsPath = process.env.RENDER ? path.join(__dirname, "uploads") : '/tmp/uploads' ;
app.use("/uploads", express.static(uploadsPath));

// Body parsing middleware - MUST come before routes
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyparser.json());

app.get("/", (request, response) => {
  response.send("Youtube API Working !");
});

app.use("/video", videoroute);
app.use("/api/user", userrouter);
app.use("/user/userdata",userdataroute)
app.use("/api/auth", authRouter);
server.listen(5000,()=>{
  console.log('Server is running !')
})

const dburl = process.env.DB_URL;

mongoose
  .connect(dburl)
  .then(() => {
    console.log("MongoDB connection established successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

