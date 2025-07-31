const mongoose = require("mongoose");

const userdataschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: Number,
    required: true,
    unique: true,
  },
  logo:{
    type:String,
    required:true,
    unique:true
  }
},{
    timestamps:true
});

module.exports=mongoose.model("Userdata",userdataschema);

