const mongoose = require("mongoose")
const userSchema=mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    channelname: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    joinedon:{
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model("user", userSchema);