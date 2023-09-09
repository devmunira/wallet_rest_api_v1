import {body} from "express-validator"
import Role from "../model/Role.js"



// Sign Request Body Validator
const roleCreateRequest  = [
    body('name')
    .trim()
    .custom(async (val) => {
        const role = await Role.findOne({ name : val });
        if (role) {
            return Promise.reject('Role is already Added!');
        }
    }),
];



export default {
    roleCreateRequest
}