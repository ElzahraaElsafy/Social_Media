import { RedisClientType } from "@redis/client";
import { config } from "dotenv";
import { createClient } from "redis";
import { BadRequestExpection } from "../../response/app-exception";
import {redisClient} from "redis" ;
class RedisServices{
private redisClient: RedisClientType;  
  
    constructor(){
        config();
       this.redisClient = createClient({
        url:process.env.REDIS_URL! as string,
       });
       this.handleEvent();
    }
public async  connection (){
    try{
        await this.redisClient.connect();
        console.log("Redis connected successfully ...")
    }catch(error){
        console.log("Redis connect error :",error)
    }
} 

private handleEvent(){
    this.redisClient.on("error" ,(err)=>{
        console.log({err});
    })
}

 prefixTokenKey=({userId}:{userId :string}) =>{
 return `TOKEN ::${userId}`;
};


 tokenKey=({userId,jti} :{userId :string ,jti:string}) =>{
 return `TOKEN ::${userId}::${jti}`;
};

 otpKey =(email : string )=>{
   return  `otp::${email}`
};

 forgetotpKey =(email :string)=>{
   return  `otp::ForgetPassword::${email}`
};

 forgetotpCounterKey =(email :string)=>{
   return  `otp::Forget Counter Password::${email}`
};


 otpCounterKey =(email: string)=>{
   return  `otp::${email}`
};
 async get(key:string) {
        try{
            const result =await redisClient.get(key);
            if(!result) return null;
            try{
                return JSON.parse(result);
            }catch(error){
                return result;
            }
        }catch(error){
            console.log(error);
            throw  new BadRequestExpection( "internal server error");
        }
    }
    async set({key,val,ttl}:{
        key:string,
        val:string,
        ttl?:number,
    }){
    try{
        return ttl
        ? await  this.redisClient.set(key,JSON.stringify(val),{EX : ttl})
        :await this.redisClient.set(key,JSON.stringify(val))

    }catch(error){
        console.log({error});
        throw  new BadRequestExpection("internal server error");
    }
}
    async delete (key:string){
        return await this.redisClient.del(key);
    }
    async ttl(key:string){
        return await redisClient.ttl(key);
    }
    async exists(key:string){
        return await redisClient.exists(key);
    }
    async decr(key:string){
        return await redisClient.decr(key);
    }
    async incr(key:string){
        return await redisClient.incr(key);
    }
    async expire({key,ttl}:{key:string,ttl:number}){
        return await redisClient.expire(key,ttl);
    }
     async keys(key:string){
        return await redisClient.keys(key);
    }

}

const redisService= new RedisServices();
export default redisService;