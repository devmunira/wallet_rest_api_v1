
import { validationResult } from "express-validator"


// Express validation error formatter for 400 error
export const requestValidator = (req,res,next) => {
    try {
        const errors = validationResult(req).formatWith((error) => {
            return {
                field : error.path,
                message : error.msg
            }
        })
        if(!errors.isEmpty()){
            return res.status(400).json({
                code : 400,
                message: 'Bad Request!',
                errors : errors.array(),
            })
        }
        next();
    } catch (error) {
        next(error)
    }
}