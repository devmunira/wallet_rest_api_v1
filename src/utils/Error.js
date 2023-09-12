import Account from "../model/Account.js";
import Category from "../model/Category.js";
import Permission from "../model/Permission.js";
import Role from "../model/Role.js";
import User from "../model/User.js";

const unAuthenticateError = (msg = 'Your Session May have Expired!') => {
    const error = new Error(msg)
    error.status = 401
    return error;
}

const unAuthorizedError = (msg = 'Access Denied!') => {
    const error = new Error(msg)
    error.status = 403
    return error;
}

const serverError = (msg = 'Server Not Responding!') => {
    const error = new Error(msg)
    error.status = 500
    return error;
}

const methodNotAllowError = (msg = 'Mathod Not Allowed!') => {
    const error = new Error(msg)
    error.status = 405
    return error;
}


const notFoundError = (msg = 'Resource Not Found!') => {
    const error = new Error(msg)
    error.status = 404
    return error;
}

const badRequestError = ({msg = 'Bad Request!' , errors = []}) => {
    const error = new Error(msg)
    error.status = 405
    error.errors = errors
    return error;
}

// Check when userId set as foreign key in other document
const userRelationDataCheck = async (id) => {
    const data = await User.findById(id).exec();
    if(!data) throw notFoundError('Your provided userId not found on DB!')
}


// Check when accountId set as foreign key in other document
const accountRelationDataCheck = async (id) => {
    const data = await Account.findById(id).exec();
    if(!data) throw notFoundError('Your provided accountId not found on DB!')
}



// Check when roleId set as foreign key in other document
const roleRelationDataCheck = async (id) => {
    const data = await Role.findById(id).exec();
    if(!data) throw notFoundError('Your provided roleId not found on DB!')
}


// Check when permissionId set as foreign key in other document
const permissionRelationDataCheck = async (id) => {
    const data = await Permission.findById(id).exec();
    if(!data) throw notFoundError('Your provided permissionId not found on DB!')
}


// Check when categoryId set as foreign key in other document
const categoryRelationDataCheck = async (id) => {
    const data = await Category.findById(id).exec();
    if(!data) throw notFoundError('Your provided categoryId not found on DB!')
}



export {
    unAuthenticateError,
    unAuthorizedError,
    methodNotAllowError,
    serverError,
    badRequestError,
    notFoundError,
    userRelationDataCheck,
    roleRelationDataCheck,
    accountRelationDataCheck,
    categoryRelationDataCheck,
    permissionRelationDataCheck
}