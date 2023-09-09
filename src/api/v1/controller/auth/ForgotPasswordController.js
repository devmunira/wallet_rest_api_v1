import { TokenLibs, UserLibs } from "../../../../libs/index.js";
import { generateUniqueCode } from "../../../../utils/Generate.js";
import { sendEmailForEmailVerify } from "../../../../utils/Mail.js";
import bcrypt from "bcrypt"

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
     const user = await TokenLibs.verifyToken(id, token)
     res.status(200).json({
      code : 200,
      message : 'Verification Pass Successfully!'
     })

   } catch (error) {
      next(error)
   }
 }



 

//  Validate Reset Password Provided Link
const ResetPassword = async (req,res,next) => {
   try {
     const {id,token} = req.params;
     const {password} = req.body;

     const user = await TokenLibs.verifyToken(id, token);
   
     const hasPassword = await bcrypt.hash(password, 10);
     user.password = hasPassword;
     user.refresh_token = '';
     user.issuedIp = '';
     await user.save();
   
     res.status(200).json({
      code : 200,
      message : 'Password Reset Successfully!'
     })
   } catch (error) {
      next(error)
   }
 }


export {
   VerifyOwner,
   VerifyRsestLink,
   ResetPassword
};
 