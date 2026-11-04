require("dotenv").config(); // Loads the enviornment from .env file 
const app = require("./src/app");
const connectDB=require("./src/config/db") 

connectDB();

app.listen(3000,()=>{
    console.log("Server is running on port 3000");   
})  