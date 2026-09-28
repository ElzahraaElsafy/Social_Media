import * as z from "zod"; 
import { Request } from "express";
 enum Role{
    user ="user",
    admin ="admin",
 }
export const LoginSchema= {
  body:z
  .strictObject({ 
//   username: z.string(),
  password: z.string(),
  email:z.email({error:"invalid email"}),
  confirmPassword :z.string()
  .refine((val)=> val.length<= 255,
  {
    message :"Confirm Password must be 2 char",
  })
  // params: z.object({
  //    id : z.string ,
  // }),
 

//   age:z.int().gte(5).lte(80).multipleOf(5),
//   is_grad:z.coerce.boolean(),
//   role:z.enum(Role),
//   skills:z.array(z.string()),
}).catchall(z.string())
};

// export const emailval =LoginSchema.omit({password :true});
// export const emailPartialval =LoginSchema.partial({password:true});

export const SignupSchema={body :LoginSchema.body.safeExtend
({  
  username: z.string(),
  age:z.int().gte(5).lte(80).multipleOf(5),
  is_grad:z.coerce.boolean(),
phone:z.string().optional(),
  role:z.enum(Role),
  skills:z.array(z.string()),
  tup: z.tuple([z.number(),z.string()]),
}).catchall(z.string()),
}