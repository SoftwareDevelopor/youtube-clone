const express=require("express");
const { uploadvideo, getAllVideo, incrementLike, downloadVideo, downloadAndSaveVideo } = require("../Controllers/VideoController");
const { upload } = require("../videofile/videofile");

const videoroute=express.Router();


videoroute.post("/upload", (req, res, next) => {
  console.log("Upload route hit");
  console.log("Headers:", req.headers);
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  next();
}, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), (req, res, next) => {
  console.log("After multer middleware:");
  console.log("req.files:", req.files);
  console.log("req.body:", req.body);
  next();
}, uploadvideo);

videoroute.get("/getallvideos",getAllVideo)

// ... existing code ...

videoroute.patch("/like/:id", incrementLike);

// ... existing code ...

videoroute.get("/download/:id", downloadVideo);

videoroute.post("/downloadandsave", downloadAndSaveVideo);


module.exports=videoroute