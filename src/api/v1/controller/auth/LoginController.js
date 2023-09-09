import { AuthLibs, TokenLibs } from "../../../../libs/index.js";
import ip from 'ip'
import { serverError } from "../../../../utils/Error.js";


/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return User info & Access Token
 */
const Login = async (req,res,next) => {
    try {
        const {usernameOremail} = req.body;
        const user = await AuthLibs.login(usernameOremail);

        // Generate Access & Refresh Token for User
        const {accessToken, refreshToken} = TokenLibs.generateNewAccessRefreshToken({payload: {...user._doc, issuedIp : ip.address()}});

        // update refresh token
        await TokenLibs.createOrUpdateToken(user._id , refreshToken , ip.address())

        res.status(200).json({
          code : 200,
          mesaage : 'Login Completed Successfully!',
          data : {
            ...user._doc,
            accessToken,
          },
        })
     } catch (err) {
         next(err)
     }
}

export default Login
