import Login from "./LoginController.js";
import Register from "./RegisterController.js";
import Logout from "./LogoutController.js";
import {VerifyOwner , VerifyRsestLink , ResetPassword} from "./ForgotPasswordController.js";


export default {
    Login,
    Register,
    Logout,
    VerifyOwner,
    VerifyRsestLink,
    ResetPassword
}