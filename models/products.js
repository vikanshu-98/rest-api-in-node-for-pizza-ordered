import mongoose from "mongoose";
import { APP_URL } from "../config";

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:String,required:true},
    size:{type:String,required:true}, 
    image:{type:String,get(image){
       return `${APP_URL}${image}`
    }
}
},{timestamps:true,toJSON:{getters: true}})

export default mongoose.model('Product',productSchema,'products')
