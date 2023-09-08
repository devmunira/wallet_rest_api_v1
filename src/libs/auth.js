import tryCatch from "../middleware/tryCatchError.js";
import {serverError , notFoundError} from "../utils/Error.js"
import User from "./../model/User.js"

// Login User with username Or password
const login = async (usernameOremail = '') => {
   try {
    const user = await User.findOne({$or: [{ username: usernameOremail }, { email: usernameOremail }]});
    if(!user) throw notFoundError();
    delete user._doc.password
    delete user._doc.refresh_token
    delete user._doc.id
    delete user._doc.__v
    return user
   } catch (error) {
      throw serverError(error.message)
   }
}




export default {
   login,
}