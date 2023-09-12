import { notFoundError, serverError } from '../utils/Error.js';
import Account from '../model/Account.js';
import { generateSelectItems, generateSortType } from '../utils/Query.js';
import Expanse from '../model/Expanse.js';
import Income from '../model/Income.js';



// Create or Register New User
const createAccount = async ({name,account_details,initial_value,userId}) => {
    try {
        const account = new Account({
            name,
            account_details,
            initial_value,
            userId
        });

        await account.save();
        delete account._doc.id
        delete account._doc.__v
        return {account};
    } catch (error) {
        throw serverError(error.message)
    }
}

// count data based on filter query
const count = (data) => {
    return Account.count(data);
}



// get Single Item
const getById = async ({select,populate,id}) => {
    let selectedColums = generateSelectItems(select,['_id','name','account_details','initial_value','userId','createdAt' , 'updatedAt']);

    let populateRelations = generateSelectItems(populate,['expanse','income','user']);
    

    // send request to db with all query params
    let account = await Account.findById(id)
    .select(selectedColums)
    .populate(populateRelations.includes('user') ? {
        path   : 'userId',
        select : 'username , email , phone , roleId, createdAt , updatedAt , _id',
    } : '');

    account = account._doc;

    if(populateRelations.includes('expanse')){
        let expanses = await Expanse.find({accountId : id}).exec();
        account = {...account, expanses}
    }
    if(populateRelations.includes('income')){
        let incomes = await Income.find({accountId : id}).exec();
        account = {...account , incomes}
    }

    if(account){
        return account
    }else{
        throw notFoundError()
    }


}

// Get All Roles according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page,user,select,populate}) => {
    // populate sortType val for query
    let sortTypeForDB = generateSortType(sortType);
    let selectedColums = generateSelectItems(select,['_id','name','account_details','userId','initial_value', 'createdAt' , 'updatedAt']);

    let populateRelations = generateSelectItems(populate,['user','expanse','income']);
    
    // destructured filter options for query
    let filter = {}
    if(search) filter.name = {$regex : search , $options : 'i'}
    if(user) filter.userId = user;

    // send request to db with all query params
    let accounts = await Account.find(filter)
    .select(selectedColums)
    .sort({[sortBy] : sortTypeForDB})
    .skip(page * limit - limit)
    .limit(limit)
    .populate(populateRelations.includes('user') ? {
        path   : 'userId',
        select : 'username , email , phone , roleId',
    } : '')
    
    // count total roles based on search query params only, not apply on pagination
    let totalItems = await count(filter) ;

    return {
        accounts,
        totalItems
    }
}

// Update Single User Via PATCH Request
const updateByPatch = async (id,name,account_details,initial_value,userId) => {
    const account = await Account.findById(id).exec();
    if(!account) throw new Error('Account Not Found!')

    account.name = name ? name : account.name;
    account.account_details = account_details ? account_details : account.account_details;
    account.initial_value = initial_value ? initial_value : account.initial_value;
    account.userId = userId ? userId : account.userId;
    await account.save();

    
    delete account._doc.id
    delete account._doc.__v
    return account._doc
}



// Update Single User Via PATCH Request
const updateByPUT = async (id,name,account_details,initial_value,userId) => {
    const account = await Account.findById(id).exec();

    if(!account) {
       const {account} =  await createAccount({name,account_details,initial_value,userId})
        return {
            account : account._doc, 
            state : 'create'
        }
    }else{
        account.name = name ? name : account.name;
        account.account_details = account_details ? account_details : account.account_details;
        account.initial_value = initial_value ? initial_value : account.initial_value;
        account.userId = userId ? userId : account.userId;
        await account.save();

        return {
            account : account._doc,
            state : 'update'
        }
    }  
}



// Delete Single Role by Id
const deleteById = async (id) => {
    const account = await Account.findOne({_id : id}).exec();
    if(!account) {
        throw notFoundError();
    }else{
        await Expanse.deleteMany({accountId: id}).exec()
        await Income.deleteMany({accountId: id}).exec()
        await account.deleteOne()
        return true;
    }
};


export default {
    createAccount,
    getAll,
    updateByPatch,
    updateByPUT,
    deleteById,
    getById
}