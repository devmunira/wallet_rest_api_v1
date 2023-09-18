import {AccountLibs} from "../../../../libs/index.js"
import tryCatch from "../../../../middleware/tryCatchError.js";
import { IDQUERY, LIMIT, PAGE, POPULATE, SEARCH, SELECT, SORTBY, SORTTYPE } from "../../../../config/default.js";
import { transformData } from "../../../../utils/Response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/Hateoas.js";
import { generatePagination } from "../../../../utils/Pagination.js";
import { notFoundError, userRelationDataCheck } from "../../../../utils/Error.js";
import Account from "../../../../model/Account.js";
import hasOwn from "../../../../middleware/hasOwn.js";
import mongoose from "mongoose";

// Create Account to DB
const create = tryCatch(async (req,res,next) => {
    // Getting All Request Body Params
    let {name,account_details,initial_value,userId} = req.body;

    if(userId){
        await userRelationDataCheck(userId);
    }else{
        userId = req.user._id 
    }

    // Create Account on DB
    const {account} = await AccountLibs.createAccount({name,account_details,initial_value,userId});

    // Send Responses
    res.status(201).json({
        code : 201,
        mesaage : 'Account Created Completed Successfully!',
        data : {
        ...account._doc,
        },
    })
})

// Get All Accounts according to filter from DB
const getAll = tryCatch(async (req,res,next) => {
    let {limit,page,sortType,sortBy,search,user, select , populate} = req.query;

    // set default search params   
    limit = +limit || LIMIT
    page = +page || PAGE
    sortBy = sortBy || SORTBY
    sortType = sortType || SORTTYPE
    search = search || SEARCH
    user = user || IDQUERY
    select  = select || SELECT
    populate = populate || POPULATE
 
    let {accounts , totalItems} = await AccountLibs.getAll({search, sortBy ,sortType, limit , page,user,select,populate});
 
    // count total Page
    let totalPage = Math.ceil(totalItems / limit)
 
    // generate final responses data
    let result = {
         code : 200,
         message: 'Successfully data Retrived!',
         data  : accounts.length > 0 ?  transformData(accounts , req.url) : [], 
         links : generateAllDataHateoasLinks(accounts,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
         pagination : generatePagination(totalPage,page,totalItems,limit)
     }
 
     return res.status(200).json(result)
})


    

// Get Single Accounts according to filter from DB
const getById = tryCatch(async (req,res,next) => {
    const account = await Account.findById(req.params.id).exec();
    if(!account) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, account._doc.userId.toString() , req.user);
    if(hasPermit){
        let {select,populate} = req.query;
        let {id} = req.params

        // set default search params   
        select  = select || SELECT
        populate = populate || POPULATE
    
        let account = await AccountLibs.getById({select,populate,id});
    
        // generate final responses data
        let result = {
            code : 200,
            message: 'Successfully data Retrived!',
            data  : {
                ...account,
                links : `${process.env.API_BASE_URL}${req.url}`,
            }
        }
    
        return res.status(200).json(result)
    }else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
})



// Update Account on DB
const updateByPatch = async (req,res,next) => {
    const account = await Account.findById(req.params.id).exec();
    if(!account) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, account._doc.userId.toString() , req.user);
    if(hasPermit){
        try {
            const { id } = req.params;
    
            let {name,account_details,initial_value,userId} = req.body;
    
            if(userId){
                await userRelationDataCheck(userId);
            }else{
                userId = req.user._id 
            }
    
            const account = await AccountLibs.updateByPatch(id,name,account_details,initial_value,userId)
    
            return res.status(200).json({
                code : 200,
                message : 'Account Updated Successfully!',
                data : {
                    ...account,
                }
            });
        } catch (error) {
            next(error)
        }
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
}



// Update or Create Account to DB
const updateByPut = tryCatch(async (req,res,next) => {
    const account = await Account.findById(req.params.id).exec();
    // if(!account) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, account ?  account._doc.userId.toString() : null , req.user);
    if(hasPermit){
        let {name,account_details,initial_value,userId} = req.body;
        const {id} = req.params;

        if(userId){
            await userRelationDataCheck(userId);
        }else{
            userId = req.user._id 
        }

        const {account, state} = await AccountLibs.updateByPUT(id,name,account_details,initial_value,userId)

        res.status(state === 'create' ? 201 : 200).json({
            code : state === 'create' ? 201 : 200,
            message : `Account ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
            data : {
                ...account,
            }
        })
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
})



// Delete Single Account by Id
const deleteById = tryCatch(async (req,res,next) => {
    const account = await Account.findById(req.params.id).exec();
    if(!account) throw notFoundError();
    const hasPermit = hasOwn(req.permsissions, account._doc.userId.toString() , req.user);
    if(hasPermit){
        const {id} = req.params;
        const isDeleted = await AccountLibs.deleteById(id);
        if(isDeleted){
            res.status(204).json({
                code : 204,
                message : 'Account & Associated Incomes , Expanses are Deleted Successfully!',
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