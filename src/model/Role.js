import {Schema , model} from "mongoose"


const roleSchema = new Schema({
    name : {
        require : true,
        type: String,
        unique: true,
    }
},{timestamps : true});

const Role = model('Role' , roleSchema)

export default Role
