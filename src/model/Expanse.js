import mongoose, {Schema , model} from "mongoose"


const expanseSchema = new Schema({
    note : {
        require : false,
        type: String,
    },
    amount : {
        require : true,
        type: Number,
        require : true,
    },
    userId : {
        require : true,
        type: mongoose.Types.ObjectId,
        ref : 'User',
    },
    categoryId : {
        require : true,
        type: mongoose.Types.ObjectId,
        ref : 'Category',
    },
    accountId : {
        require : true,
        type: mongoose.Types.ObjectId,
        ref : 'Account',
    },
},{timestamps : true});



const Expanse = model('Expanse' , expanseSchema)

export default Expanse
