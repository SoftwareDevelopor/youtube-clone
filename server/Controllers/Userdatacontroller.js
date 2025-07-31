const mongoose=require('mongoose')
const path =require('path')


exports.getuserdata=async(req,res)=>{
    try {
        const {name,email,password,phonenumber}=req.body
        console.log(name,email,password)
    } catch (error) {
        console.log(error)
    }
}