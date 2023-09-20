import { PermissionLibs } from "../libs/index.js";
import Role from "../model/Role.js";
import { unAuthorizedError } from "../utils/Error.js";

const authorization = (requiredPermissions = []) => async (req,_res,next) => {
    try {
        const role = await Role.findById(req.user.roleId).exec();        
        let userPermissions = await PermissionLibs.getPermissionsNameBasedOnRoleId(req.user.roleId) || [];
        req.permsissions = {
            requiredPermissions,
            userPermissions : userPermissions.flat(),
            userRole : role._doc.name
        };
        if(role._doc.name === 'admin' ||role._doc.name === 'Admin' ||role._doc.name === 'Super-Admin' ||role._doc.name === 'super-admin' ){
            next();
        }else{
            // Check if the user has any of the requiredPermissions
            const hasRequiredPermission = requiredPermissions.some((requiredPermission) => {
                return userPermissions.flat().includes(requiredPermission);
            });
        
            if (!hasRequiredPermission) {
                throw unAuthorizedError('Access Denied!');
            }
            next();
        }
   
    } catch (error) {
        next(error)
    }
} 

export default authorization;