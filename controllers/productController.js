import { Product } from "../models"
import multer from 'multer'
import path from 'path'
import CustomErrorHandler from "../Service/CustomErrorHandler"
import Joi from "joi"
import fs from 'fs'
import { productSchema } from "../validation"
const storage= multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(re,file,cb)=>{
        const filename=`${Date.now()}-${Math.ceil(Math.random()*1000)}${path.extname(file.originalname)}`
        cb(null,filename)
    }
})


const hadleMutipartData=multer({storage,limits:{fileSize:1000000 *5}}).single('image')
const productController={
    async store(req,res,next){
        hadleMutipartData(req,res,async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            console.log(req.file)
            const filePath = req.file.path;
            // validation

            const {error} = productSchema.validate(req.body)
            if(error){
              fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message))
                    }
              })
              return next(error)
            
            }

            const {name,price,size} = req.body
            let document;
            try {
                document = await Product.create(
                    {name,price,size,image:filePath}
                )
            } catch (error) {
                return next(error)
                
            }
            res.data(document)
        })
    },
    async updateProduct(req,res,next){
        hadleMutipartData(req,res,async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            
            let filePath;
            if(req.file){

                filePath = req.file.path;
            }
            // validation 

            const {error} = productSchema.validate(req.body)
            if(error){
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    })
                }
                return next(error)
            }

            const {name,price,size} = req.body
            let document;
            try {
                document = await Product.findOneAndUpdate(
                    {id:req.params.id},
                    {
                        name,
                        price,
                        size,
                        ...(req.file && {image:filePath})
                    }
                )
            } catch (error) {
                return next(error)
                
            }
            res.data(document)
        }) 
    },
    async deleteProduct(req,res,next){
        try {
            const document = await Product.findOneAndRemove({id:req.params.id}) 

            console.log(document);
            if(!document)
                return next(CustomErrorHandler.routeNotFound('not found to deleted.'))
            
            let filePath = document.image
            console.log(filePath);
            filePath = 'uploads'+filePath.split('/uploads')[1] 
            fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError(err.message))
                }
            return res.success();
            })
            
        } catch (error) {
            console.log(error);
            return next(CustomErrorHandler.serverError())
        }
    },
    async getAllProduct(req,res,next){
        try {
            const product = await Product.find().select('-updateAt -__V')
            if(!product){
                return next(CustomErrorHandler.routeNotFound('no data found'))
            } 
            res.data(product)
        } catch (error) { 
            return next(CustomErrorHandler.serverError(error.message))
        }
    },
    async getSingleProduct(req,res,next){
        try {
            const product =await Product.findOne({id:req.body.id}).select('-updatedAt -__V')
            if(!product)
                return next(customElements.routeNotFound('not found'))
            return res.data(product)
        } catch (error) {
           return next(CustomErrorHandler.serverError(error.message)) 
        }
    }
}

export default productController
