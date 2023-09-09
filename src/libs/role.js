import Role from "../model/Role.js"
import { generateSortType } from "../utils/Query.js";
import { notFoundError } from "../utils/Error.js";
import { generateSlug } from "../utils/Generate.js";
import PermissionRole from "../model/PermissionRole.js";
import mongoose from "mongoose";



// count data based on filter query
const countRole = (data) => {
    return Role.count(data);
}


// Create Role and associate with Permissions
const create = async (name, permissions) => {
  try {
    const role = new Role();
    role.name = name;
    await role.save(); 

    if (permissions.length > 0) {
      for (const item of permissions) {
        if(mongoose.Types.ObjectId.isValid(item)){  
            const data = await PermissionRole.findOne({
            $and: [{ roleId: role._id }, { permissionId: item }],
            }).exec();
            if (!data) {
                const permissionRole = new PermissionRole();
                permissionRole.roleId = role._id;
                permissionRole.permissionId = item;
                await permissionRole.save();
            }
        }
      }
    }

    const permissionIds = await PermissionRole.find({ roleId: role._id }).distinct('permissionId').exec();

    return { role: role.toJSON(), permission: permissionIds };
  } catch (error) {
    console.error('Error creating role:', error);
    throw error; 
  }
};


// Get All Roles according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page}) => {
    // populate sortType val for query
    let sortTypeForDB = generateSortType(sortType);
    
    // destructured filter options for query
    let filter = {}
    if(search) filter.name = {$regex : search , $options : 'i'}

    // send request to db with all query params
    let roles = await Role.find(filter)
    .sort({[sortBy] : sortTypeForDB})
    .skip(page * limit - limit)
    .limit(limit)
    

    // count total roles based on search query params only, not apply on pagination
    let totalItems = await countRole(filter) ;

    return {
        roles : roles.length > 0 ? roles : [],
        totalItems
    }
}


// Update or Create Role to DB
const updateByPut = async (id,name,permissions) => {
    let role = await Role.findById(id);
    let state;

    if(!role){
        const data = await Role.findOne({name}).exec();
        if(data) throw notFoundError('Role already exits!')
        role = new Role();
        role.name = name;
        role.permissions = permissions;
        state = 'create'
    }else{
      role.name = name; 
      role.permissions = permissions;
      state = 'update'
    }
    await role.save();
    return {role : role._doc , state};
}


// Delete Single Role by Id
const deleteById = async (id) => {
    const role = await Role.findOne({_id : id}).exec();
    if(!role) {
        throw notFoundError();
    }else{
      if(role.name === 'admin' || role.name === 'super-admin' || role.name === 'user') 
      throw new Error('Can not Delete this Role')
      else {
        await role.deleteOne()
        return true;
      }
    }
};



// Delete Multiple Role by Id
const bulkDelete = () => {

}




export default {
    create,
    getAll,
    updateByPut,
    deleteById,
    bulkDelete,
    countRole
}