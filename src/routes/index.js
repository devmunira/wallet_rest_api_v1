import express from "express"
import AuthController from "../api/v1/controller/auth/index.js";
import PermissionController from "../api/v1/controller/permission/index.js";
const router = express.Router();
import {AuthRequest , PermissionRequest , QueryRequest} from "../request/index.js"
import {requestValidator , authenticate} from "../middleware/index.js"

// API Health Route
router.get('/health' , (_req,res) => res.status(200).json({code : 200 , message : 'API Health is ok!'}))

// Auth Endpints Start from here
router.post('/auth/login', AuthRequest.loginRequestValidator , requestValidator ,  AuthController.Login)
router.post('/auth/register', AuthRequest.registerRequestValidator , requestValidator ,  AuthController.Register)
router.post('/auth/logout', authenticate ,  AuthController.Logout)
router.post('/forgot-password/owner-verify' , AuthController.VerifyOwner)
router.get('/reset-password/:id/:token', AuthController.VerifyRsestLink)
router.post('/reset-password/:id/:token', AuthRequest.resetRequestValidator, requestValidator,  AuthController.ResetPassword)
router.post('/refresh', AuthController.Refresh)

// Permission Router Start From Here
router.route('/permissions')
.post(authenticate , PermissionRequest.permissionCreateRequest , requestValidator,  PermissionController.create)
.get(authenticate , QueryRequest.basicQueryParams , requestValidator,  PermissionController.getAll)
router.route('/permissions/:id')
.put(authenticate , PermissionController.updateByPut)
.delete(authenticate , PermissionController.deleteById)


// export for use on index file
export default router;


