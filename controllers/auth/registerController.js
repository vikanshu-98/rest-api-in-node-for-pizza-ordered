import Joi from "joi"
import CustomErrorHandler from "../../Service/CustomErrorHandler"
import { User,RefreshToken } from "../../models"
import brcypt from 'bcrypt'
import JwtTokenService from "../../Service/JwtTokenSevice"
import { REFRESH_TOKEN_KEY } from "../../config" 

const registerController={

    async register(req,res,next){
         // validation 

        const registerScheema =Joi.object().keys({
            name:Joi.string().min(5).max(30).required(). messages({
                "string.base": `"name" field should be a type of 'text'`,
                "string.empty": `"name" field cannot be an empty field`,
                "any.required": `"name" field is a required.`,
            }),
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password:Joi.ref('password')

        })

        const {error} = registerScheema.validate(req.body) 
        if(error){
            console.log(error)
            return next(error)
        }

        // check if user in the database
        try{
             
            const exists=await User.exists({email:req.body.email})
            if(exists){
                return next(CustomErrorHandler.alreadyExist('This email is already taken...'))
            }
        }catch(err){
            return next(err)
        }

        const hashedPasword = await brcypt.hash(req.body.password,10)
        

        let access_token,refresh_token;
        try {
            const user1 = new User({
                name:req.body.name,
                email:req.body.email,
                password:hashedPasword,
            })
            const result= await user1.save()
            access_token =JwtTokenService.sign({_id:result._id,role:result.role})
            refresh_token=JwtTokenService.sign({_id:result._id,role:result.role},'1y',REFRESH_TOKEN_KEY)
            RefreshToken.create({refresh_token})
        } catch (error) {
           return next(error) 
        }  
        return res.data({access_token,refresh_token});
    }
}

export default registerController


// 1. validate 
// 2. authorize 
// 3. check if user is database already
// 4. prepare module
// 5. store in deb
// 6. generate jwt
// 7. send response