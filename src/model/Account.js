import mongoose, {Schema , model} from "mongoose"


const accountSchema = new Schema({
    name : {
        require : true,
        type: String,
    },
    account_details : {
        require : false,
        type: String,
    },
    initial_val : {
        require : true,
        type: Number,
    },
    userId : {
        require : true,
        type: mongoose.Types.ObjectId(),
        ref : 'User',
        unique: true,
    },
},{timestamps : true});



const Account = model('Account' , accountSchema)
module.exports = Account

