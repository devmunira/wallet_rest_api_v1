import Category from "./../model/Category.js"
import { generateSortType } from "../utils/Query.js";
import { notFoundError } from "../utils/Error.js";
import { generateSlug } from "../utils/Generate.js";



// count data based on filter query
const countCategory = (data) => {
    return Category.count(data);
}

// Create Category to DB
const create = async (name) => {
    const category = new Category();
    category.name = name;
    category.slug = generateSlug(name);
    await category.save();
    return category._doc;
}

// Get All Categorys according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page}) => {
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
}


// Update or Create Category to DB
const updateByPut = async (id,name) => {
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
}


// Delete Single Category by Id
const deleteById = async (id) => {
    const category = await Category.findOne({_id : id}).exec();
    if(!category) {
        throw notFoundError();
    }else{
      /** 
       * TODO: All Expanse , Incomes  will be uncategoried
      */
      await category.deleteOne()
      return true;
    }
};



// Delete Multiple Category by Id
const bulkDelete = () => {

}




export default {
    create,
    getAll,
    updateByPut,
    deleteById,
    bulkDelete,
    countCategory
}