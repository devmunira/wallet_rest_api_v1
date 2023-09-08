import express from "express"
import AuthController from "../api/v1/controller/auth/index.js";
const router = express.Router();
import {AuthRequest} from "../request/index.js"
import {requestValidator} from "../middleware/index.js"



// Auth Endpints Start from here
router.post('/auth/login', AuthRequest.loginRequestValidator , requestValidator ,  AuthController.Login)
router.post('/auth/register', AuthRequest.registerRequestValidator , requestValidator ,  AuthController.Register)



// export for use on index file
export default router;


