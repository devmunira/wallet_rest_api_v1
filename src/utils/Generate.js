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

// generate financial State
function determineFinancialState(financialDifference) {  
    if (financialDifference < 0) {
      return "Poverty";
    } else if (financialDifference <= 20000) {
      return "Low-Income";
    } else if (financialDifference <= 40000) {
      return "Working Class";
    } else if (financialDifference <= 80000) {
      return "Middle Class";
    } else if (financialDifference <= 150000) {
      return "Upper Class";
    } else {
      return "Wealthy";
    }
  }
  
  
export {
    saltted,
    generateSlug,
    generateUniqueCode,
    determineFinancialState
}


  