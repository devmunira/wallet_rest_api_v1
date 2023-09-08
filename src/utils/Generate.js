import bcrypt from "bcrypt"
import otpGenerator from "otp-generator"

// generate Salt for password hasing
const saltted = async () => {
    const salt = await  bcrypt.genSalt(10)
    return salt;
}

// Generate OTP 
const generateUniqueCode = (length = 16) => {
    const otp = otpGenerator.generate(length, {lowerCaseAlphabets:false, upperCaseAlphabets: false,  specialChars: false }); 
    return otp;
}

// generate slug
const generateSlug = (title) => {
    return title.trim().toLowerCase().replace(' ' , '-');
}

export {
    saltted,
    generateSlug,
    generateUniqueCode,
}


  