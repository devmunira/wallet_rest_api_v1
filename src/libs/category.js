import Category from "./../model/Category.js"
import { generateSortType } from "../utils/Query.js";
import { badRequestError, notFoundError, serverError } from "../utils/Error.js";
import { generateSlug } from "../utils/Generate.js";
import Expanse from "./../model/Expanse.js"



// count data based on filter query
const countCategory = (data) => {
    return Category.count(data);
}

// Create Category to DB
const create = async (name) => {
   try {
    const category = new Category();
    category.name = name;
    category.slug = generateSlug(name);
    await category.save();
    return category._doc;
   } catch (error) {
    throw serverError(error)
   }
}

// Get All Categorys according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page}) => {
    try {
        // populate sortType val for query
    let sortTypeForDB = generateSortType(sortType);
    
    // destructured filter options for query
    let filter = {}
    if(search) filter.name = {$regex : search , $options : 'i'}

    // send request to db with all query params
    let categories = await Category.find(filter)
    .sort({[sortBy] : sortTypeForDB})
    .skip(page * limit - limit)
    .limit(limit)
    

    // count total categorys based on search query params only, not apply on pagination
    let totalItems = await countCategory(filter) ;

    return {
        categories : categories.length > 0 ? categories : [],
        totalItems
    }
    } catch (error) {
        throw serverError(error)
    }
}


// Update or Create Category to DB
const updateByPut = async (id,name) => {
   try {
    let category = await Category.findById(id);
    let state;

    if(!category){
        const data = await Category.findOne({name}).exec();
        if(data) throw notFoundError('Category already exits!')
        category = new Category();
        category.name = name;
        category.slug = generateSlug(name);
        state = 'create'
    }else{
      category.name = name; 
      category.slug = generateSlug(name);
      state = 'update'
    }
    await category.save();
    return {category : category._doc , state};
   } catch (error) {
    throw serverError(error)
   }
}


// Delete Single Category by Id
const deleteById = async (id) => {
    try {
        const category = await Category.findOne({_id : id}).exec();
        if(!category) {
            throw notFoundError();
        }else if(category._doc.name === 'uncategorized'){
            throw notFoundError('This Category can not deleted!')
        }else{
        // update all income and expanse category to uncategorized
        await Expanse.updateMany({categoryId : id} , {categoryId : '64fb25f7088d859c8c08bcec'}).exec();
        await Income.updateMany({categoryId : id} , {categoryId : '64fb25f7088d859c8c08bcec'}).exec();

        await category.deleteOne()
        return true;
    }
    } catch (error) {
        throw serverError(error)
    }
};


export default {
    create,
    getAll,
    updateByPut,
    deleteById,
    countCategory
}