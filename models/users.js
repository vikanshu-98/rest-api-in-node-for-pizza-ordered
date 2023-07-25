import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,required:true,minlength:4,maxlength:10
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    role:{
        type:String,required:true,default:'customer'
    }
},{timeStamps:true})



export default mongoose.model('User',userSchema,'users')
