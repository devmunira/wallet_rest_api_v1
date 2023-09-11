import express from "express"
import AuthController from "../api/v1/controller/auth/index.js";
import PermissionController from "../api/v1/controller/permission/index.js";
import CategoryController from "../api/v1/controller/category/index.js";
import RoleController from "../api/v1/controller/role/index.js";
import UserController from "../api/v1/controller/user/index.js";
import AccountController from "../api/v1/controller/account/index.js";
const router = express.Router();
import {AuthRequest , PermissionRequest , QueryRequest , CategoryRequest, RoleRequest, UserRequest, AccountRequest} from "../request/index.js"
import {requestValidator , authenticate} from "../middleware/index.js"
import authorization from "../middleware/authorization.js";



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
.post(authenticate ,authorization(['create-permission']) , PermissionRequest.permissionCreateRequest , requestValidator,  PermissionController.create)
.get(authenticate , authorization(['read-permission']) , QueryRequest.basicQueryParams , requestValidator,  PermissionController.getAll)
router.route('/permissions/:id')
.put(authenticate , authorization(['update-permission']) , PermissionRequest.permissionUpdatePUTRequest , requestValidator, PermissionController.updateByPut)
.delete(authenticate ,authorization(['delete-permission']) , PermissionController.deleteById)



// Role Router Start From Here
router.route('/roles')
.post(authenticate , authorization(['create-role']) ,  RoleRequest.roleCreateRequest , requestValidator,  RoleController.create)
.get(authenticate , authorization(['read-role']) , QueryRequest.basicQueryParams , requestValidator,  RoleController.getAll)
router.route('/roles/:id')
.patch(authenticate , authorization(['update-role' , 'update-own-role']) ,  RoleRequest.roleUpdateRequest , requestValidator, RoleController.updateByPatch)
.delete(authenticate , authorization(['delete-role']) ,  RoleController.deleteById)




// Role Router Start From Here
router.route('/users')
.post(authenticate,   authorization(['create-user']) ,   UserRequest.createRequestValidator , requestValidator, UserController.create)
.get(authenticate ,   authorization(['read-user']) , QueryRequest.basicQueryParams , requestValidator,  UserController.getAll)
router.route('/users/:id')
.patch(authenticate ,  authorization(['update-user' , 'update-own-user']) , UserRequest.UpdatePatchRequestValidator , requestValidator, UserController.updateByPatch)
.put(authenticate ,  authorization(['update-user' , 'update-own-user']) , UserRequest.UpdatePutRequestValidator , requestValidator, UserController.updateByPut)
.get(authenticate ,  authorization(['single-user' , 'single-own-user']), UserController.getById)
.delete(authenticate ,  authorization(['delete-user' , 'delete-own-user']) , UserController.deleteById)
router.patch('/users/:id/reset-password' , authenticate ,  authorization(['update-password' , 'update-own-password']) , UserRequest.resetRequestValidator , requestValidator ,  UserController.resetPasword)



// Category Router Start From Here
router.route('/categories')
.post(authenticate , CategoryRequest.categoryCreateRequest , requestValidator,  CategoryController.create)
.get(authenticate , QueryRequest.basicQueryParams , requestValidator,  CategoryController.getAll)
router.route('/categories/:id')
.put(authenticate , CategoryRequest.categoryUpdateRequest , requestValidator, CategoryController.updateByPut)
.delete(authenticate , CategoryController.deleteById)



// Account Router Start From Here
router.route('/accounts')
.post(authenticate , AccountRequest.createRequestValidator , requestValidator,  AccountController.create)
.get(authenticate , QueryRequest.basicQueryParams , requestValidator,  AccountController.getAll)
router.route('/accounts/:id')
.put(authenticate , AccountRequest.UpdatePatchRequestValidator , requestValidator, AccountController.updateByPut)
.patch(authenticate , AccountRequest.UpdatePatchRequestValidator , requestValidator, AccountController.updateByPatch)
.delete(authenticate , AccountController.deleteById)
.get(authenticate , AccountController.getById)


// export for use on index file
export default router;


