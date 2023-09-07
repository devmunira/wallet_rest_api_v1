// This is the Authentication Middleware process
/***
 * 1. Check access token is missing or not
 * 2. if have access token then check is it valid (expiredTime and ip check) if yes then allow to proccess request 
 * 3. if can't find access token then return 401 response
 */

import {Error} from "./../utils/index.js"

const authenticate = (req,res,next) => {
    const Token = req.headers['athorization'];
    if(!Token) throw Error.unAuthenticateError();
    next()
}

export default authenticate;