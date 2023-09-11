import Permission from "./../model/Permission.js"
import { generateSortType } from "../utils/Query.js";
import { notFoundError } from "../utils/Error.js";
import PermissionRole from "../model/PermissionRole.js"



// count data based on filter query
const countPermission = (data) => {
    return Permission.count(data);
}

// Create Permission to DB
const create = async (name) => {
    const permission = new Permission();
    permission.name = name;
    await permission.save();
    return permission._doc;
}

// Get All Permissions according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page}) => {
    // populate sortType val for query
    let sortTypeForDB = generateSortType(sortType);
    
    // destructured filter options for query
    let filter = {}
    if(search) filter.name = {$regex : search , $options : 'i'}

    // send request to db with all query params
    let permissions = await Permission.find(filter)
    .sort({[sortBy] : sortTypeForDB})
    .skip(page * limit - limit)
    .limit(limit)
    

    // count total permissions based on search query params only, not apply on pagination
    let totalItems = await countPermission(filter) ;

    return {
        permissions : permissions.length > 0 ? permissions : [],
        totalItems
    }
}


// Get All Permission of a specific Role
const getPermissionsBasedOnRoleId = async (roleId) => {
   try {
    return  await PermissionRole.find({ roleId }).distinct('permissionId')
   } catch (error) {
    console.log('Error' , error)
   }
}



// Get Single Permissions according to filter from DB
const getPermissionsNameBasedOnRoleId = async (roleId) => {
    const permissionIds =  await PermissionRole.find({ roleId }).distinct('permissionId').exec();

    const permissions = await Promise.all( permissionIds.map(async (item) => {
        const permisision = await Permission.findById(item).distinct('name').exec();
        return permisision;
    }));

    return permissions ? [...permissions] : []
}


// Update or Create Permission to DB
const updateByPut = async (id,name) => {
    let permission = await Permission.findById(id);
    let state;

    if(!permission){
        const data = await Permission.findOne({name}).exec();
        if(data) throw notFoundError('Permission already exits!')
        permission = new Permission();
        permission.name = name;
        state = 'create'
    }else{
      permission.name = name; 
      state = 'update'
    }
    await permission.save();
    return {permission : permission._doc , state};
}


// Update Permission on DB
const updateByPatch = () => {

}


// Delete Single Permission by Id
const deleteById = async (id) => {
    const permission = await Permission.findOne({_id : id}).exec();
    console.log(permission)
    if(!permission) {
        throw notFoundError();
    }else{
      const role_permissions = await PermissionRole.deleteMany({permissionId : id});
      await permission.deleteOne()
      return true;
    }
};



// Delete Multiple Permission by Id
const bulkDelete = () => {

}

// Function to update permissions
async function updatePermissionsByRoleId(roleId , permissionIds, newPermissions) {
    const updatedPermissions = permissionIds.length > 0 ? [...permissionIds] : [];

    if(newPermissions && newPermissions?.length > 0){
        permissionIds = permissionIds.map((item) => item.toString());

        await Promise.all(newPermissions.map(async (newPermission) => {
            const permission = await Permission.findById(newPermission).exec();
            if(!permission) throw new Error('Invalid Permission Id!');
            else{
                if (!permissionIds.includes(newPermission)) {
                    updatedPermissions.push(newPermission)
                    const newItem = new PermissionRole();
                    newItem.roleId = roleId;
                    newItem.permissionId = newPermission;
                    await newItem.save();
                  }
            }
          }))

    }

    return updatedPermissions;
}


export default {
    create,
    getAll,
    getPermissionsBasedOnRoleId,
    updateByPatch,
    updateByPut,
    deleteById,
    bulkDelete,
    countPermission,
    updatePermissionsByRoleId,
    getPermissionsNameBasedOnRoleId
}