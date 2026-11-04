const UserModel = require("../models/user.model");
const blacklistmodel= require("../models/blacklist.model")
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 



/**
 * @name registeruser
 * @description register a new user 
 * @access public 
 * **/
async function registeruser(req,res){
    try{
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).json({
            message:"Register first",
            })
        }
        const isuseralreadyexist=await UserModel.findOne({
            $or :  [
                {username},
                {email}
            ]
        })

        if(isuseralreadyexist){
            return res.status(400).json({
                message:"User already exist"
            })
        }

        const hash = await bcrypt.hash(password,10);
        const user = await UserModel.create({ 
            username,
            email,
            password:hash
        })

        const token = jwt.sign({
            id:user._id,
            username:user.username
        },process.env.JWT_Secret,
         {expiresIn:"1d"});

        res.cookie("Token",token,{
            httpOnly:true,
            secure: isProd,                     // HTTPS only when deployed
            sameSite: isProd ? "none" : "lax",
            maxAge: 24*60*60*1000  // 1 day in ms
        });
        res.status(201).json({
            message:"User registered Successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message:"Internal server error", error: error.message });
    }
} 

/**
 * @name Loginuser
 * @description Login User
 * @access public
 * **/
async function loginuser(req,res){ 
    try {
        const {email,password} = req.body;

        const user = await UserModel.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"Invalid User"
            })
        }

        const ispassvalid = await bcrypt.compare(password,user.password);

        if(!ispassvalid){
            return res.status(400).json({
                message:"Invalid password"
            });
        }

        const token = jwt.sign({
            id:user._id,
            username:user.username,
        },process.env.JWT_Secret,
         {expiresIn:"1d"});

        res.cookie("Token",token,{
            httpOnly:true,
            secure: isProd,                  // HTTPS only when deployed
            sameSite: isProd ? "none" : "lax",
            maxAge: 24*60*60*1000  // 1 day in ms 
        });
        res.status(200).json({
            message:"User logged in Successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email 
            }    
        });   
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message:"Internal server error", error: error.message });
    }
}

/**
 * @name Logoutuser
 * @description Logout User
 * @access public
 * **/
async function logoutuser(req,res){
    const token = req.cookies.Token;  // capital "T" — must match how it was set
    if(token){
        await blacklistmodel.create({token});
    }
    res.clearCookie("Token")          // capital "T" — must match how it was set
    res.status(200).json({
        message:"User loggedout successfully"
    })
}

/**
 * @name getmeController
 * @description Get current logged in user
 * @access public
 **/
async function getmeController(req,res){
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
        message:"User fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={registeruser,loginuser,logoutuser,getmeController}