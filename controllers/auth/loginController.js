import Joi from "joi"
import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../Service/CustomErrorHandler"
import bcrypt from 'bcrypt'
import JwtTokenService from "../../Service/JwtTokenSevice"
import { REFRESH_TOKEN_KEY } from "../../config" 

const loginController={
    async login(req,res,next){
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })

        const {error} =loginSchema.validate(req.body)
        if(error){
            return next(error)
        }

        const {email,password} = req.body
        try {
            const isPresent = await User.findOne({email:email})
            if(!isPresent)
                return next(CustomErrorHandler.wrongCredentials()) 
            
            const isSamePassword = await bcrypt.compare(password,isPresent.password)
            if(!isSamePassword)
                return next(CustomErrorHandler.wrongCredentials()) 
            
            const access_token = JwtTokenService.sign({_id:isPresent._id,role:isPresent.role})
            const refresh_token=JwtTokenService.sign({_id:isPresent._id,role:isPresent.role},'1y',REFRESH_TOKEN_KEY)
            RefreshToken.create({refresh_token})
            res.data({access_token,refresh_token})

        }catch (error) {
            return next(error)
        }

    },

    async logout(req,res,next){
        try {
            const logoutSchema = Joi.object({
                "refresh_token":Joi.string().required()
            })
            
            const{error}=logoutSchema.validate(req.body)
            if(error){
                return next(error)
            }

            try {
                const deleted = await RefreshToken.deleteOne({access_token:req.body.access_token})
            } catch (error) {
                return next( new Error('something went wrong in the database'))
            }
            return res.success('logout successfully!!')

        } catch (error) {
            return next(new Error('something went wrong '+error.message)) 
        }
    }
}

export default loginController