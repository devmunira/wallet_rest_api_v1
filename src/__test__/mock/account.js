import mongoose from "mongoose"

export const createValidAccountMock = {
    name : 'test account',
    account_details : "Test Account Details",
    userId : new mongoose.Types.ObjectId().toString(),
    initial_value : 0,
}


export const updateValidAccountMock = {
    name : 'updated account',
    account_details : "Test Account Details",
    userId : new mongoose.Types.ObjectId().toString(),
    initial_value : 0,
}



export const createInvalidAccountMock = {
    name : '',
    account_details : "",
    userId : "",
    initial_value : 0,
}