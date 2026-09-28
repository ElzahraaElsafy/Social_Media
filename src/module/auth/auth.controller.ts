import {Router,Request,Response,NextFunction} from "express";
import authService from "./auth.services";
import { successResponse } from "../common/response";
import { LoginSchema, SignupSchema } from "./auth.validation";
import { BadRequestExpection } from "../common/response/app-exception";
import {z} from "zod";
import { validation } from "../../Middelware/validation.middelware";


enum Role {
  user ="user",
  admin ="admin",
}
const authRouter =Router();

authRouter.post(
  "/login",
  validation(LoginSchema),
    async(req:Request , res:Response , next :NextFunction)=>{
        console.log({body:req.body});
              const user = await authService.login(req.body);
                return successResponse({res,
                message:"login Successfully",
                data:user,
})
        
       
})

authRouter.post(
  "/signup",
  validation (SignupSchema),
    async(req:Request,res:Response,next:NextFunction)=>{
        console.log({body:req.body});
              const user = await authService.signup(req.body);
                return successResponse({res,
                message:"SignUp Successfully",
                data:user,
})
        
       
})

export default authRouter;