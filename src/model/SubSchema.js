import { Schema } from "mongoose";

export const UserSubSchema = new Schema({
    username : {
        require : true,
        type: String,
        unique: true,
    },
    email:{
        type: String,
        require : true,
        unique: true
    },
    phone : {
        type: String,
        require : false,
    },
    roleId : {
        type: mongoose.Types.ObjectId(),
        ref : 'Role',
    },
})


export const GoalSubSchema = new Schema({
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
})