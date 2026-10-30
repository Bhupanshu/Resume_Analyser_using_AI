const mongoose = require("mongoose");

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required:true,
    },
    email:{
        type:String,
        unique: true,
        required:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    }
})
const UserModel = mongoose.model("user",UserSchema); 
module.exports=UserModel;    