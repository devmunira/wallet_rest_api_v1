import {body} from "express-validator"
import Permission from "./../model/Permission.js"



// Sign Request Body Validator
const permissionCreateRequest  = [
    body('name')
    .trim()
    .notEmpty()
    .bail()
    .isLength({min : 3 , max:20})
    .bail()
    .isString()
    .bail()
    .custom(async (val) => {
        const permission = await Permission.findOne({ name : val });
        if (permission) {
            return Promise.reject('Permission is already Added!');
        }
        return true
    }),
];




// Sign Request Body Validator
const permissionUpdatePUTRequest  = [
    body('name')
    .trim()
    .notEmpty()
    .bail()
    .isLength({min : 3 , max:20})
    .bail()
    .isString()
    .bail()
    .custom(async (val , {req}) => {
        const permission = await Permission.findOne({ name : val , _id : {$ne : req.params.id} });
        if (permission) {
            return Promise.reject('Permission is already Added!');
        }
        return true
    }),
];



export default {
    permissionCreateRequest,
    permissionUpdatePUTRequest
}