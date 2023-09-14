import express from "express"
const router = express.Router();
import AuthController from "../api/v1/controller/auth/index.js";
import PermissionController from "../api/v1/controller/permission/index.js";
import CategoryController from "../api/v1/controller/category/index.js";
import RoleController from "../api/v1/controller/role/index.js";
import UserController from "../api/v1/controller/user/index.js";
import AccountController from "../api/v1/controller/account/index.js";
import ExpanseController from "../api/v1/controller/expanse/index.js";
import IncomeController from "../api/v1/controller/income/index.js";
import RecordController from "../api/v1/controller/record/index.js";
import {AuthRequest , PermissionRequest , QueryRequest , CategoryRequest, RoleRequest, UserRequest, AccountRequest , ExpanseRequest} from "../request/index.js"
import {requestValidator , authorization , authenticate} from "../middleware/index.js"



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
.patch(authenticate , authorization(['update-role']) ,  RoleRequest.roleUpdateRequest , requestValidator, RoleController.updateByPatch)
.delete(authenticate , authorization(['delete-role']) ,  RoleController.deleteById)




// User Router Start From Here
router.route('/users').post(authenticate,   authorization(['create-user']) ,   UserRequest.createRequestValidator , requestValidator, UserController.create)
.get(authenticate ,   authorization(['read-user']) , QueryRequest.basicQueryParams , requestValidator,  UserController.getAll)
router.route('/users/:id')
.patch(authenticate , authorization(['update-user' , 'update-own-user']), UserRequest.UpdatePatchRequestValidator , requestValidator, UserController.updateByPatch)
.put(authenticate ,  authorization(['update-user' , 'update-own-user']) , UserController.updateByPut)
.get(authenticate ,  authorization(['single-user' , 'single-own-user']),UserController.getById)
.delete(authenticate ,  authorization(['delete-user' , 'delete-own-user']) ,UserController.deleteById)


// User Password Change Route
router.patch('/users/:id/reset-password' , authenticate ,  authorization(['update-password' , 'update-own-password']), UserRequest.resetRequestValidator , requestValidator ,  UserController.resetPasword)



// Category Router Start From Here
router.route('/categories')
.post(authenticate , authorization(['create-category']) , CategoryRequest.categoryCreateRequest , requestValidator,  CategoryController.create)
.get(authenticate , authorization(['read-category']) , QueryRequest.basicQueryParams , requestValidator,  CategoryController.getAll)
router.route('/categories/:id')
.put(authenticate ,authorization(['update-category']) ,  CategoryRequest.categoryUpdateRequest , requestValidator, CategoryController.updateByPut)
.delete(authenticate ,authorization(['delete-category']) ,  CategoryController.deleteById)



// Account Router Start From Here
router.route('/accounts')
.post(authenticate , authorization(['create-account']) ,  AccountRequest.createRequestValidator , requestValidator,  AccountController.create)
.get(authenticate , authorization(['read-account']), QueryRequest.basicQueryParams , requestValidator,  AccountController.getAll)
router.route('/accounts/:id')
.put(authenticate , authorization(['update-account' , 'update-own-account']),  AccountController.updateByPut)
.patch(authenticate ,authorization(['update-account' , 'update-own-account']),  AccountRequest.UpdatePatchRequestValidator , requestValidator, AccountController.updateByPatch)
.delete(authenticate ,authorization(['delete-account' , 'delete-own-account']), AccountController.deleteById)
.get(authenticate ,authorization(['single-account' , 'single-own-account']), AccountController.getById)



// Expanse Router Start From Here
router.route('/expanses')
.post(authenticate , authorization(['create-expanse' , 'create-own-expanse']), ExpanseRequest.expanseCreateRequest , requestValidator,  ExpanseController.create)
.get(authenticate , authorization(['read-expanse']), QueryRequest.basicQueryParams , requestValidator,  ExpanseController.getAll)
router.route('/expanses/:id')
.put(authenticate ,authorization(['update-expanse' , 'update-own-expanse']), ExpanseController.updateByPut)
.patch(authenticate ,authorization(['update-expanse' , 'update-own-expanse']), ExpanseRequest.expanseCreateRequest , requestValidator, ExpanseController.updateByPatch)
.delete(authenticate ,authorization(['delete-expanse' , 'delete-own-expanse']), ExpanseController.deleteById)
.get(authenticate ,authorization(['single-expanse' , 'single-own-expanse']), ExpanseController.getById)



// Income Router Start From Here
router.route('/incomes')
.post(authenticate ,  authorization(['create-income' , 'create-own-income']),ExpanseRequest.expanseCreateRequest , requestValidator,  IncomeController.create)
.get(authenticate , authorization(['read-income']), QueryRequest.basicQueryParams , requestValidator,  IncomeController.getAll)
router.route('/incomes/:id')
.put(authenticate ,  authorization(['update-income' , 'update-own-income']),IncomeController.updateByPut)
.patch(authenticate , authorization(['update-income' , 'update-own-income']), ExpanseRequest.expanseCreateRequest , requestValidator, IncomeController.updateByPatch)
.delete(authenticate , authorization(['delete-incpme' , 'delete-own-incpme']), IncomeController.deleteById)
.get(authenticate , authorization(['single-incpme' , 'single-own-incpme']), IncomeController.getById)



// Record Router Start From Here
router.get('/data-analysis' , authenticate , authorization(['data-analysis']) , RecordController.getAllUserDataAnalysis)
router.get('/data-analysis/:userId' , authenticate , authorization(['single-analysis' , 'single-own-analysis']) , RecordController.getSingleUserDataAnalysis)
// router.get('/filter-data-analysis' , authenticate , authorization(['filter-analysis' , 'filter-own-analysis']) , RecordController.filterData)


// export for use on index file
export default router;


