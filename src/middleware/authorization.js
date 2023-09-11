import { PermissionLibs } from "../libs/index.js";
import Role from "../model/Role.js";
import { unAuthorizedError } from "../utils/Error.js";

const authorization = (permission) => async (req,_res,next) => {
    try {
        const role = await Role.findById(req.user.roleId).exec();
        if(role._doc.name === 'admin' ||role._doc.name === 'Admin' ||role._doc.name === 'Super-Admin' ||role._doc.name === 'super-admin' ){
            next();
        }else{
            const permissions = await PermissionLibs.getPermissionsNameBasedOnRoleId(req.user.roleId) || [];
            permission?.forEach((item) => {
                if(!permissions.flat().includes(item)) throw unAuthorizedError();
            });
            next();
        }   
    } catch (error) {
        next(error)
    }
}

export default authorization;