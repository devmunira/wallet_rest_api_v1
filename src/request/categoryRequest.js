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
    }),
];



export default {
    categoryCreateRequest
}