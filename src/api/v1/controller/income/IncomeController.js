import {ExpanseLibs, IncomeLibs} from "../../../../libs/index.js"
import tryCatch from "../../../../middleware/tryCatchError.js";
import { IDQUERY, LIMIT, MAXPRICE, MINPRICE, PAGE, POPULATE, SEARCH, SELECT, SORTBY, SORTTYPE, TODATE } from "../../../../config/default.js";
import { transformData } from "../../../../utils/Response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/Hateoas.js";
import { generatePagination } from "../../../../utils/Pagination.js";
import Income from "../../../../model/Income.js";

    

// Create Income to DB
const create = tryCatch(async (req,res,next) => {
    // Getting All Request Body Params
    let {categoryId,userId,accountId,amount,note} = req.body

    await ExpanseLibs.checkRelationalData(userId,accountId,categoryId,req.user._id)
    // Create Income on DB
    const {income} = await IncomeLibs.createIncome({categoryId,userId,accountId,amount,note});
    // Send Responses
    res.status(200).json({
        code : 200,
        mesaage : 'Income Created Completed Successfully!',
        data : {
        ...income._doc,
        },
    })
})

// Get All Incomes according to filter from DB
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
 
    let {incomes , totalItems} = await IncomeLibs.getAll({limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromdate,todate});
 
    // count total Page
    let totalPage = Math.ceil(totalItems / limit)
 
    // generate final responses data
    let result = {
         code : 200,
         message: 'Successfully data Retrived!',
         data  : incomes.length > 0 ?  transformData(incomes , req.url) : [], 
         links : generateAllDataHateoasLinks(incomes,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
         pagination : generatePagination(totalPage,page,totalItems,limit)
     }
 
     return res.status(200).json(result)
})


// Get Single Incomes according to filter from DB
const getById = tryCatch(async (req,res,next) => {
    const data = await Income.findById(req.params.id).exec();
    if(!data) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, data._doc.userId.toString() , req.user);
    if(hasPermit){
        let {select,populate} = req.query;
        let {id} = req.params

        // set default search params   
        select  = select || SELECT
        populate = populate || POPULATE
    
        let income = await IncomeLibs.getById({select,populate,id});
    
        // generate final responses data
        let result = {
            code : 200,
            message: 'Successfully data Retrived!',
            data  : {
                ...income,
                links : `${process.env.API_BASE_URL}${req.url}`,
            }
        }
    
        return res.status(200).json(result)
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
})



// Update Income on DB
const updateByPatch = async (req,res,next) => {
    try {
        const data = await Income.findById(req.params.id).exec();
        if(!data) throw notFoundError();
        const hasPermit = hasOwn(req.permsissions, data._doc.userId.toString() , req.user);
        if(hasPermit){
            const { id } = req.params;

            let {categoryId,userId,accountId,amount,note} = req.body

            await ExpanseLibs.checkRelationalData(userId,accountId,categoryId,req.user._id)

            const income = await IncomeLibs.updateByPatch({id,categoryId,userId,accountId,amount,note})

            return res.status(200).json({
                code : 200,
                message : 'Income Updated Successfully!',
                data : {
                    ...income,
                }
            });
        }
        else{
            throw unAuthorizedError('You Do not have permit to modify or read other user data!');
        }
    } catch (error) {
        next(error)
    }
}



// Update or Create Income to DB
const updateByPut = tryCatch(async (req,res,next) => {
    const data = await Income.findById(req.params.id).exec();
    if(!data) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, data._doc.userId.toString() , req.user);
    if(hasPermit){
        let {categoryId,userId,accountId,amount,note} = req.body;
        const {id} = req.params;

        await ExpanseLibs.checkRelationalData(userId,accountId,categoryId,req.user._id)

        const {income, state} = await IncomeLibs.updateByPUT({id, categoryId,userId,accountId,amount,note})

        res.status(state === 'create' ? 201 : 200).json({
            code : state === 'create' ? 201 : 200,
            message : `Income ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
            data : {
                ...income,
            }
        })
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
})



// Delete Single Income by Id
const deleteById = tryCatch(async (req,res,next) => {
    const data = await Income.findById(req.params.id).exec();
    if(!data) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, data._doc.userId.toString() , req.user);
    if(hasPermit){
        const {id} = req.params;
        const isDeleted = await IncomeLibs.deleteById(id);
        if(isDeleted){
            res.status(204).json({
                code : 204,
                message : 'Income Deleted Successfully!',
            })
        }
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
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