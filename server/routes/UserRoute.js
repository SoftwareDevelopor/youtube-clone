const express = require('express');
const { addPoints, hasFreeDownloadToday, recordDownload } = require('../Controllers/UserController');
const userrouter = express.Router();


// POST /api/user/addPoints
userrouter.post('/addPoints', addPoints);
userrouter.post('/hasFreeDownloadToday', hasFreeDownloadToday);
userrouter.post('/recordDownload', recordDownload);

module.exports = userrouter; 