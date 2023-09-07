import mongoose, {Schema , model} from "mongoose"


const incomeSchema = new Schema({
    note : {
        require : false,
        type: String,
    },
    amount : {
        require : true,
        type: Number,
    },
    userId : {
        require : true,
        type: mongoose.Types.ObjectId(),
        ref : 'User',
    },
    categoryId : {
        require : true,
        type: mongoose.Types.ObjectId(),
        ref : 'Category',
    },
    accountId : {
        require : true,
        type: mongoose.Types.ObjectId(),
        ref : 'Account',
    },
},{timestamps : true});



const Income = model('Income' , incomeSchema)
module.exports = Income

