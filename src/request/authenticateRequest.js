import {body} from "express-validator"
import  bcrypt  from 'bcrypt';
import User from "./../model/User.js"


// Custom validator function to check if email is unique
const isEmailUnique = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      return Promise.reject('Email is already registered');
    }
};


// Sign Request Body Validator
const registerRequestValidator = [
    body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('Username must be a valid text format')
    .bail()
    .isLength({min: 5 , max:10})
    .withMessage('Username must be between 5-10 charecters')
    .custom(async val => {
        const user = await User.findOne({username : val})
        if(user) throw new Error('Username already exits')
        return true
    })
    ,

    body('email')
    .isEmail().withMessage('Email must be an valid email')
    .custom(isEmailUnique),

    body('password')
    .trim()
    .isLength({min: 6, max:12})
    .withMessage('Password must be between 5-10 charecters')
    .bail()
    .isStrongPassword()
    .withMessage('Password must be strong'),

    body('confirm_password')
    .trim()
    .isLength({min: 6, max:12})
    .withMessage('Password must be between 5-10 charecters')
    .bail()
    .custom((val,{req}) => {
        if(val !== req.body.password) throw new Error('Password not match')

        return true;
    }),

    body('status')
    .optional()
    .trim()
    .custom(val => {
        if(!['active','inactive','blocked'].includes(val)) throw new Error('Status not valid')

        return true
    })
    ,
    body('is_admin')
    .optional()
    .isBoolean()
    .toBoolean()
];


// Function to check if the input is a valid username
const isUsername = (value) => {
    // Your logic to check if it's a valid username
    return /^[a-zA-Z0-9_]+$/.test(value);
};
  
// Function to check if the input is a valid email
const isEmail = (value) => {
    // Your logic to check if it's a valid email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};


const loginRequestValidator = [
    body('usernameOremail')
    .trim()
    .custom(async (val) => {
        if(!val || !(isUsername() || isEmail())){
            throw new Error('Invaild Creadiential!');
        }
        return true
    }).bail(),
    body('password')
    .trim()
    .custom(async (val , {req}) => {
        const user = await User.findOne({
            $or: [{ username: req.body.usernameOremail }, { email: req.body.usernameOremail }],
        });
        if(!user){
            return Promise.reject('Invaild Creadiential!');
        }
        const hashPass = await bcrypt.compare(val, user.password)

        if(!hashPass){
            throw new Error('Invaild Creadiential!'); 
        }
        return true
    }),
]


// forgot password email verify request validator
const verifyEmailRequest = [
    body('email')
    .trim()
    .isEmail().withMessage('Email must be an valid email')
    .custom(async email => {
        const user = await User.findOne({email})
        if(!user) throw new Error('Invalid Email Address')
        return true
    })
]


export default {
    verifyEmailRequest,
    registerRequestValidator,
    loginRequestValidator
}