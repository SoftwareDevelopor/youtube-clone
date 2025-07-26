const express=require("express");
const { uploadvideo, getAllVideo, incrementLike, downloadVideo, downloadAndSaveVideo } = require("../Controllers/VideoController");
const { upload } = require("../videofile/videofile");

const videoroute=express.Router();


videoroute.post("/upload", (req, res, next) => {
  
  next();
}, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), (req, res, next) => {
  console.log("After multer middleware:");
  
  next();
}, uploadvideo);

videoroute.get("/getallvideos",getAllVideo)

// 

videoroute.patch("/like/:id", incrementLike);

videoroute.get("/download/:id", downloadVideo);

videoroute.post("/downloadandsave", downloadAndSaveVideo);


module.exports=videoroute