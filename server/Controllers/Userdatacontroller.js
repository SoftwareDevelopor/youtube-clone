const mongoose = require('mongoose')
const path = require('path')
const Userdata = require('../Models/Userdata')

exports.getuserdata = async (req, res) => {
    try {
        // Check if req.body exists and has the required properties
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }

        const { name, email, password, phonenumber } = req.body;
        
        // Check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Required fields (name, email, password) are missing'
            });
        }

        console.log('Received user data:', { name, email, password, phonenumber });

        // Check if user already exists
        const existingUser = await Userdata.findOne({ 
            $or: [{ email }, { phonenumber }] 
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone number already exists'
            });
        }

        // Create new user (this is now handled by the auth system)
        // This endpoint can be used for legacy compatibility
        res.status(200).json({
            success: true,
            message: 'User data received successfully',
            data: { name, email, phonenumber } // Don't send password back
        });

    } catch (error) {
        console.error('Error in getuserdata:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Get all users (admin function)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Userdata.find({}).select('-password');
        
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await Userdata.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}