import User from "../model/User.js";
import { serverError } from "../utils/Error.js";
import TokenUtils from "../utils/Token.js"


const generateNewAccessRefreshToken = async ({payload}) => {
    try {
       const accessToken  =  TokenUtils.generateJWT({payload , expiresIn : '10m'});
       const refreshToken =  TokenUtils.generateJWT({payload, expiresIn : '1day'});
    
       const user = await User.findOne({id : payload._id}).exec();
       user.refresh_token = refreshToken;
       user.issuedIp = payload.issuedIp;
       await user.save();

       return {accessToken, refreshToken}
    } catch (error) {
        throw serverError(error.message)
    }
}


export default {
    generateNewAccessRefreshToken
}