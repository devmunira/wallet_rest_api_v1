import TokenUtils from "../utils/Token.js";
import {unAuthenticateError} from "./../utils/Error.js"

const authenticate = (req,res,next) => {
    try {
        const headers = req.headers['authorization'];

        const Token = headers && headers.split(' ')[1];

        if(!Token) throw unAuthenticateError();

        req.user = TokenUtils.verifyJWT({token : Token});
        next();  
    } catch (error) {
      next(error)  
    }
}

export default authenticate;