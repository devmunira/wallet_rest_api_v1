import mongoose, {Schema , model} from "mongoose"


const goalSchema = new Schema({
    name : {
        require : true,
        type: String,
    },
    desired_date : {
        require : true,
        type: Date,
    },
    target_amount : {
        require : true,
        type: Number,
    },
    saved_amount : {
        require : false,
        type: Number,
    },
    userId : {
        require : true,
        type: mongoose.Types.ObjectId(),
        ref : 'User',
        unique: true,
    },
    note : {
        require : false,
        type: String,
    },
    status : {
        require : true,
        type: String,
        default: 'pending',
        enum : ['pending' , 'complete']
    },

},{timestamps : true});



const Goal = model('Goal' , goalSchema)
module.exports = Goal

