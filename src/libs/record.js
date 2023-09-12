import mongoose from "mongoose";
import Expanse from "../model/Expanse.js";
import Income from "../model/Income.js";
import Record from "../model/Record.js"
import User from "../model/User.js";
import { generateSortType } from "../utils/Query.js";
import { notFoundError } from "../utils/Error.js";
import { determineFinancialState } from "../utils/Generate.js";


// count Data 
const count = (filter) => {
    return User.count(filter);
}

const populateRecord = async (id,filter={}) => {
    let totalExpanse = 0;
    let totalIncome = 0;
    let totalSavings = 0;
    const expanses =  await Expanse.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) , ...filter } },
        {
            $group: {
            _id: { amount: '$amount'},
            totalAmount: { $sum: '$amount' } 
            }
        },
        {
            $project: {
            totalAmount: 1,
            _id: 0
            }
        }
    ]);
    const incomes =  await Income.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id), ...filter } },
        {
            $group: {
            _id: { amount: '$amount'},
            totalAmount: { $sum: '$amount' } 
            }
        },
        {
            $project: {
            totalAmount: 1,
            _id: 0
            }
        }
    ]);

    totalExpanse = expanses.reduce((acc,cur)=>{
        return cur.totalAmount;
    },0);
    totalIncome = incomes.reduce((acc,cur)=>{
        return cur.totalAmount;
    },0);

    totalSavings = totalIncome - totalExpanse

    let state = determineFinancialState(totalSavings)

    return {
            totalExpanse,
            totalIncome,
            totalSavings,
            userId : id,
            state
    }
}

// create Data in DB
const create = async ({userId, totalIncome , totalExpanse,totalSavings,expanse_category,state}) => {
    try {
       const record = new Record();
       record.userId = userId
       record.totalExpanse = totalExpanse
       record.totalIncome = totalIncome
       record.totalSavings = totalSavings
       record.expanse_category = JSON.stringify(expanse_category) 
       record.state = state
       await record.save();
    } catch (error) {
        throw new Error(error)
    }
}


// Delete All Data from DB
const deleteMany = async () => {
    try {
      return await Record.deleteMany();
    } catch (error) {
        throw new Error(error)
    }
}


// get All Users Data from DB
const getAllUsersData = async ({limit,page,fromdate,todate}) => {
    try {     
        // destructured filter options for query
        let filter = {}
        if(fromdate || todate){
            filter.updatedAt = {}
            if(fromdate) filter.updatedAt.$gte = new Date(fromdate)
            if(todate) filter.updatedAt.$lte = new Date(todate)
        }

        // send request to db with all query params
         let users = await User.find()
        .skip(page * limit - limit)
        .limit(limit).lean().exec();

        // Get ALl Data
        const data = await Promise.all(users.map(async (item) => {
           return await populateRecord(item._id , filter) 
        }))


        // count total roles based on search query params only, not apply on pagination
        let totalItems = await count(filter) ;

        return {
            data,
            totalItems
        }
    } catch (error) {
        throw new Error(error)
    }
}


// get Single Users Data from DB
const getSingleUserData = async ({fromdate,todate,userId}) => {
    try {
        // destructured filter options for query
        let filter = {}
        if(fromdate || todate){
            filter.updatedAt = {}
            if(fromdate) filter.updatedAt.$gte = new Date(fromdate)
            if(todate) filter.updatedAt.$lte = new Date(todate)
        }

        let user = await User.findById(userId).lean().exec();

        if(!user) throw notFoundError();

        // Get ALl Data
        const data = await populateRecord(userId , filter) 

        return {data}
    } catch (error) {
        throw new Error(error)
    }
}


// Filter data based 0n finansial State
const filterData = async ({limit,page,sortType,sortBy,state,min_saving}) => {
    try {
        
    } catch (error) {
        throw new Error(error)
    }
}


export default {
    create,
    deleteMany,
    getAllUsersData,
    getSingleUserData,
    filterData
}