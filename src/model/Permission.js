import {Schema , model} from "mongoose"


const permissionSchema = new Schema({
    name : {
        require : true,
        type: String,
        unique: true,
    }
},{timestamps : true});

const Permission = model('Permission' , permissionSchema)

module.exports = Permission

