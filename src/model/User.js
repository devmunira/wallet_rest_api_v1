import mongoose, {Schema , model} from "mongoose"
import {isAfter} from "date-fns"


const userSchema = new Schema({
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
    password : {
        type: String,
        require : true,
    },
    phone : {
        type: String,
        require : false,
    },
    roleId : {
        type: mongoose.Types.ObjectId(),
        ref : 'Role',
    },
    verification_token : {
        type: Number,
        require: false,
    },
    expiredAt : {
        type: Date,
        require: false,
    },
    refresh_token : {
        type: String,
        require: false,
    },
    issuedIp : {
        type: String,
        require: false,
    }
},{timestamps : true});

// Check OTP is Valid Or Not
userSchema.virtual('notExpired').get(function(){
    return this.verification_token && !isAfter(new Date() , new Date(this.expiredAt))
});


userSchema.set('toJSON' , {
    virtuals : true,
    versionKey: false,
});


module.exports = User

