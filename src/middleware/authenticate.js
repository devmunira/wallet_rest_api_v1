import { verifyJWT } from "../utils/Token.js";
import {Error} from "./../utils/index.js"

const authenticate = (req,res,next) => {
    const Token = req.headers['athorization'];
    if(!Token) throw Error.unAuthenticateError();
    req.user = verifyJWT({token : Token})
    next()
}

export default authenticate;