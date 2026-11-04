const express = require ("express");

//Imports the files
const middleware = require ("../middleware/auth.middleware"); 
const interviewController = require("../controller/interview.controller"); 
const {upload}=require("../middleware/interview.middleware");

const interviewRouter = express.Router();

/**
 * @route POST api/auth/Interview
 * @description Generate interview report
 * @access private
**/ 
interviewRouter.post("/Interviewai",middleware.authUser,upload.single("resume"), interviewController.GenInterviewReportAI);

/**
 * @route Get api/auth/Interview/:interviewid
 * @description This is use to display the report using inetrviewid
 * @access private
 */
interviewRouter.get("/report/:interviewid",middleware.authUser,interviewController.GetinterviewReporttoDisplay)

/**
 * @route Get api/auth/interview
 * @description Get all report of the logged in user 
 * @access private 
 */
interviewRouter.get("/",middleware.authUser,interviewController.Getallinterview)

/**
 * @route get api/auth/delete
 * @description Delete users report
 * **/
interviewRouter.delete("/report/:interviewid", middleware.authUser, interviewController.DeleteInterviewReport)
 
module.exports=interviewRouter;     