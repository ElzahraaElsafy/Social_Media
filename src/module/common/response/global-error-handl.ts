import { error } from "console";
import {Request,Response,NextFunction, ErrorRequestHandler} from "express";



interface IError extends Error {
      statusCode:number;
}

export const globalError:ErrorRequestHandler =(
      err:IError,
      req:Request,
      res:Response,
      next:NextFunction
) => {
      console.log({err:error});
      const message = err.message || "Internal Server Error";
      let status= err.statusCode || 500;

      res.status(500).json({message: message,stack: err.stack,cause:err.cause});
   }
   export default globalError;