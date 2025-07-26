const { default: mongoose } = require("mongoose");
const Video = require("../Models/Video");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

exports.uploadvideo = async (req, res) => {
  console.log('Incoming upload request');
  
  
  if (!req.files || !req.body) {
    return res.status(404).json({ message: "Upload them", files: req.files, body: req.body });
  }
  
  try {
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];
    const file = new Video({
      videotitle: req.body.videotitle,
      filename: videoFile.originalname,
      filepath: videoFile.path,
      filetype: videoFile.mimetype,
      filesize: videoFile.size,
      videochannel: req.body.videochannel,
      uploader: req.body.uploader,
      description: req.body.description,
      thumbnail: thumbnailFile.path,
      like: 0,
      views: 0,
      _id: new mongoose.Types.ObjectId(req.body.id)
    });
    await file.save();
    return res.status(201).json("file uploaded");
  } catch (error) {
    console.log('Upload error:', error);
    return res.status(500).json({ message: "Something Went Wrong !", error: error.message });
  }
};

exports.getAllVideo = async (req, res) => {
  try {
    let file = await Video.find();
    return res.status(200).send(file);
  } catch (error) {
    console.log(error);
  }
};

// Increment like count for a video
// ... existing code ...

// Increment like count for a video
exports.incrementLike = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { like: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");

    const filePath = path.join(__dirname, "..", video.filepath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }
    res.download(filePath, video.videotitle + path.extname(filePath));
  } catch (err) {
    res.status(500).send("Error downloading video");
  }
};

exports.downloadAndSaveVideo = async (req, res) => {
  const { url, videotitle, videochannel, uploader, description, thumbnail } =
    req.body;
  if (
    !url ||
    !videotitle ||
    !videochannel ||
    !uploader ||
    !description ||
    !thumbnail
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    // Download video file
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });
    const filetype = response.headers["content-type"] || "video/mp4";
    const ext = filetype.split("/")[1] || "mp4";
    const filename = `${Date.now()}-${videotitle.replace(/\s+/g, "_")}.${ext}`;
    const filepath = path.join("server", "uploads", filename);
    const fullpath = path.join(__dirname, "..", "uploads", filename);
    const writer = fs.createWriteStream(fullpath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    const stats = fs.statSync(fullpath);
    const filesize = stats.size;

    // Download thumbnail image
    const thumbResponse = await axios({
      method: "GET",
      url: thumbnail,
      responseType: "stream",
    });
    const thumbType = thumbResponse.headers["content-type"] || "image/png";
    const thumbExt = thumbType.split("/")[1] || "png";
    const thumbFilename = `${Date.now()}-${videotitle.replace(
      /\s+/g,
      "_"
    )}-thumb.${thumbExt}`;
    const thumbPath = path.join("server", "uploads", thumbFilename);
    const thumbFullPath = path.join(__dirname, "..", "uploads", thumbFilename);
    const thumbWriter = fs.createWriteStream(thumbFullPath);
    thumbResponse.data.pipe(thumbWriter);
    await new Promise((resolve, reject) => {
      thumbWriter.on("finish", resolve);
      thumbWriter.on("error", reject);
    });

    // Save to database
    const file = new Video({
      videotitle,
      filename,
      filepath,
      filetype,
      filesize,
      videochannel,
      uploader,
      description,
      thumbnail: thumbPath,
      like: 0,
      views: 0,
      _id: new mongoose.Types.ObjectId(),
    });
    await file.save();
    return res
      .status(201)
      .json({
        message: "Video and thumbnail downloaded and saved",
        video: file,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to download and save video/thumbnail" });
  }
};
