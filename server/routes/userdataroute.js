const express=require('express')
const { getuserdata } = require('../Controllers/Userdatacontroller')


const userdataroute=express.Router()


userdataroute.post("/getuserdata",getuserdata)

module.exports=userdataroute