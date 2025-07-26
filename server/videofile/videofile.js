"use strict";
const multer = require("multer");
const path = require("path");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to uploads folder in server root directory
    const uploadPath = path.join(__dirname, "../uploads");
    console.log('Multer destination path:', uploadPath);
    console.log('RENDER env var:', process.env.RENDER);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
    console.log('Multer filename:', filename);
    cb(null, filename);
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: filefilter });
