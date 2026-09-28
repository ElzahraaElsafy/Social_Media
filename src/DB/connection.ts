import  mongoose from "mongoose";
import {config} from "dotenv";
config();

async function connectDB() {
    // connection URL
    const url = process.env.MONGO_URL !;
    console.log({MONGO_URL:process.env.MONGO_URL })
    try{
          await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
         });
         console.log("DB is connected sucessfully......"); 
    }catch(error){
        console.log({error});
    }

}
export default connectDB;