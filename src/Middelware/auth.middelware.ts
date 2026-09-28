import { NextFunction ,Request,Response} from "express";
import { BadRequestExpection, ForbiddenExpection, NotFoundExpection } from "../module/common/response/app-exception";
import TokenService from "../module/common/utils/Services/tokenServices";
import { TokenType } from "../module/common/enums/token";
import { UserRepository } from "../DB/repo/user.repo";
export const auth=async (req:Request,res:Response,next:NextFunction)=>{
    const userRepo = new UserRepository();
   console.log({req:req.headers.authorization}) ;
   if(req.headers.authorization){
      throw new BadRequestExpection("token required")
   }
   const token = req.headers.authorization.split(" ")[1] || " ";
   if(! token ){
    throw new BadRequestExpection( "token is required ");
   }
 const decoded = await TokenService decodeToken(token,tokenType.ACCESS);
//    const user = await findOne({
//         model:User,
//         filter:{
//         _id:decoded.user
//     }
//    });
//    console.log({user});
const  user=await userRepo.findOne({
    filter:{_id:decoded.user},

})
   if(!user){
      throw new NotFoundExpection("user not found")
   }
   if(
      user.changeCreditional &&
      user.changeCreditional.getTime()>=decoded.iat*1000){   ///get give time in millesecand
     throw new  BadRequestExpection( "Login Again")
   }




  const revoketoken = await redisService.get(tokenkey({userId :user.id,jti:decodeToken.jti}));
console.log({revoketoken});

  if(decoded.jti && revoketoken){
   // await findOne({
   //    model :Token ,
   // filter :{
   //    jti :decoded.jti,
   // }
   // })){
throw new  BadRequestExpection("Forbidden")
  }
req.user =user;
 req.decoded =decoded ;
   next ();
};
export const authorization =(...roles)=>{
return (req:Request,res:Response,next:NextFunction)=>{
   if(! roles.includes(req.user.role)){
      throw new ForbiddenExpection( "Forbidden");
   }
   next();
}
}