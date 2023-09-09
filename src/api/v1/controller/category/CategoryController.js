import { LIMIT, PAGE, SEARCH, SORTBY, SORTTYPE } from "../../../../config/default.js";
import {CategoryLibs} from "../../../../libs/index.js"
import {tryCatch} from "../../../../middleware/index.js";
import {generateAllDataHateoasLinks} from "../../../../utils/Hateoas.js"
import {generatePagination} from "../../../../utils/Pagination.js"
import {transformData} from "../../../../utils/Response.js"


// Create Category to DB
const create = tryCatch(async (req,res,next) => {
    const {name} = req.body;
    const category = await CategoryLibs.create(name)

    res.status(201).json({
        code : 201,
        message : 'Category Created Successfully!',
        data : {...category}
    })
})

// Get All Categorys according to filter from DB
const getAll = tryCatch(async (req,res,next) => {
   let {limit,page,sortType,sortBy,search} = req.query;

   // set default search params   
   limit = +limit || LIMIT
   page = +page || PAGE
   sortBy = sortBy || SORTBY
   sortType = sortType || SORTTYPE
   search = search || SEARCH

   let {categories , totalItems} = await CategoryLibs.getAll({search, sortBy ,sortType, limit , page});

   // count total Page
   let totalPage = Math.ceil(totalItems / limit)

   // generate final responses data
   let result = {
        code : 200,
        message: 'Successfully data Retrived!',
        data  : categories.length > 0 ?  transformData(categories , req.url) : [], 
        links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
        pagination : generatePagination(totalPage,page,totalItems,limit)
    }

    return res.status(200).json(result)
})


// Update or Create Category to DB
const updateByPut = tryCatch(async (req,res,next) => {
    const {name} = req.body;
    const {id} = req.params;
    const {category , state} = await CategoryLibs.updateByPut(id,name)

    res.status(state === 'create' ? 201 : 200).json({
        code : state === 'create' ? 201 : 200,
        message : `Category ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
        data : {...category}
    })
})


// Update Category on DB
const updateByPatch = tryCatch(async (req,res,next) => {

})


// Delete Single Category by Id
const deleteById = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await CategoryLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Category Deleted Successfully!',
        })
    }
});



// Delete Multiple Category by Id
const bulkDelete = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await CategoryLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Category Deleted Successfully!',
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