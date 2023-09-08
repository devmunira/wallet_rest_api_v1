import {tryCatch} from "../../../../middleware/index.js";
import { notFoundError } from "../../../../utils/Error.js";
import User from "./../../../../model/User.js";

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return User info & Access Token
 */
const Logout = tryCatch(async (req,res,next) => {
    const {id} = req.body;
    const user = await User.findById(id).exec();
    if(!user) throw notFoundError('User not Found!')

    user.refresh_token = ''
    user.issuedIp = ''
    await user.save();

    res.status(200).json({
        code : 200,
        message : 'Logout Completed Successfully!'
    })
})

export default Logout
