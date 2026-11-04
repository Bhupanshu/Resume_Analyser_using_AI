const express = require("express");
const authRouter=express.Router();

//Import Controller Files
const authController = require("../controller/auth.controller")
const authMiddleware=require("../middleware/auth.middleware");



/**
 * @route POST api/auth/register
 * @description Register new user 
 * @access public
 **/
authRouter.post("/register",authController.registeruser);

/**
 * @route POST api/auth/register
 * @description Login user
 * @access public
**/
authRouter.post("/login",authController.loginuser);


/**
 * @route GET api/auth/logout
 * @description Logout user
 * @access public
**/
authRouter.get("/logout",authController.logoutuser);

/**
 * @route GET api/auth/get-me
 * @description Get current logged in user
 * @access public
**/
authRouter.get("/get-me",authMiddleware.authUser,authController.getmeController);



module.exports=authRouter;  