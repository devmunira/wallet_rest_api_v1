import { LIMIT, PAGE, SEARCH, SORTBY, SORTTYPE } from "../../../../config/default.js";
import {RoleLibs} from "../../../../libs/index.js"
import {tryCatch} from "../../../../middleware/index.js";
import {generateAllDataHateoasLinks} from "../../../../utils/Hateoas.js"
import {generatePagination} from "../../../../utils/Pagination.js"
import {transformData} from "../../../../utils/Response.js"


// Create Role to DB
const create = tryCatch(async (req,res,next) => {
    const {name,permissions} = req.body;
    const {role , permission} = await RoleLibs.create(name,permissions)

    res.status(201).json({
        code : 201,
        message : 'Role Created Successfully!',
        data : {
            ...role,
            permissions : [...permission]
        }
    })
})

// Get All Roles according to filter from DB
const getAll = tryCatch(async (req,res,next) => {

   let {limit,page,sortType,sortBy,search} = req.query;

   // set default search params   
   limit = +limit || LIMIT
   page = +page || PAGE
   sortBy = sortBy || SORTBY
   sortType = sortType || SORTTYPE
   search = search || SEARCH


   let {roles , totalItems} = await RoleLibs.getAll({search, sortBy ,sortType, limit , page});

   // count total Page
   let totalPage = Math.ceil(totalItems / limit)

   // generate final responses data
   let result = {
        code : 200,
        message: 'Successfully data Retrived!',
        data  : roles.length > 0 ?  transformData(roles , req.url) : [], 
        links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
        pagination : generatePagination(totalPage,page,totalItems,limit)
    }

    return res.status(200).json(result)
})


// Update or Create Role to DB
const updateByPut = tryCatch(async (req,res,next) => {
    const {name} = req.body;
    const {id} = req.params;
    const {role , state} = await RoleLibs.updateByPut(id,name)

    res.status(state === 'create' ? 201 : 200).json({
        code : state === 'create' ? 201 : 200,
        message : `Role ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
        data : {...role}
    })
})


// Update Role on DB
const updateByPatch = tryCatch(async (req,res,next) => {

})


// Delete Single Role by Id
const deleteById = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await RoleLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Role Deleted Successfully!',
        })
    }
});



// Delete Multiple Role by Id
const bulkDelete = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await RoleLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Role Deleted Successfully!',
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