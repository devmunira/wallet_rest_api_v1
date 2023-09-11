import {body} from "express-validator"
import Category from "../model/Category.js"



// Sign Request Body Validator
const categoryCreateRequest  = [
    body('name')
    .trim()
    .notEmpty()
    .bail()
    .isLength({min : 3 , max:20})
    .bail()
    .custom(async (val) => {
        const category = await Category.findOne({ name : val });
        if (category) {
            return Promise.reject('Category is already Added!');
        }

        return true;
    }),
];



// Sign Request Body Validator
const categoryUpdateRequest  = [
    body('name')
    .trim()
    .notEmpty()
    .bail()
    .isLength({min : 3 , max:20})
    .bail()
    .custom(async (val , {req}) => {
        const category = await Category.findOne({ name : val , _id : {$ne : req.params.id} });
        if (category) {
            return Promise.reject('Category is already Added!');
        }

        return true
    }),
];



export default {
    categoryCreateRequest,
    categoryUpdateRequest
}