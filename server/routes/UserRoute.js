const express = require('express');
const { addPoints, getPoints, hasFreeDownloadToday, recordDownload, activatePremium, checkPremiumStatus } = require('../Controllers/UserController');
const userrouter = express.Router();

// POST /api/user/addPoints
userrouter.post('/addPoints', addPoints);

// POST /api/user/getPoints
userrouter.post('/getPoints', getPoints);

userrouter.post('/hasFreeDownloadToday', hasFreeDownloadToday);

userrouter.post('/recordDownload', recordDownload);

// Premium plan routes
userrouter.post('/activatePremium', activatePremium);
userrouter.post('/checkPremiumStatus', checkPremiumStatus);

module.exports = userrouter; 