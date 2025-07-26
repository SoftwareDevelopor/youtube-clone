const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const http = require("http");
const dotenv = require("dotenv");

const { MongoClient, ServerApiVersion } = require('mongodb');

const videoroute = require("./routes/VideoRoute");

const fs = require("fs");
const path = require("path");
const userrouter = require("./routes/UserRoute");
const socketio = require("socket.io");


const Recording = require("./Models/Recording.js"); // Fixed casing to match file system



dotenv.config();

const app = express();

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "https://youtube-clone-one-dun.vercel.app/",
    method: ["GET", "POST"],
  },
});


app.use(cors({
  origin: 'https://youtube-clone-one-dun.vercel.app/',
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
app.use("uploads", express.static(path.join(__dirname, "uploads"))); //this will implement the converting the backslash with the forward slash. then it works definitely.y

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.get("/", (request, response) => {
  response.send("Youtube API Working !");
});

app.use(bodyparser.json());

app.use("video", videoroute);
app.use("api/user", userrouter);

server.listen(5000,()=>{
  console.log('Server is running !')
})


const dburl = process.env.DB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(dburl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("saurabhkumar13618").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

