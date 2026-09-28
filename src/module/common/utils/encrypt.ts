import crypto from "crypto";
import { BadRequestExpection } from "../response/app-exception";

const key=Buffer.from("12345678901234567890123456789012"); // 32-byte key
const iv=crypto.randomBytes(16); // 16-byte IV
export const encrypt = ({text} :{text :string} ) => {
  let cipher =  crypto.createCipheriv("aes-256-ccm",key,iv)
    cipher.update(text,"utf8","hex");   //transorm text to hex 
    let encrypted=cipher.final("hex");
    console.log({encrypted});
    encrypted +=cipher.final("hex");
    return `{iv.toString("hex")}:${encrypted}`

}
export const decrypt=({text} :{text :string} )=>{
    const [ivHex,encrypted]=text.split(":");
    if(!ivHex || !encrypted){
      throw new BadRequestExpection("invalid inHex or encrypted");
    }
    const iv=Buffer.from (ivHex as string  , "hex");
   const decipher= crypto.createDecipheriv("aes-256-ccm",key,iv);
   let decryted=decipher.update(encrypted as string ,"hex","utf-8");
   decryted += decipher.final("utf-8");
   return decryted;

}
// export default encrypt();
//  decrypt();