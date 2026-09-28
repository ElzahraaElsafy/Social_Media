import {Role,Gender,System} from "../enums";

export type IUser ={
   fname:string ,
   lname:string,
   email:string,
   password:string,
   confirmEmail:boolean,
   role:Role,
   gender:Gender,
   age:number,
   phone?:string,
   profileImage?:string,
   coverImage ?:string[], 
   address :{
    city:string,
    country:string,
   },
   isActive:boolean,
   provider: System,
   createdAt?:Date,
   updatedAt?:Date,
   status:string,
   changeCreditional : Date,
oldPasswords :string [],
}