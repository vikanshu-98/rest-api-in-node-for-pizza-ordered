const responseHandler=(req,res,next)=>{
     {
        res.success=function(message="success",status=200){
            return res.status(status).json({status,message})
        },
        res.data=function(data={},status=200,message="sucess"){
            return res.status(status).json({status,message,data})
        }

        res.error=function(message="Not Found!",status=404,){
            return res.status(status).json({status,message})
        }
     }
    next()
}

export default responseHandler