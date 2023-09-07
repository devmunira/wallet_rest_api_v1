import {Schema , model} from "mongoose"


const roleSchema = new Schema({
    name : {
        require : true,
        type: String,
        unique: true,
    },
    permissions :{
        type: [String],
        require : false,
    },
},{timestamps : true});

const Role = model('Role' , roleSchema)
module.exports = Role

