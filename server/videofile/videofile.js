"use strict";
const multer = require("multer");
const path = require("path");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, res, cb) => {
    // Use /tmp/uploads for Render, local uploads otherwise
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
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
