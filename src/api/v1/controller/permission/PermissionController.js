import { LIMIT, PAGE, SEARCH, SORTBY, SORTTYPE } from "../../../../config/default.js";
import {PermissionLibs} from "../../../../libs/index.js"
import {tryCatch} from "../../../../middleware/index.js";
import {generateAllDataHateoasLinks} from "../../../../utils/Hateoas.js"
import {generatePagination} from "../../../../utils/Pagination.js"
import {transformData} from "../../../../utils/Response.js"


// Create Permission to DB
const create = tryCatch(async (req,res,next) => {
    const {name} = req.body;
    const permission = await PermissionLibs.create(name)

    res.status(201).json({
        code : 201,
        message : 'Permission Created Successfully!',
        data : {...permission}
    })
})

// Get All Permissions according to filter from DB
const getAll = tryCatch(async (req,res,next) => {
   let {limit,page,sortType,sortBy,search} = req.query;

   // set default search params   
   limit = +limit || LIMIT
   page = +page || PAGE
   sortBy = sortBy || SORTBY
   sortType = sortType || SORTTYPE
   search = search || SEARCH

   let {permissions , totalItems} = await PermissionLibs.getAll({search, sortBy ,sortType, limit , page});

   // count total Page
   let totalPage = Math.ceil(totalItems / limit)

   // generate final responses data
   let result = {
        code : 200,
        message: 'Successfully data Retrived!',
        data  : permissions.length > 0 ?  transformData(permissions , req.url) : [], 
        links : generateAllDataHateoasLinks(permissions,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
        pagination : generatePagination(totalPage,page,totalItems,limit)
    }

    return res.status(200).json(result)
})


// Update or Create Permission to DB
const updateByPut = tryCatch(async (req,res,next) => {
    const {name} = req.body;
    const {id} = req.params;
    const {permission , state} = await PermissionLibs.updateByPut(id,name)

    res.status(state === 'create' ? 201 : 200).json({
        code : state === 'create' ? 201 : 200,
        message : `Permission ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
        data : {...permission}
    })
})




// Delete Single Permission by Id
const deleteById = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await PermissionLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Permission Deleted Successfully!',
        })
    }
});



// Delete Multiple Permission by Id
const bulkDelete = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await PermissionLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Permission Deleted Successfully!',
        })
    }
})


export {
    create,
    getAll,
    updateByPut,
    deleteById,
    bulkDelete
}