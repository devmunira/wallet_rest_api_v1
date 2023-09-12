import {UserLibs} from "./../../../../libs/index.js"
import tryCatch from "../../../../middleware/tryCatchError.js";
import { IDQUERY, LIMIT, PAGE, POPULATE, SEARCH, SELECT, SORTBY, SORTTYPE } from "../../../../config/default.js";
import { transformData, transformPopulatedData } from "../../../../utils/Response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/Hateoas.js";
import { generatePagination } from "../../../../utils/Pagination.js";
import User from "../../../../model/User.js";
import bcrypt from "bcrypt"

// Create Permission to DB
const create = tryCatch(async (req,res,next) => {
    // Getting All Request Body Params
    const {username,email,password,confirm_password,phone,roleId} = req.body
    // Create User on DB
    const {user,accessToken} = await UserLibs.createUser({username,email,password,confirm_password,phone,roleId});
    // Send Responses
    res.status(200).json({
        code : 200,
        mesaage : 'User Created Completed Successfully!',
        data : {
        ...user._doc,
        accessToken
        },
    })
})

// Get All Permissions according to filter from DB
const getAll = tryCatch(async (req,res,next) => {
    let {limit,page,sortType,sortBy,search,role , select , populate} = req.query;

    // set default search params   
    limit = +limit || LIMIT
    page = +page || PAGE
    sortBy = sortBy || SORTBY
    sortType = sortType || SORTTYPE
    search = search || SEARCH
    role = role || IDQUERY
    select  = select || SELECT
    populate = populate || POPULATE
 
    let {users , totalItems} = await UserLibs.getAll({search, sortBy ,sortType, limit , page,role,select,populate});
 
    // count total Page
    let totalPage = Math.ceil(totalItems / limit)
 
    // generate final responses data
    let result = {
         code : 200,
         message: 'Successfully data Retrived!',
         data  : users.length > 0 ?  transformData(users , req.url) : [], 
         links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
         pagination : generatePagination(totalPage,page,totalItems,limit)
     }
 
     return res.status(200).json(result)
})


// Get Single Permissions according to filter from DB
const getById = tryCatch(async (req,res,next) => {
    let {select,populate} = req.query;
    let {id} = req.params

    // set default search params   
    select  = select || SELECT
    populate = populate || POPULATE
 
    let user = await UserLibs.getById({select,populate,id});
 
    // generate final responses data
    let result = {
         code : 200,
         message: 'Successfully data Retrived!',
         data  : {
            ...user,
            links : `${process.env.API_BASE_URL}${req.url}`,
         }
     }
 
     return res.status(200).json(result)
})



// Update Permission on DB
const updateByPatch = async (req,res,next) => {
    try {
        const { id } = req.params;

        const {username,email,phone,roleId} = req.body;

        const user = await UserLibs.updateByPatch(id,username,email,phone,roleId)

        return res.status(200).json({
            code : 200,
            message : 'User Updated Successfully!',
            data : {
                ...user,
            }
        });
    } catch (error) {
        next(error)
    }
}



// Update or Create User to DB
const updateByPut = tryCatch(async (req,res,next) => {
    const {username,email,phone,roleId,password,confirm_password} = req.body;
    const {id} = req.params;
    const {user , accessToken , state} = await UserLibs.updateByPUT(id,username,email,phone,roleId,password,confirm_password)

    const result = state === 'create' ? {...user, accessToken} : {...user}

    res.status(state === 'create' ? 201 : 200).json({
        code : state === 'create' ? 201 : 200,
        message : `User ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
        data : {
            ...result,
        }
    })
})



// Delete Single Permission by Id
const deleteById = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await UserLibs.deleteById(id);
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'User Deleted Successfully!',
        })
    }
});



// Delete Multiple Permission by Id
const resetPasword = tryCatch(async (req,res,next) => {
    const user = await User.findById(req.params.id).exec();
    const hash = await bcrypt.hash(req.body.password , 10);
    user.password =  hash;
    user.refresh_token = ''
    user.issuedIp = ''
    await user.save();

    res.status(200).json({
        code : 200,
        mesaage : 'Password Reset Successfully Login Again!'
    })

})


export {
    create,
    getAll,
    getById,
    updateByPatch,
    updateByPut,
    deleteById,
    resetPasword
}