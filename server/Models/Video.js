const mongoose = require("mongoose");
let videoSchema = mongoose.Schema(
  {
    videotitle: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    filetype: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    filesize: {
      type: String,
      required: true,
    },
    videochannel: {
      type: String,
      required: true,
    },
    like: {
      type: Number,
      required: true,
      default: 0
    },
    views: {
      type: Number,
      required: true,
      default: 0
    },
    uploader: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("videos", videoSchema);
