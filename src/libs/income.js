import { notFoundError, serverError } from '../utils/Error.js';
import Income from '../model/Income.js';
import { generateSelectItems, generateSortType } from '../utils/Query.js';



// Create or Register New User
const createIncome = async ({categoryId,userId,accountId,amount,note}) => {
    try {
        const income = new Income({
            amount,
            note : note ? note : '',
            categoryId,
            accountId,
            userId
        });

        await income.save();
        delete income._doc.id
        delete income._doc.__v
        return {income};
    } catch (error) {
        throw serverError(error.message)
    }
}

// count data based on filter query
const count = (data) => {
    return Income.count(data);
}


// Get All Roles according to filter from DB
const getAll = async ({limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromdate,todate}) => {
    try {
        // populate sortType val for query
    let sortTypeForDB = generateSortType(sortType);

    let selectedColums = generateSelectItems(select,['_id','amount','categoryId','userId','accountId', 'note' ,'createdAt' , 'updatedAt']);

    let populateRelations = generateSelectItems(populate,['user','category','account']);
    
    // destructured filter options for query
    let filter = {}
    if(search) filter.note = {$regex : search , $options : 'i'}
    if(user) filter.userId = user;
    if(account) filter.accountId = account;
    if(category) filter.categoryId = category;
    if (min_price || max_price) {
        filter.amount = {};   
        if (min_price) {
          filter.amount.$gte = min_price;
        }
      
        if (max_price) {
          filter.amount.$lte = max_price;
        }
      }
      if(fromdate || todate){
        filter.updatedAt = {}
        if(fromdate) filter.updatedAt.$gte = new Date(fromdate)
        if(todate) filter.updatedAt.$lte = new Date(todate)
      }
        // send request to db with all query params
    let incomes = await Income.find(filter)
        .select(selectedColums)
        .sort({[sortBy] : sortTypeForDB})
        .skip(page * limit - limit)
        .limit(limit)
        .populate(populateRelations.includes('user') ? {
            path   : 'userId',
            select : 'username , email , phone , roleId, createdAt , updatedAt',
        } : '')
        .populate(populateRelations.includes('category') ? {
            path   : 'categoryId',
            select : 'name , slug , createdAt , updatedAt , _id',
        } : '')
        .populate(populateRelations.includes('account') ? {
            path   : 'accountId',
            select : 'name , account_details createdAt , updatedAt , _id',
        } : '')
        
        // count total roles based on search query params only, not apply on pagination
        let totalItems = await count(filter) ;

        return {
            incomes,
            totalItems
        }
    } catch (error) {
        
    }
}

// get Single Item
const getById = async ({select,populate,id}) => {
    try {
        let selectedColums = generateSelectItems(select,['_id','amount','categoryId','userId','accountId', 'note' ,'createdAt' , 'updatedAt']);

        let populateRelations = generateSelectItems(populate,['user','category','account']);
    
        // send request to db with all query params
        let income = await Income.findById(id)
        .select(selectedColums)
        .populate(populateRelations.includes('user') ? {
            path   : 'userId',
            select : 'username , email , phone , roleId,createdAt , updatedAt , _id',
        } : '')
        .populate(populateRelations.includes('category') ? {
            path   : 'categoryId',
            select : 'name , slug , createdAt , updatedAt , _id',
        } : '')
        .populate(populateRelations.includes('account') ? {
            path   : 'accountId',
            select : 'name , account_details createdAt , updatedAt , _id',
        } : '')

        if(income){
            return income._doc
        }else{
            throw notFoundError()
        }
    } catch (error) {
        throw serverError(error)
    }


}

// Update Single User Via PATCH Request
const updateByPatch = async ({id,categoryId,userId,accountId,amount,note}) => {
    try {   
        const income = await Income.findById(id).exec();
        if(!income) throw new Error('Income Not Found!')

        income.amount = amount ? amount : income.amount;
        income.accountId = accountId ? accountId : income.accountId;
        income.categoryId = categoryId ? categoryId : income.categoryId;
        income.userId = userId ? userId : income.userId;
        income.note = note ? note : income.note;
        await income.save();

        delete income._doc.id
        delete income._doc.__v
        return income._doc
    } catch (error) {
        throw serverError(error)
    }
}



// Update Single User Via PATCH Request
const updateByPUT = async ({id, categoryId,userId,accountId,amount,note}) => {
    try {
        const income = await Income.findById(id).exec();
        if(!income) {
        const {income} =  await createIncome({categoryId,userId,accountId,amount,note})
            return {
                income : income._doc, 
                state : 'create'
            }
        }else{
            income.amount = amount ? amount : income.amount;
            income.accountId = accountId ? accountId : income.accountId;
            income.categoryId = categoryId ? categoryId : income.categoryId;
            income.userId = userId ? userId : income.userId;
            income.note = note ? note : income.note;
            await income.save();

            return {
                income : income._doc,
                state : 'update'
            }
        }
    } catch (error) {
        throw serverError(error)
    }  
}



// Delete Single Role by Id
const deleteById = async (id) => {
    try {
        const income = await Income.findOne({_id : id}).exec();
        if(!income) {
            throw notFoundError();
        }else{
            await income.deleteOne()
            return true;
        }
    } catch (error) {
       throw serverError(error) 
    }
};


export default {
    createIncome,
    getAll,
    updateByPatch,
    updateByPUT,
    deleteById,
    getById
}