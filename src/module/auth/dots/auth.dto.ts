import {z} from "zod"
import {LoginSchema,SignupSchema} from "../auth.validation"
export type ILogin =z.infer<typeof LoginSchema.body>;
export type ISignup =z.infer<typeof SignupSchema.body>;