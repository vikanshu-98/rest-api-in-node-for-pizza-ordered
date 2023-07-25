class CustomErrorHandler extends Error{

    
    constructor(status,message){
        super()
        this.status=status;
        this.message = message
    }

    static alreadyExist(message="Already Exists!!"){
        return new CustomErrorHandler(409,message)
    }

    static wrongCredentials(message="email or password is wrong!"){
        return new CustomErrorHandler(401,message)
    }
    static routeNotFound(message="Route not found"){
        return new CustomErrorHandler(404,message)
    }

    static unAuthroized(message="unAuthroized user"){
        return new CustomErrorHandler(401,message)
    }

    static serverError(message="Interal server Error"){
        return new CustomErrorHandler(500,message)
    }

}

export  default CustomErrorHandler