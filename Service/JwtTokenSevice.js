
import jsonwebtoken from 'jsonwebtoken'
import { SECRET_KEY } from '../config'
class JwtTokenService{
    static sign(payload,expiry='120s',secretKey=SECRET_KEY){
        return jsonwebtoken.sign(payload,secretKey,{expiresIn:expiry})
    }
    
    static verify(token,secretKey=SECRET_KEY){
        return jsonwebtoken.verify(token,secretKey)
    }
}

export default JwtTokenService