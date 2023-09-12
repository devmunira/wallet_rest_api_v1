import {ExpanseLibs} from "../../../../libs/index.js"
import tryCatch from "../../../../middleware/tryCatchError.js";
import { IDQUERY, LIMIT, MAXPRICE, MINPRICE, PAGE, POPULATE, SEARCH, SELECT, SORTBY, SORTTYPE } from "../../../../config/default.js";
import { transformData } from "../../../../utils/Response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/Hateoas.js";
import { generatePagination } from "../../../../utils/Pagination.js";

// Create Expanse to DB
const create = tryCatch(async (req,res,next) => {
    // Getting All Request Body Params
    let {categoryId,userId,accountId,amount,note} = req.body

    userId = userId ? userId : req.user._id
    // Create Expanse on DB
    const {expanse} = await ExpanseLibs.createExpanse({categoryId,userId,accountId,amount,note});
    // Send Responses
    res.status(200).json({
        code : 200,
        mesaage : 'Expanse Created Completed Successfully!',
        data : {
        ...expanse._doc,
        },
    })
})

// Get All Expanses according to filter from DB
const getAll = tryCatch(async (req,res,next) => {
    let {limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromdate,todate} = req.query;

    // set default search params   
    limit = +limit || LIMIT
    page = +page || PAGE
    sortBy = sortBy || SORTBY
    sortType = sortType || SORTTYPE
    search = search || SEARCH
    user = user || IDQUERY
    category = category || IDQUERY
    account = account || IDQUERY
    select  = select || SELECT
    populate = populate || POPULATE
    min_price = min_price || MINPRICE
    max_price = max_price || MAXPRICE
 
    let {expanses , totalItems} = await ExpanseLibs.getAll({limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromdate,todate});
 
    // count total Page
    let totalPage = Math.ceil(totalItems / limit)
 
    // generate final responses data
    let result = {
         code : 200,
         message: 'Successfully data Retrived!',
         data  : expanses.length > 0 ?  transformData(expanses , req.url) : [], 
         links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
         pagination : generatePagination(totalPage,page,totalItems,limit)
     }
 
     return res.status(200).json(result)
})


// Get Single Expanses according to filter from DB
const getById = tryCatch(async (req,res,next) => {
    let {select,populate} = req.query;
    let {id} = req.params

    // set default search params   
    select  = select || SELECT
    populate = populate || POPULATE
 
    let expanse = await ExpanseLibs.getById({select,populate,id});
 
    // generate final responses data
    let result = {
         code : 200,
         message: 'Successfully data Retrived!',
         data  : {
            ...expanse,
            links : `${process.env.API_BASE_URL}${req.url}`,
         }
     }
 
     return res.status(200).json(result)
})



// Update Expanse on DB
const updateByPatch = async (req,res,next) => {
    try {
        const { id } = req.params;

        let {categoryId,userId,accountId,amount,note} = req.body

        userId = userId ? userId : req.user._id

        const expanse = await ExpanseLibs.updateByPatch({id,categoryId,userId,accountId,amount,note})

        return res.status(200).json({
            code : 200,
            message : 'Expanse Updated Successfully!',
            data : {
                ...expanse,
            }
        });
    } catch (error) {
        next(error)
    }
}



// Update or Create Expanse to DB
const updateByPut = tryCatch(async (req,res,next) => {
    let {categoryId,userId,accountId,amount,note} = req.body;
    const {id} = req.params;

    userId = userId ? userId : req.user._id

    const {expanse, state} = await ExpanseLibs.updateByPUT({id, categoryId,userId,accountId,amount,note})

    res.status(state === 'create' ? 201 : 200).json({
        code : state === 'create' ? 201 : 200,
        message : `Expanse ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
        data : {
            ...expanse,
        }
    })
})



// Delete Single Expanse by Id
const deleteById = tryCatch(async (req,res,next) => {
    const {id} = req.params;
    const isDeleted = await ExpanseLibs.deleteById(id);
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Expanse Deleted Successfully!',
        })
    }

});


export {
    create,
    getAll,
    getById,
    updateByPatch,
    updateByPut,
    deleteById,
}