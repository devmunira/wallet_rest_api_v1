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



// Custom validator function to check if email is unique
const isPhoneUnique = async (phone) => {
    const user = await User.findOne({ phone });
    if (user) {
      return Promise.reject('Phone Number is already registered');
    }
};


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




// Sign Request Body Validator
const createRequestValidator = [
    body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('Username must be a valid text format')
    .bail()
    .isLength({min: 5 , max:10})
    .withMessage('Username must be between 5-10 charecters')
    .custom(async val => {
        const user = await User.findOne({username : val})
        if(user) throw new Error('Username already exits!')
        return true
    })
    ,

    body('email')
    .isEmail().withMessage('Email must be an valid email')
    .custom(isEmailUnique),

    body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Phone must be an valid Phone Number!')
    .custom(isPhoneUnique),

    body('password')
    .optional()
    .trim()
    .isLength({min: 6, max:12})
    .withMessage('Password must be between 5-10 charecters')
    .bail()
    .isStrongPassword()
    .withMessage('Password must be strong'),

    body('confirm_password')
    .optional()
    .trim()
    .custom((val,{req}) => {
        if(val !== req.body.password) throw new Error('Password not match')
        return true;
    }),
];





// Sign Request Body Validator
const UpdatePatchRequestValidator = [
    body('username')
    .optional()
    .trim()
    .isAlphanumeric()
    .withMessage('Username must be a valid text format')
    .bail()
    .isLength({min: 5 , max:10})
    .withMessage('Username must be between 5-10 charecters')
    .custom(async (val , {req}) => {
        const user = await User.findOne({ username: val, _id: { $ne: req.params.id } })
        if(user) throw new Error('Username already exits!')
        return true
    })
    ,

    body('email')
    .optional()
    .isEmail().withMessage('Email must be an valid email')
    .custom(async (val, {req}) => {
        const user = await User.findOne({ email : val , _id : {$ne : req.params.id} });
        if (user) {
          return Promise.reject('Email is already registered');
        }
        return true;
    }),

    body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Phone must be an valid Phone Number!')
    .custom(async (val, {req}) => {
        const user = await User.findOne({ phone : val , _id : {$ne : req.params.id} });
        if (user) {
          return Promise.reject('Phone Number is already registered');
        }
        return true;
    }),

];



// Sign Request Body Validator
const UpdatePutRequestValidator = [
    body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('Username must be a valid text format')
    .bail()
    .isLength({min: 5 , max:10})
    .withMessage('Username must be between 5-10 charecters')
    .custom(async (val , {req}) => {
        const user = await User.findOne({ username: val, _id: { $ne: req.params.id } })
        if(user) throw new Error('Username already exits!')
        return true
    })
    ,

    body('email')
    .isEmail().withMessage('Email must be an valid email')
    .custom(async (val, {req}) => {
        const user = await User.findOne({ email : val , _id : {$ne : req.params.id} });
        if (user) {
          return Promise.reject('Email is already registered');
        }
        return true;
    }),

    body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Phone must be an valid Phone Number!')
    .custom(async (val, {req}) => {
        const user = await User.findOne({ phone : val , _id : {$ne : req.params.id} });
        if (user) {
          return Promise.reject('Phone Number is already registered');
        }
        return true;
    }),

];


// Sign Request Body Validator
const resetRequestValidator = [
    body('old_password')
    .trim()
    .custom(async (val , {req}) => {
        const user = await User.findById(req.params.id).exec();
        if(!user) Promise.reject('User Not Found!')
        else{
           const isMatched =  await bcrypt.compare(val, user._doc.password) 
           if(!isMatched) return Promise.reject('Old Password not Matched!')    
        }
        return true
    }),

    body('password')
    .trim()
    .isLength({min: 6, max:12})
    .withMessage('Password must be between 5-10 charecters')
    .bail()
    .isStrongPassword()
    .withMessage('Password must be strong'),

    body('confirm_password')
    .trim()
    .custom((val,{req}) => {
        if(val !== req.body.password) throw new Error('Password not match')
        return true;
    }),
];



export default {
    createRequestValidator,
    UpdatePatchRequestValidator,
    resetRequestValidator,
    UpdatePutRequestValidator
}