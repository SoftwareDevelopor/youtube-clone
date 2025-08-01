const mongoose = require('mongoose')
const path = require('path')

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

        // Here you can add your logic to save user data to database
        // For example:
        // const userData = new UserData({ name, email, password, phonenumber });
        // await userData.save();

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