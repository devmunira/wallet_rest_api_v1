import JWT from "jsonwebtoken"
import {unAuthenticateError} from "./Error.js"
import dotenv from "dotenv"
import {isAfter} from "date-fns";
dotenv.config();
import ip from "ip"



// Generate JWT Token
const generateJWT = ({payload, JWT_SECRET = process.env.JWT_SECRET , expiresIn = "1h" , algorithm = "HS256" }) => {
    return JWT.sign({...payload}, JWT_SECRET , {algorithm : algorithm, expiresIn})
}

// Verify JWT Token
const verifyJWT = ({JWT_SECRET = process.env.JWT_SECRET ,token , algorithm = "HS256"}) => {
    try {
       const payload = JWT.verify(token,JWT_SECRET , {algorithms : [algorithm]})
       if(!isAfter(new Date() , payload.exp) && payload.issuedIp !== ip.address()) throw unAuthenticateError('Invalid Token!');
       else return payload
    } catch (error) {
        throw unAuthenticateError('Invalid Token!')
    }
}


export default {
    generateJWT,
    verifyJWT
}