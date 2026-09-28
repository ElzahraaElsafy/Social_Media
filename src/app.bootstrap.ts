import express from "express";
import {type Express} from "express";
import authRouter from "./module/auth/auth.controller";
import userRouter from "./module/user/user.controller"; 
import { globalError } from "./module/common/response";
import {config}  from "dotenv";
import connectDB from "./DB/connection";
// import { redisConnection } from "./DB/redis";
import redisService  from "./module/common/utils/Services/redis_sevices";
const bootstrap =async ()=>{
    config();
    const app: Express=express();
    app.use(express.json());
    await connectDB();
    await redisService.connection();
    app.get("/",(req:express.Request,res:express.Response,next:express.NextFunction):void=>{
         res.status(200).json({message:"Hello ts"});
    });
    app.use("/auth",authRouter);
    app.use("/user",userRouter);
    app.use(globalError);
    app.listen(8000,()=>{
        console.log("Server is running ");
    })
    console.log("APP is Running");
}

export default bootstrap;