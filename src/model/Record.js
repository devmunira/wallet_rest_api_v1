import  mongoose, {Schema , model} from "mongoose"


const recordSchema = new Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    totalIncome : {
        type: Number,
    },
    totalExpanse : {
        type: Number,
    },
    totalSavings : {
        type: Number,
    },
    expanse_category : {
        type: [String],
    },
    state : {
        type: String,
        default: 'middle'
    },
},{timestamps : true});



const Record = model('Record' , recordSchema)

export default Record
