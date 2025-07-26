const express=require("express");
const { uploadvideo, getAllVideo, incrementLike, downloadVideo, downloadAndSaveVideo } = require("../Controllers/VideoController");
const { upload } = require("../videofile/videofile");

const videoroute=express.Router();

// Test route to check if requests are reaching the server
videoroute.get("/test", (req, res) => {
  res.json({ message: "Video route is working" });
});

videoroute.post("/upload", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), uploadvideo);

videoroute.get("/getallvideos",getAllVideo)

// ... existing code ...

videoroute.patch("/like/:id", incrementLike);

// ... existing code ...

videoroute.get("/download/:id", downloadVideo);

videoroute.post("/downloadandsave", downloadAndSaveVideo);


module.exports=videoroute