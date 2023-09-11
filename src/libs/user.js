import bcrypt  from 'bcrypt';
import {addMinutes } from "date-fns";
import User from '../../src/model/User.js';
import { notFoundError, serverError } from '../utils/Error.js';
import { TokenLibs } from "./../libs/index.js";
import ip from "ip"
import { DEFAULTPASS } from '../config/auth.js';
import Role from '../model/Role.js';
import { generateSelectItems, generateSortType } from '../utils/Query.js';



// Create or Register New User
const createUser = async ({username,email,password,confirm_password,phone,roleId}) => {

    const hashPassword = await bcrypt.hash(password ? password : DEFAULTPASS , 10);

    
    try {
        const userRole = await Role.findOne({'name' : 'user'}).exec();

        if(!roleId && !userRole) throw notFoundError('Please First Set a Role or Add a Role Named user!');

        const user = new User({
            username,
            email,
            phone : phone ? phone : '',
            password : hashPassword,
            roleId : roleId ? roleId : userRole._doc._id,
        });

        // Generate Access & Refresh Token for User
        const {accessToken, refreshToken} = TokenLibs.generateNewAccessRefreshToken({payload: {...user._doc, issuedIp : ip.address()}});

        user.refresh_token = refreshToken;
        user.issuedIp = ip.address();
        await user.save();

        delete user._doc.password
        delete user._doc.refresh_token
        delete user._doc.id
        delete user._doc.__v
        return {user,accessToken};
    } catch (error) {
        throw serverError(error.message)
    }
}

// Update Token for verify Email
const updateToken = async (usernameOremail,OTP) => {
    const user = await User.findOne({$or: [{ username: usernameOremail }, { email: usernameOremail }]});
    if(!user) throw notFoundError();
    
    user.verification_token = OTP
    user.expiredAt = addMinutes(new Date() , 5)
    user.save();
    return user;
}


// count data based on filter query
const count = (data) => {
    return User.count(data);
}


// Get All Roles according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page,role,select,populate}) => {
    // populate sortType val for query
    let sortTypeForDB = generateSortType(sortType);
    let selectedColums = generateSelectItems(select,['_id','username','email','phone','roleId' , 'createdAt' , 'updatedAt']);

    let populateRelations = generateSelectItems(populate,['role','account','expanse','income','goal']);
    
    // destructured filter options for query
    let filter = {}
    if(search) filter.name = {$regex : search , $options : 'i'}
    if(role) filter.roleId = role;

    // send request to db with all query params
    let users = await User.find(filter)
    .select(selectedColums)
    .sort({[sortBy] : sortTypeForDB})
    .skip(page * limit - limit)
    .limit(limit)
    .populate(populateRelations.includes('role') ? {
        path   : 'roleId',
        select : 'name',
    } : '')
    
    // count total roles based on search query params only, not apply on pagination
    let totalItems = await count(filter) ;

    console.log(users , 'users')

    return {
        users,
        totalItems
    }
}

// Update Single User Via PATCH Request
const updateByPatch = async (id,username,email,phone,roleId) => {
    const updateUser = await User.findById(id).exec();
    if(!updateUser) throw new Error('User Not Found!')
    updateUser.username = username ? username : updateUser.username;
    updateUser.email = email ? email : updateUser.email;
    updateUser.phone = phone ? phone : updateUser.phone;
    updateUser.roleId = roleId ? roleId : updateUser.roleId;
    await updateUser.save();
    delete updateUser._doc.password
    delete updateUser._doc.refresh_token
    delete updateUser._doc.id
    delete updateUser._doc.__v
    return updateUser._doc
}



// Update Single User Via PATCH Request
const updateByPUT = async (id,username,email,phone,roleId,password,confirm_password) => {
    const updateUser = await User.findById(id).exec();

    if(!updateUser) {
       const {user, accessToken} =  await createUser({username,email,password,confirm_password,phone,roleId})
        return {
            user : user._doc, 
            accessToken,
            state : 'create'
        }
    }else{
        updateUser.username = username ? username : updateUser.username;
        updateUser.email = email ? email : updateUser.email;
        updateUser.phone = phone ? phone : updateUser.phone;
        updateUser.roleId = roleId ? roleId : updateUser.roleId;
        await updateUser.save();
        delete updateUser._doc.password
        delete updateUser._doc.refresh_token
        delete updateUser._doc.id
        delete updateUser._doc.__v
        return {
            user : updateUser._doc,
            accessToken : '',
            state : 'update'
        }
    }  
}



export default {
    createUser,
    updateToken,
    getAll,
    updateByPatch,
    updateByPUT
}