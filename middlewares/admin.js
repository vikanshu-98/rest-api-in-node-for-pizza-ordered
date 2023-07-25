import CustomErrorHandler from "../Service/CustomErrorHandler"
import { Product, User } from "../models"

const Admin=async(req,res,next)=>{
    try{
        const user1 = await User.findOne({id:req.user.id})
        if(!user1)
            return next(CustomErrorHandler.unAuthroized('Unauthorized role'))
        if(user1.role==='admin'){
            return next()
        }
        else{
            return next(CustomErrorHandler.unAuthroized('Unauthorized role'))
        }
    }catch(error){
        return next(CustomErrorHandler.serverError(error))
    }

}

export default Admin