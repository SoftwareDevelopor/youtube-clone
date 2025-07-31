const mongoose = require("mongoose");
const Video = require("../Models/Video");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

exports.uploadvideo = async (req, res) => {
  // Check if files exist
  if (!req.files || !req.files.video) {
    return res.status(400).json({ 
      message: "Video file is required (field name: 'video')", 
      files: req.files, 
      body: req.body 
    });
  }
  
  
  try {
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    // Generate a unique ID if not provided
    const videoId = req.body.id || new mongoose.Types.ObjectId().toString();
    // Create full URLs for the files
    const baseUrl = 'https://youtube-clone-oprs.onrender.com';
    const videoFilename = path.basename(videoFile.path);
    const thumbnailFilename = thumbnailFile ? path.basename(thumbnailFile.path) : "";
    const videoUrl = `${baseUrl}/uploads/${videoFilename}`;
    const thumbnailUrl = thumbnailFile ? `${baseUrl}/uploads/${thumbnailFilename}` : "";
    const file = new Video({
      videotitle: req.body.videotitle,
      filename: videoFile.originalname,
      filepath: videoUrl,
      filetype: videoFile.mimetype,
      filesize: videoFile.size,
      videochannel: req.body.videochannel,
      uploader: req.body.uploader,
      description: req.body.description,
      thumbnail: thumbnailUrl,
      like: 0,
      views: 0,
      _id: new mongoose.Types.ObjectId(videoId)
    });
    await file.save();
    return res.status(201).json({ message: "File uploaded successfully", videoId: file._id });
  } catch (error) {
    console.log('Upload error:', error);
    return res.status(500).json({ 
      message: "Something Went Wrong!", 
      error: error.message 
    });
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
exports.incrementLike = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Incrementing like for video ID:', id);
    
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { like: 1 } },
      { new: true }
    );
    
    console.log('Updated video:', video);
    
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    console.log('Error incrementing like:', err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      console.log('Video not found for ID:', req.params.id);
      return res.status(404).json({ message: "Video not found" });
    }
    
    console.log('Download request for video:', video.videotitle);
    console.log('File URL:', video.filepath);
    
    // Set proper headers for video download
    res.setHeader('Content-Type', video.filetype || 'video/mp4');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Extract filename from URL for download name
    const filename = path.basename(video.filepath);
    const fileExtension = path.extname(filename) || '.mp4';
    const downloadFilename = `${video.videotitle.replace(/[^a-z0-9]/gi, '_')}${fileExtension}`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    
    // Stream the file directly from the URL with better error handling
    try {
      const response = await axios({
        method: 'GET',
        url: video.filepath,
        responseType: 'stream',
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      // Check if response is successful
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Set content length if available
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
      
      // Pipe the response stream to the client
      response.data.pipe(res);
      
      // Handle stream errors
      response.data.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error streaming video" });
        }
      });
      
    } catch (streamError) {
      console.error('Error streaming video:', streamError);
      
      // Fallback: try to send the video URL directly
      if (!res.headersSent) {
        res.status(200).json({ 
          message: "Video streaming failed, using direct URL",
          videoUrl: video.filepath,
          filename: downloadFilename
        });
      }
    }
    
  } catch (err) {
    console.error('Error downloading video:', err);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Error downloading video",
        error: err.message 
      });
    }
  }
};

exports.downloadAndSaveVideo = async (req, res) => {
  try {
    console.log('downloadAndSaveVideo called');
    console.log('req.body:', req.body);
    console.log('req.headers:', req.headers);
    
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ 
        message: "Request body is missing. Make sure to send JSON data.",
        error: "req.body is undefined"
      });
    }
    
    const { url, videotitle, videochannel, uploader, description, thumbnail } = req.body;
    
    // Validate required fields
    if (!url || !videotitle || !videochannel || !uploader || !description || !thumbnail) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["url", "videotitle", "videochannel", "uploader", "description", "thumbnail"],
        received: Object.keys(req.body)
      });
    }
    
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
    console.log('downloadAndSaveVideo error:', error);
    return res
      .status(500)
      .json({ 
        message: "Failed to download and save video/thumbnail",
        error: error.message
      });
  }
};
