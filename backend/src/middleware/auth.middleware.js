const jwt = require("jsonwebtoken");
const blacklistmodel = require("../models/blacklist.model");

async function authUser(req,res,next){
    const token = req.cookies.Token;
    if(!token){
        return res.status(401).json({
            message:"Token not fouud!!!" 
        }) 
    }  

    const blacklistedtkn = await blacklistmodel.findOne({
        token
    })
    if(blacklistedtkn){
        return res.status(401).json({
            message:"Invalid Token"
        })
    } 

    try{
            const decoded = jwt.verify(token,process.env.JWT_Secret);
            req.user=decoded;
            next(); 
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid Token",
            error:error.message
        })
    }
}

module.exports={authUser};