import express from "express"
import AuthController from "../api/v1/controller/auth/index.js";
import PermissionController from "../api/v1/controller/permission/index.js";
import CategoryController from "../api/v1/controller/category/index.js";
import RoleController from "../api/v1/controller/role/index.js";
const router = express.Router();
import {AuthRequest , PermissionRequest , QueryRequest , CategoryRequest} from "../request/index.js"
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



// Role Router Start From Here
router.route('/roles')
.post(authenticate , CategoryRequest.categoryCreateRequest , requestValidator,  RoleController.create)
.get(authenticate , QueryRequest.basicQueryParams , requestValidator,  RoleController.getAll)
router.route('/roles/:id')
.put(authenticate , RoleController.updateByPut)
.delete(authenticate , RoleController.deleteById)



// Category Router Start From Here
router.route('/categories')
.post(authenticate , CategoryRequest.categoryCreateRequest , requestValidator,  CategoryController.create)
.get(authenticate , QueryRequest.basicQueryParams , requestValidator,  CategoryController.getAll)
router.route('/categories/:id')
.put(authenticate , CategoryController.updateByPut)
.delete(authenticate , CategoryController.deleteById)


// export for use on index file
export default router;


