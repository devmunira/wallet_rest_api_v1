import mongoose, {Schema , model} from "mongoose"


const ropermissionRoleSchema = new Schema({
    roleId : {
        require : true,
        type: mongoose.Types.ObjectId,
        ref : 'Role',
        unique: false,
    },
    permissionId : {
        require : true,
        type: mongoose.Types.ObjectId,
        ref : 'Permission',
        unique: false,

    },
},{timestamps : true});

const PermissionRole = model('PermissionRole' , ropermissionRoleSchema)
export default PermissionRole

