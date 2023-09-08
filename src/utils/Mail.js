import nodemailer from "nodemailer"
import {badRequestError, serverError} from "../utils/Error.js"


// setup smtp for mail sender
export const mailTransporter = (_req,_res,next) => {
   try {
    const transporter = nodemailer.createTransport({
        host: 'sdcbangladesh.org', 
        port: 465, 
        secure: true, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    return transporter;
   } catch (err) {
      let error = new Error(err)
      error.status = 400,
      next(err)
   }
}


// Send Email with OTP for verify email
const sendEmailForEmailVerify = async (email,username,userId,code) => {
    try {
        if(!email || !username || !userId || !code) throw badRequestError(
            {errors: [
                {field : 'params' , 
                message: 'For Sending Mail you must send required Information!'
            }]})
        const transporter = mailTransporter();
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Forgot Password OTP',
            html: `<strong>Dear ${username},</strong><br><p>You have requested to reset your password for your account with Wallet.  
            Please use the following One-Time Link to reset your password: 
            <button style="background-color : 'blue' ; color : 'white';">
            <strong>${process.env.SITE_URL}/${username}/${userId}/${code}</strong></button> </p>
            <p>This Link is valid for the next 5 minutes. If you didn't request this password reset, please ignore this email.</p>
            <p>Thank you,</p>
            <p>The Wallet Core Team</p>`
        };
        await transporter.sendMail(mailOptions)
        return true;
    } catch (error) {
        throw serverError(error.message)
    }
}

export {
    sendEmailForEmailVerify,
    mailTransporter
}