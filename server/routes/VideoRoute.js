const express=require("express");
const { uploadvideo, getAllVideo, incrementLike, downloadVideo, downloadAndSaveVideo } = require("../Controllers/VideoController");
const { upload } = require("../videofile/videofile");

const videoroute=express.Router();

videoroute.post("/upload", upload.single("file"), uploadvideo);

videoroute.get("/getallvideos",getAllVideo)

// ... existing code ...

videoroute.patch("/like/:id", incrementLike);

// ... existing code ...

videoroute.get("/download/:id", downloadVideo);

videoroute.post("/downloadandsave", downloadAndSaveVideo);


module.exports=videoroute