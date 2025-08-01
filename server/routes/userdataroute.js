const express = require('express')
const { getuserdata, getAllUsers, getUserById } = require('../Controllers/Userdatacontroller')
const { verifyToken } = require('../Controllers/AuthController')

const userdataroute = express.Router()

// Legacy endpoint (for backward compatibility)
userdataroute.post("/getuserdata", getuserdata)

// New user management endpoints (protected)
userdataroute.get("/users", verifyToken, getAllUsers)
userdataroute.get("/users/:userId", verifyToken, getUserById)

module.exports = userdataroute