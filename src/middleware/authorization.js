import { unAuthorizedError } from "../utils/Error.js";

const authorization = (permission) => (req,_res,next) => {
    const permissions = req.user.role.permissions || [];
    if(!permissions.includes(permission)) throw unAuthorizedError();
    else next()
}

export default authorization;