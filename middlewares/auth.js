import CustomErrorHandler from "../Service/CustomErrorHandler";
import JwtTokenService from "../Service/JwtTokenSevice";

const auth=(req,res,next)=>{
    const tokenAuth= req.headers.authorization 
    if(!tokenAuth){
        return next(CustomErrorHandler.unAuthroized())
    }

    const token =tokenAuth.split(' ')[1]
    
    try {
        const {_id,role}= JwtTokenService.verify(token)
        
        const user={
            _id,
            role
        }
        req.user=user;
        next()

    } catch (error) {
        return next(CustomErrorHandler.unAuthroized()) 
    }
    
}

export default auth;