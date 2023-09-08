import { UserLibs } from "../../../../libs/index.js";
import {tryCatch} from "./../../../../middleware/index.js"

const Register = tryCatch(async function (req,res,next) {
    // Getting All Request Body Params
    const {username,email,password,confirm_password,phone} = req.body
    // Create User on DB
    const {user,accessToken} = await UserLibs.createUser({username,email,password,confirm_password,phone});
    // Send Responses
    res.status(200).json({
       code : 200,
       mesaage : 'Registration Completed Successfully!',
       data : {
        ...user._doc,
        accessToken
       },
    })
}) 





export default Register;