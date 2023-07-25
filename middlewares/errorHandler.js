import CustomErrorHandler from "../Service/CustomErrorHandler";
import { DEBUG_MODE } from "../config";
 import {ValidationError} from "joi"

const errorHandler = (err,req,res,next)=>{

    let statusCode = 500;
    let data={
        message:'Internal server error',
        ...(DEBUG_MODE==='true' && {originalError: err.message})//short cu
         
    }

    if(err instanceof ValidationError){
        statusCode=422;
        data={
            message:err.message,
            status:statusCode
        }
    }

    if(err instanceof CustomErrorHandler){
        statusCode=err.status;
        data={
            message:err.message,
            status:statusCode
        } 
    }
    

    return res.status(statusCode).json({
        error:{
            data
        }
    })
}

export default errorHandler;