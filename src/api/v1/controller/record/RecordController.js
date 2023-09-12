import { LIMIT, PAGE, SORTBY, SORTTYPE } from "../../../../config/default.js";
import { RecordLibs } from "../../../../libs/index.js";
import {generateAllDataHateoasLinks} from "../../../../utils/Hateoas.js"
import {generatePagination} from "../../../../utils/Pagination.js"

// Get All Users Records and Store It in DB
const getAllUserDataAnalysis = async (req,res,next) => {
    try {
        let {limit,page,fromdate,todate} = req.query;

        // set default search params   
        limit = +limit || LIMIT
        page = +page || PAGE
    
        let {data , totalItems} = await RecordLibs.getAllUsersData({limit , page,fromdate,todate});
    
        // count total Page
        let totalPage = Math.ceil(totalItems / limit)
    
        // generate final responses data
        let result = {
            code : 200,
            message: 'Successfully data Retrived!',
            data, 
            links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
            pagination : generatePagination(totalPage,page,totalItems,limit)
        }
    
        return res.status(200).json(result)                    
    } catch (error) {
        next(error)
    }
}

// Get Single Users Records and Store It in DB
const getSingleUserDataAnalysis = async (req,res,next) => {
    try {
        let {fromdate,todate} = req.query;
        let {userId} = req.params;
        let {data} = await RecordLibs.getSingleUserData({fromdate,todate,userId});

        
    
        // generate final responses data
        let result = {
            code : 200,
            message: 'Successfully data Retrived!',
            data
        }
        return res.status(200).json(result) 
    } catch (error) {
        next(error)
    }
}


// Filter Record Data From DB
const filterData = async (req,res,next) => {
    try {
        let {limit,page,sortType,sortBy,state,min_saving} = req.query;

        // set default search params   
        limit = +limit || LIMIT
        page = +page || PAGE
        sortBy = sortBy || SORTBY
        sortType = sortType || SORTTYPE
        
    
        let {data , totalItems} = await RecordLibs.filterData({limit,page,sortType,sortBy,state,min_saving});
    
        // count total Page
        let totalPage = Math.ceil(totalItems / limit)
    
        // generate final responses data
        let result = {
            code : 200,
            message: 'Successfully data Retrived!',
            data, 
            links : generateAllDataHateoasLinks(req.url,req._parsedUrl.pathname,page,totalPage,req.query),
            pagination : generatePagination(totalPage,page,totalItems,limit)
        }
    
        return res.status(200).json(result) 
    } catch (error) {
        next(error)
    }
}

export {
    getAllUserDataAnalysis,
    getSingleUserDataAnalysis,
    filterData
}