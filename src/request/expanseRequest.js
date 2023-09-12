import {body} from "express-validator"
import Expanse from "../model/Expanse.js"



// Sign Request Body Validator
const expanseCreateRequest  = [
    body('amount')
    .trim()
    .notEmpty()
    .bail()
    .isNumeric(),

    body('categoryId')
    .notEmpty()
    .withMessage('Category Id is Required Field!'),

    body('accountId')
    .notEmpty()
    .withMessage('Account Id is Required Field!')
];


// Sign Request Body Validator
const expanseUpdateRequest  = [
    body('amount')
    .trim()
    .optional()
    .isNumeric()
    .withMessage('Amount must be an Number Value!')
];


export default {
    expanseCreateRequest,
    expanseUpdateRequest
}