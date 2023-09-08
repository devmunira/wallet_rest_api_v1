import { ACCESSTOKENLIFETIME, REFRESHTOKENLIFETIME } from "../config/auth.js";
import User from "../model/User.js";
import { serverError } from "../utils/Error.js";
import TokenUtils from "../utils/Token.js"


const generateNewAccessRefreshToken = ({payload}) => {
    try {
       const accessToken  =  TokenUtils.generateJWT({payload, expiresIn : ACCESSTOKENLIFETIME});
       const refreshToken =  TokenUtils.generateJWT({payload,  expiresIn : REFRESHTOKENLIFETIME});
       return {accessToken, refreshToken}
    } catch (error) {
        throw serverError(error.message)
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
        throw serverError(error.message)
    }
}


export default {
    generateNewAccessRefreshToken,
    createOrUpdateToken
}