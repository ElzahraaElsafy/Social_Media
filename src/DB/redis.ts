import {config} from "dotenv";
import { createClient } from "redis";

config();
export const client=createClient({
      url:process.env.REDIS_URL! as string ,
        });
 export const redisConnection = async() =>{
            try{
                await client.connect();
             console.log("Redis is connected sucessfully......"); 
        }
        catch(error){
            console.log({error});
        }
    }

export default  redisConnection();    
 
