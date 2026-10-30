const interviewModel = require("../models/interview.model")
const pdfparse = require("pdf-parse");
const InterviewReport = require("../services/ai.service");

/**
 * @name Getinterviewreport 
 * @description This is will give us a AI Generated Report 
 */

async function GenInterviewReportAI(req, res) {
   console.log("Request body:", req.body);
   const resume = req.file
   if(!resume){
      return res.status(400).json({
         message:"Resume PDF is required"
      })
   }
   try{
      const resumeContent = await (new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
   const { jobdescription, selfdescription } = req.body

   const InterviewReportAI = await InterviewReport({ 
      resume: resumeContent.text,
      jobdescription,
      selfdescription
   });

   console.log("jobdescription:", jobdescription);
    console.log("selfdescription:", selfdescription); 

console.log("AI response:", InterviewReportAI);

   const interviewReport = await interviewModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      jobdescription,
      selfdescription,

      ...InterviewReportAI
   }) 

   res.status(201).json({
      message: "Interview Report Generated Succesfully",
      interviewReport
   })
   }
   catch(err){
     
  console.error("Interview report failed:", err);   // you see the real cause in the terminal
  return res.status(500).json({                     // the frontend gets an answer and stops loading
    message: "Could not generate the interview report. Please try again.",
  });
     }
   }
   

/**
 * @name GetInterviewtoDisplay
 * @description This api will be used to display the user 
 */
async function GetinterviewReporttoDisplay(req,res){
   const {interviewid} = req.params;
   const interviewReport = await interviewModel.findOne({ _id:interviewid , user:req.user.id});
   
   if(!interviewReport){
     return res.status(404).json({
         message:"Interview Report not found"
      })
   }

   return res.status(200).json({
      message:"Interview report found",
      interviewReport 
   })
}

async function Getallinterview (req,res){
   const interviewReports = await interviewModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfdescription -jobdescription -__v -technicalQuestion -behaviorQuestion -skillGaps -preparationPlan ")

    return res.status(200).json({
      message:"Report fetched successfully ",
      interviewReports
    })
}




module.exports = { GenInterviewReportAI,GetinterviewReporttoDisplay,Getallinterview };                 