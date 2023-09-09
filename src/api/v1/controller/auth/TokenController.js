import { tryCatch } from "../../../../middleware/index.js";
import TokenUtils from "./../../../../utils/Token.js"
import User from "../../../../model/User.js"
import { notFoundError } from "../../../../utils/Error.js";
import { TokenLibs } from "../../../../libs/index.js";
import ip from "ip"

// Generate New Access & Refresh Token
const Refresh = tryCatch(async (req,res,next) => {
   const {access_token} = req.body;
   const payload = TokenUtils.decodeJWT({token : access_token});

   const user = await User.findById(payload._id).exec();
   if(!user) throw notFoundError('User not Found!');

   // Generate Access & Refresh Token for User
   const {accessToken, refreshToken} = TokenLibs.generateNewAccessRefreshToken({payload: {...user._doc, issuedIp : ip.address()}});

   // update refresh token
   await TokenLibs.createOrUpdateToken(user._id , refreshToken , ip.address())


   res.status(200).json({
    code: 200,
    message : 'Generate new Token Successfully!',
    accessToken,
   })

})


export default Refresh;