import mongoose, {Schema , model} from "mongoose"
import { GoalSubSchema, UserSubSchema } from "./SubSchema";


const reportSchema = new Schema({
    user : {
        require : true,
        type: UserSubSchema,
        default : {}
    },
    goals : {
        require : true,
        type: [GoalSubSchema],
        default : []
    },
    totalIncome : {
        require : false,
        type: Number,
    },
    totalExpanse : {
        require : false,
        type: Number,
    },
    expanse_category : {
        require : false,
        type: [String],
    },
    state : {
        require : true,
        default: 'middle'
    },
},{timestamps : true});



const Report = model('Report' , reportSchema)
module.exports = Report

