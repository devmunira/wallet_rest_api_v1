import { ACCESSTOKENLIFETIME, REFRESHTOKENLIFETIME } from "../config/auth.js";
import User from "../model/User.js";
import { notFoundError, serverError } from "../utils/Error.js";
import TokenUtils from "../utils/Token.js"


const generateNewAccessRefreshToken = ({payload}) => {
    try {
       const accessToken  =  TokenUtils.generateJWT({payload, expiresIn : ACCESSTOKENLIFETIME});
       const refreshToken =  TokenUtils.generateJWT({payload,  expiresIn : REFRESHTOKENLIFETIME});
       return {accessToken, refreshToken}
    } catch (error) {
        throw serverError(error)
    }
}



// store refresh token in db
const createOrUpdateToken = async (id,refreshToken,issuedIp) => {
    try {
        const user = await User.findOne(id).exec();
        console.log('user' , user)
        user.refresh_token = refreshToken;
        user.issuedIp = issuedIp;
        await user.save();
    } catch (error) {
        throw serverError(error)
    }
}


// Verify Reset Password Verification TOken
const verifyToken = async (id,token) => {
    try {
        const user = await User.findById(id).exec();
        if(!user) throw notFoundError('User not Found!');

        if(token.toString() == user.verification_token == false) throw new Error('Invalid Token!')

        const notExpired = user.notExpired;
        if(!notExpired) throw new Error('Invalid Request!')
        return user;
    } catch (error) {
        throw serverError(error)
    }
}

export default {
    generateNewAccessRefreshToken,
    createOrUpdateToken,
    verifyToken
}