import CustomErrorHandler from "../../Service/CustomErrorHandler";
import JwtTokenService from "../../Service/JwtTokenSevice";
import { REFRESH_TOKEN_KEY } from "../../config";
import { User } from "../../models";

const userController={
    async me(req,res,next){
        try{
            const{_id,role}=req.user; 
            const user = await User.findOne({_id:_id}).select({password:0,updatedAt:0,__v:0})
            //select('name _id -password')
            if(!user){
                return next(CustomErrorHandler.routeNotFound('not found'))
            }

            res.data(user)
        }catch(error){
            return next(error)
        }
    }
}

export default userController