import { UserLibs } from "../../../../libs/index.js";
import User from "../../../../model/User.js";
import { notFoundError } from "../../../../utils/Error.js";
import { generateUniqueCode } from "../../../../utils/Generate.js";
import { sendEmailForEmailVerify } from "../../../../utils/Mail.js";

/**
* @return check email and send an verification link to mail
*/
const VerifyOwner = async (req,res,next) => {
    try {
       const OTP = generateUniqueCode();

       const {usernameOremail} = req.body
 
       const user = await UserLibs.updateToken(usernameOremail,OTP)
 
       const isSend = await sendEmailForEmailVerify(user.email,user.username,user._id,OTP)

       if(!isSend) return res.status(500).json({message : 'Email can not be delivered! we are sorry!'})
 
       res.status(200).json({
         code : 200,
         mesaage : 'Check your inbox for verification token',
       })
    } catch (err) {
       const error = new Error(err) 
       error.status = 500
       next(error)
    }
 }




//  Validate Reset Password Provided Link
const VerifyRsestLink = async (req,res,next) => {
   try {
     const {id, token} = req.params;
     const user = await User.findById(id).exec();
     if(!user) throw notFoundError('User not Found!');

     const notExpired = user.notExpired;

     if(!notExpired) throw new Error('Invalid Request!')

     res.status(200).json({
      code : 200,
      message : 'Verification Pass Successfully!'
     })

   } catch (error) {
      console.log(error)
      next(error)
   }
 }



 

//  Validate Reset Password Provided Link
const ResetPassword = async (req,res,next) => {
   try {
      
   } catch (error) {
      next(error)
   }
 }


export {
   VerifyOwner,
   VerifyRsestLink,
   ResetPassword
};
 