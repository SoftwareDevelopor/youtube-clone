const express = require('express');
const { addPoints, getPoints, hasFreeDownloadToday, recordDownload } = require('../Controllers/UserController');
const userrouter = express.Router();

// POST /api/user/addPoints
userrouter.post('/addPoints', addPoints);

// POST /api/user/getPoints
userrouter.post('/getPoints', getPoints);

userrouter.post('/hasFreeDownloadToday', hasFreeDownloadToday);

userrouter.post('/recordDownload', recordDownload);

module.exports = userrouter; 