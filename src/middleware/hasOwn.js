import { PermissionLibs } from "../libs/index.js";
import Account from "../model/Account.js";
import Expanse from "../model/Expanse.js";
import Income from "../model/Income.js";
import { unAuthorizedError } from "../utils/Error.js";

const hasOwn = (permissions,id,user) => {
    if (permissions.userRole === 'admin' || permissions.userRole === 'Admin' || permissions.userRole === 'Super-Admin' || permissions.userRole === 'super-admin') {
        return true;
    } else {
        const hasEvery = permissions.requiredPermissions.every((item) => permissions.userPermissions.includes(item));
        if (hasEvery) {
            return true;
        } else {
            console.log('every nai' , permissions.requiredPermissions)
            let findOwn = permissions.requiredPermissions.filter((item) => item.includes('own'));
            if (findOwn.length > 0) { 
                const getOwn = permissions.userPermissions.filter((item) => item === findOwn[0]);
                if (getOwn.length > 0) { 
                    if (id !== user._id) {
                        throw new Error('You Do not have permit to modify or read other user data!'); // Throw a new Error
                    } else {
                        return true
                    }
                }else{
                    return true;
                }
            } else {
                return true
            }
        }
    }
};

export default hasOwn;