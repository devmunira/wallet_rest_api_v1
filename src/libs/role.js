import Role from "../model/Role.js"
import { generateSortType } from "../utils/Query.js";
import { notFoundError } from "../utils/Error.js";
import PermissionRole from "../model/PermissionRole.js";
import mongoose from "mongoose";
import { PermissionLibs } from "./index.js";
import Permission from "../model/Permission.js";



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

    if (permissions && permissions.length > 0) {
      for (const item of permissions) {
        if(mongoose.Types.ObjectId.isValid(item)){  
            const data = await PermissionRole.findOne({
            $and: [{ roleId: role._id }, { permissionId: item }],
            }).exec();

            const dataCheck = await Permission.findById(item).exec();

            if (!data && dataCheck !== null) {
                const permissionRole = new PermissionRole();
                permissionRole.roleId = role._id;
                permissionRole.permissionId = item;
                await permissionRole.save();
            }

        }
      }
    }

    const permissionIds = await PermissionLibs.getPermissionsBasedOnRoleId(role._id);

    return { role: role.toJSON(), permission: permissionIds };
  } catch (error) {
    console.error('Error creating role:', error);
    throw error; 
  }
};


// Get All Roles according to filter from DB
const getAll = async ({search, sortBy ,sortType, limit , page}) => {
    try {
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

          // get permissions for associated roles
          const updatedRoles = await Promise.all(roles.map(async (role) => {
              const permissionIds = await PermissionLibs.getPermissionsBasedOnRoleId(role._id);
              
              let permissions = await Promise.all(permissionIds.map(async (id) => {
                const data = await Permission.findById(id).select(['name', '_id', 'createdAt', 'updatedAt']).exec();
                return {
                  ...(data ? data._doc : {}), 
                };
              }));

              return {
                ...(role && role._doc ? { ...role._doc } : {}),
                permissions,
              };
          }));

          return {
              updatedRoles,
              totalItems
          }
    } catch (error) {
        throw serverError(error)
    }
}


// Update or Create Role to DB
const updateByPatch = async (id,name,permissions=[]) => {
    try {
      const updatedRole = await Role.findById(id).exec();
      if(!updatedRole) throw new Error('Role Not Found!')
      updatedRole.name = name ? name : updatedRole.name;
      await updatedRole.save();
    
      let permissionsArray = [];
      const permissionIds = await PermissionLibs.getPermissionsBasedOnRoleId(id);
      const updatedPermissions = await PermissionLibs.updatePermissionsByRoleId(id, permissionIds, permissions);
    
      if(updatedPermissions.length > 0){
        permissionsArray = await Promise.all(updatedPermissions.map(async(item) => {
          const data = await Permission.findById(item).select(['name', '_id', 'createdAt', 'updatedAt']).exec();
              return {
                  ...(data ? data._doc : {}), 
              };
          })
      );
      } 
      return {
        updatedRole,
        permissionsArray
      }
    } catch (error) {
       throw serverError(error) 
    }
}


// Delete Single Role by Id
const deleteById = async (id) => {
    try {
      const role = await Role.findOne({_id : id}).exec();
      if(!role) {
          throw notFoundError();
      }else{
        if(role.name === 'admin' || role.name === 'super-admin' || role.name === 'user') 
        throw new Error('Can not Delete this Role')
        else {
          await PermissionRole.deleteMany({roleId : id});
          await role.deleteOne()
          return true;
        }
      }
    } catch (error) {
        throw serverError(error)
    }
};


export default {
    create,
    getAll,
    updateByPatch,
    deleteById,
    countRole
}