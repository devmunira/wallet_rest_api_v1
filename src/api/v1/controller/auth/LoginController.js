import { Auth, Token } from "../../../../libs/index.js";
import ip from 'ip'


/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return User info & Access Token
 */
const Login = async (req,res,next) => {
    try {
        const {usernameOremail} = req.body;
        const user = await Auth.login(usernameOremail);

        const {accessToken} = await Token.generateNewAccessRefreshToken({payload : {...user, issuedIp : ip.address()}});

        res.status(200).json({
          code : 200,
          mesaage : 'Login Completed Successfully!',
          user : {
            id: user?._id,
            username : user?.username,
            email : user?.email,
            phone : user?.phone,
            roleId : user?.roleId,
          },
          accessToken,
        })
     } catch (err) {
         const error = new Error(err)
         error.status = 400
         next(error)
     }
}

export default Login
