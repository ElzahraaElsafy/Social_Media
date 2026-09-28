import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../../enums";
import { BadRequestExpection } from "../../response/app-exception";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../interfaces/user.interface";
import {randomUUID} from "crypto";
import { TokenType } from "../../enums/token";
import redisService from "../Services/redis_sevices";
import { object } from "zod";
class tokenService{
  private redisService;
    constructor(){
      this.redisService= redisService;
    }


    accessKey ="lol";
    refreshKey="omnia";

    adminaccessKey ="lol";
    adminrefreshKey="omnia";
   generateToken = ({
   data,
   secret = "",
    expiresIn = "15m",
    audience =["web"],
   }:{
    data :object,
    secret :string,
    expiresIn?:string,
    audience :string[],
   }) => {
  return jwt.sign(data, secret,{
    expiresIn,
    audience,
    issuer:"Social_Media"
  });
};
 detectUserKey=(role :Role)=>{
  switch(role){
    case Role.ADMIN:
      return {
        accessKey:this.adminaccessKey ,
        refreshKey:this.adminrefreshKey,
      };
      break;
      case Role.USER:
        return{
           accessKey:this.accessKey ,
           refreshKey:this.refreshKey,
        };
        default:
          throw new BadRequestExpection( "Invalid Role Intered ");
          break;
  }
}

 verifyToken=(token:string,secret:string)=>{
  return jwt.verify(token,secret);
}
 createCredentional = (user:HydratedDocument<IUser>)=>{
  const {accessKey,refreshKey}=this.detectUserKey(user.role);
  const jti =randomUUID();
  return{
     accessToken:this.generateToken({
        data: {user:user._id,role:user.role,jti },
        expiresIn:"30m",
        secret:accessKey,
        audience:[user.role],
     }),
          refreshToken:this.generateToken({
        data: {user:user._id,role:user.role,jti },
        expiresIn:"7d",
        secret:refreshKey,
        audience:[user.role],

     }),
    };

}

 decodeToken=async (token:string,tokenType:TokenType):JwtPayload & {user:string}=>{
  const data =jwt.decode(token);
  console.log({data});
  if(! data.audience.length){
     throw new BadRequestExpection("token aud not found");
  }
  if(data.jti && await this.redisService.get(
   tokenKey({userId :data.user,jti : data.jti}))){
     throw new  BadRequestExpection("Login Again");
  }

  if(!(data.aud.length)){
    throw new BadRequestExpection("Invalid Token Request")
  }

    const {accessKey,refreshKey}=this.detectUserKey(data.aud[0]);
    
    const decoded = this.verifyToken(token,
      tokenType ==tokenType.ACCESS ?accessKey :refreshKey,
    )as JwtPayload&{user:string};
    console.log({decoded});
    return decoded;
}

}

const TokenService =new tokenService();
export default  TokenService;