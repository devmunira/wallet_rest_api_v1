import mongoose, { Schema } from "mongoose";

export const UserSubSchema = new Schema({
    username : {
        required : true,
        type: String,
        unique: true,
    },
    email:{
        type: String,
        required : true,
        unique: true
    },
    phone : {
        type: String,
        required : false,
    },
    UserId : {
        type: mongoose.Types.ObjectId,
        ref : 'User',
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