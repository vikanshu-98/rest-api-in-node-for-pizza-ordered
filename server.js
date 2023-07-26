import express from "express";
const mongoose =require('mongoose')
import { APP_PORT, DB_URL } from "./config"; 
const app = express()
import routes from './routes';
import errorHandler from "./middlewares/errorHandler";
import responseHandler from "./middlewares/responseHandler";
import CustomErrorHandler from "./Service/CustomErrorHandler";
import cors from 'cors'
 import path  from "path";
mongoose.connect(DB_URL)
// .then(()=>{console.log('sdsd')})
const db= mongoose.connection
db.on('error',console.error.bind(console,'coonnecwerrr'))
db.once("connected",()=>{
    console.log('connected..')
})

global.appRoot = path.resolve(__dirname);
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(responseHandler)
app.use(cors())
app.use('/api',routes)
app.use(errorHandler)

app.use('/uploads',express.static('uploads'))
app.all('*', function(req, res,next){
    return res.error('Route Not found!!')
}) 
 
app.listen(APP_PORT,()=>console.log('listing on port'+APP_PORT))