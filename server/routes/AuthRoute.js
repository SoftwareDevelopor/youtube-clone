const express = require('express');
const { 
    register, 
    login, 
    logout, 
    getProfile, 
    updateProfile, 
    changePassword,
    verifyToken 
} = require('../Controllers/AuthController');

const authRouter = express.Router();

// Public routes (no authentication required)
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Protected routes (authentication required)
authRouter.get('/profile', verifyToken, getProfile);
authRouter.put('/profile', verifyToken, updateProfile);
authRouter.put('/change-password', verifyToken, changePassword);

module.exports = authRouter; 