import {Schema , model} from "mongoose"


const categorySchema = new Schema({
    name : {
        require : true,
        type: String,
        unique: true,
    },
    slug : {
        require : false,
        type: String,
        unique: true,
    }
},{timestamps : true});

const Category = model('Category' , categorySchema)

module.exports = Category

