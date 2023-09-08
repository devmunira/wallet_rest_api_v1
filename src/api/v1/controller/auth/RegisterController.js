import {tryCatch} from "./../../../../middleware/index.js"

const Register = tryCatch(async function (req,res,next) {
    res.status(200).json({message : 'ok'})
}) 

export default Register;