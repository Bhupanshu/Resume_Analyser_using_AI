const mongoose = require ('mongoose')

const technicalquestionschema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{_id:false})

const behaviorquestionschema = new mongoose.Schema({
     question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{_id:false})

const skillgapsschema = new mongoose.Schema({
    skills:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        required:true,
        enum:["low","medium","high"]
    },
    note: { type: String }  
     
},{_id:false})

const matchedskillsschema = new mongoose.Schema({   // new
  name: { type: String },
  note: { type: String }
}, { _id: false }) 

const preprationplanschema = new mongoose.Schema({
    days:{
        type:Number,
        required:true
    },
    focus:{
        type:String,
        required:true
    },
    tasks:[{
        type:String,
        required:true
    }]
},{_id:false})

const interviewSchema = new mongoose.Schema({
    jobdescription:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    selfdescription:{
        type:String,
        required:true
    },
    matchscore:{
        type:Number,
        min:0,
        max:100
    } , 
    title: { type: String },                     // new: job role
    summary: { type: String },         
    technicalQuestion:[technicalquestionschema],
    behaviorQuestion:[behaviorquestionschema],
    skillGaps:[skillgapsschema],
    matchedSkills: [matchedskillsschema],  
    preparationPlan:[preprationplanschema], 
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    } 
}, 
{timestamps:true}
) 

const interviewmodel = mongoose.model("interview",interviewSchema);
module.exports=interviewmodel;  