import Joi from "joi"
import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../Service/CustomErrorHandler"
import JwtTokenService from "../../Service/JwtTokenSevice"
import { REFRESH_TOKEN_KEY } from "../../config"

const refreshController ={

    async refreshToken(req,res,next){

        const refreshTokenSchema =Joi.object({
            'refresh_token':Joi.string().required()
        })
        console.log(req.body);
        const{error}=refreshTokenSchema.validate(req.body)
        if(error){
            return next(error)
        }

        // database mai check
        try {
            const refreshToken = await RefreshToken.findOne({refresh_token:req.body.refresh_token})
            if(!refreshToken){
                return next(CustomErrorHandler.unAuthroized('Invalid refresh token!!'))
            }
            let userId;
            try {
                const {_id}=JwtTokenService.verify(refreshToken.refresh_token,REFRESH_TOKEN_KEY)
                userId=_id
                
            } catch (error) {
                return next(CustomErrorHandler.unAuthroized('Invalid refresh token!!'))  
            }
            const users = await User.findOne({_id:userId})
            if(!users)
                return next(CustomErrorHandler.unAuthroized('No user found!!')) 
            
            const access_token =JwtTokenService.sign({_id:users._id,role:users.role})
            const refresh_token=JwtTokenService.sign({_id:users._id,role:users.role},'1y',REFRESH_TOKEN_KEY)
            RefreshToken.create({refresh_token}) 
            return res.data({access_token,refresh_token})

        } catch (error) {
            return next(new Error('something went wrong'+error.message))
        }
    }
}

export default refreshController