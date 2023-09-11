import {body} from "express-validator"
import  bcrypt  from 'bcrypt';
import User from "../model/User.js"



// Sign Request Body Validator
const createRequestValidator = [
    body('name')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Username must be a valid text format')
    .bail(),

    body('account_details')
    .notEmpty()
    .isString()
    .withMessage('Account Details must be a valid text format'),

    body('initial_value')
    .optional()
    .isNumeric().withMessage('Initial Value must be an valid  Number!'),
];





// Sign Request Body Validator
const UpdatePatchRequestValidator = [
    body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Username must be a valid text format')
    .bail(),

    body('account_details')
    .optional()
    .isString()
    .withMessage('Account Details must be a valid text format'),

    body('initial_value')
    .optional()
    .isNumeric().withMessage('Initial Value must be an valid  Number!'),
];



// Sign Request Body Validator
const UpdatePutRequestValidator = [
    body('username')
    .trim()
    .isString()
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


export default {
    createRequestValidator,
    UpdatePatchRequestValidator,
    UpdatePutRequestValidator
}