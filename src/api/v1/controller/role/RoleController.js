import { LIMIT, PAGE, SEARCH, SORTBY, SORTTYPE } from "../../../../config/default.js";
import {RoleLibs} from "../../../../libs/index.js"
import {tryCatch} from "../../../../middleware/index.js";
import {generateAllDataHateoasLinks} from "../../../../utils/Hateoas.js"
import {generatePagination} from "../../../../utils/Pagination.js"
import {transformPopulatedData} from "../../../../utils/Response.js"


// Create Role to DB
const create = async (req,res,next) => {
    try {
        const {name,permissions} = req.body;
        const {role , permission} = await RoleLibs.create(name,permissions)

        res.status(201).json({
            code : 201,
            message : 'Role Created Successfully!',
            data : {
                ...role,
                permissions : permission ?  [...permission] : []
            }
        })
    } catch (error) {
        next(error)
    }
}

// Get All Roles according to filter from DB
const getAll = tryCatch(async (req,res,next) => {

   let {limit,page,sortType,sortBy,search} = req.query;

   // set default search params   
   limit = +limit || LIMIT
   page = +page || PAGE
   sortBy = sortBy || SORTBY
   sortType = sortType || SORTTYPE
   search = search || SEARCH


   let {updatedRoles , totalItems} = await RoleLibs.getAll({search, sortBy ,sortType, limit , page});

   // count total Page
   let totalPage = Math.ceil(totalItems / limit)

   // generate final responses data
   let result = {
        code : 200,
        message: 'Successfully data Retrived!',
        data  : updatedRoles.length > 0 ?  transformPopulatedData(updatedRoles , req.url) : [], 
        links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
        pagination : generatePagination(totalPage,page,totalItems,limit)
    }

    return res.status(200).json(result)
})

// Update Role on DB
const updateByPatch = async (req,res,next) => {
    try {
        const { id } = req.params;
        const {name , permissions} = req.body;

        const {updatedRole , permissionsArray} = await RoleLibs.updateByPatch(id,name,permissions)
        return res.status(200).json({
            code : 200,
            message : 'Role Updated Successfully!',
            data : {
                ...updatedRole._doc,
                permissions : permissionsArray
            }
        });
    } catch (error) {
        next(error)
    }
}


// Delete Single Role by Id
const deleteById = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await RoleLibs.deleteById(id);
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Role & Associated Permissions are Deleted Successfully!',
        })
    }
});




export {
    create,
    getAll,
    updateByPatch,
    deleteById,
}