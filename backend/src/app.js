const express = require ("express");
const cookieparser = require("cookie-parser");
const cors = require("cors")


const app = express();

app.use(cookieparser())
app.use(express.json());

app.set("trust proxy", 1);
app.use(cors({ 
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials:true
}))
//Import routes files
const authRouter=require("./routes/auth.routes");
const interviewRouter=require("./routes/interview.routes");

//Routes
app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter); 

module.exports=app;       