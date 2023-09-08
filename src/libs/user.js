import bcrypt  from 'bcrypt';
import {addMinutes } from "date-fns";
import User from '../../src/model/User.js';
import { notFoundError, serverError } from '../utils/Error.js';
import { TokenLibs } from "./../libs/index.js";
import ip from "ip"



// Create or Register New User
const createUser = async ({username,email,password,confirm_password,phone}) => {
    const hashPassword = await bcrypt.hash(password , 10);
    
    try {
        const user = new User({
            username,
            email,
            phone,
            password : hashPassword,
            roleId : '60ef9c35e892b1452c59f2e3',
        });

        // Generate Access & Refresh Token for User
        const {accessToken, refreshToken} = TokenLibs.generateNewAccessRefreshToken({payload: {...user, issuedIp : ip.address()}});

        user.refresh_token = refreshToken;
        user.issuedIp = ip.address();
        await user.save();

        delete user._doc.password
        delete user._doc.refresh_token
        delete user._doc.id
        delete user._doc.__v
        return {user,accessToken};
    } catch (error) {
        throw serverError(error.message)
    }
}

// Update Token for verify Email
const updateToken = async (usernameOremail,OTP) => {
    const user = await User.findOne({$or: [{ username: usernameOremail }, { email: usernameOremail }]});
    if(!user) throw notFoundError();
    
    user.verification_token = OTP
    user.expiredAt = addMinutes(new Date() , 5)
    user.save();
    return user;
}


export default {
    createUser,
    updateToken
}