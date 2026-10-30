const mongoose = require("mongoose");

async function connectDB() {
    try{

    await mongoose.connect(process.env.Mongo_URI);

    console.log("Database Connected Successfully")
    }
    catch(err){
        console.log(err);
    }
}
module.exports=connectDB;  