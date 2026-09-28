import{Router,Request,Response,NextFunction} from "express";
// import { APPException } from "../common/response/app-exception";

const userRouter = Router();

userRouter.get("/",(req:Request,res:Response,next:NextFunction)=>{

    // throw new  APPException("Invalid API",400)
    // throw new Error ("Invalid User",{
    //     cause:{
    //         status:400,
    //         message:"Invalid User",
    //     }
    // })
    return res.status(200).json({message:"user api"});
});


export default userRouter;