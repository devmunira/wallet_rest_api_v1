import { notFoundError, serverError } from '../utils/Error.js';
import Expanse from '../model/Expanse.js';
import { generateSelectItems, generateSortType } from '../utils/Query.js';



// Create or Register New User
const createExpanse = async ({categoryId,userId,accountId,amount,note}) => {
    try {
        const expanse = new Expanse({
            amount,
            note : note ? note : '',
            categoryId,
            accountId,
            userId
        });

        await expanse.save();
        delete expanse._doc.id
        delete expanse._doc.__v
        return {expanse};
    } catch (error) {
        throw serverError(error.message)
    }
}

// count data based on filter query
const count = (data) => {
    return Expanse.count(data);
}


// Get All Roles according to filter from DB
const getAll = async ({limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromdate,todate}) => {
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

        console.log('filter' , filter)
      }
    // send request to db with all query params
   let expanses = await Expanse.find(filter)
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
        expanses,
        totalItems
    }
}

// get Single Item
const getById = async ({select,populate,id}) => {
    let selectedColums = generateSelectItems(select,['_id','amount','categoryId','userId','accountId', 'note' ,'createdAt' , 'updatedAt']);

    let populateRelations = generateSelectItems(populate,['user','category','account']);
    

    // send request to db with all query params
    let expanse = await Expanse.findById(id)
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

    if(expanse){
        return expanse._doc
    }else{
        throw notFoundError()
    }


}

// Update Single User Via PATCH Request
const updateByPatch = async ({id,categoryId,userId,accountId,amount,note}) => {

    const expanse = await Expanse.findById(id).exec();
    if(!expanse) throw new Error('Expanse Not Found!')

    expanse.amount = amount ? amount : expanse.amount;
    expanse.accountId = accountId ? accountId : expanse.accountId;
    expanse.categoryId = categoryId ? categoryId : expanse.categoryId;
    expanse.userId = userId ? userId : expanse.userId;
    expanse.note = note ? note : expanse.note;
    await expanse.save();

    delete expanse._doc.id
    delete expanse._doc.__v
    return expanse._doc
}



// Update Single User Via PATCH Request
const updateByPUT = async ({id, categoryId,userId,accountId,amount,note}) => {
    const expanse = await Expanse.findById(id).exec();

    if(!expanse) {
       const {expanse} =  await createExpanse({categoryId,userId,accountId,amount,note})
        return {
            expanse : expanse._doc, 
            state : 'create'
        }
    }else{
        expanse.amount = amount ? amount : expanse.amount;
        expanse.accountId = accountId ? accountId : expanse.accountId;
        expanse.categoryId = categoryId ? categoryId : expanse.categoryId;
        expanse.userId = userId ? userId : expanse.userId;
        expanse.note = note ? note : expanse.note;
        await expanse.save();

        return {
            expanse : expanse._doc,
            state : 'update'
        }
    }  
}



// Delete Single Role by Id
const deleteById = async (id) => {
    const expanse = await Expanse.findOne({_id : id}).exec();
    if(!expanse) {
        throw notFoundError();
    }else{
        
        await expanse.deleteOne()
        return true;
    }
};


export default {
    createExpanse,
    getAll,
    updateByPatch,
    updateByPUT,
    deleteById,
    getById
}