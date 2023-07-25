import mongoose from "mongoose";

const Schema = mongoose.Schema
const refreshTokenSchema = new Schema({
    refresh_token:{
        type:String,required:true
    }
},{timestamps:true})

const refreshToken = mongoose.model('refreshToken',refreshTokenSchema,'refreshTokens')
export default refreshToken