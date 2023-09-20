import mongoose from "mongoose";
import {createAccount , getById}  from "./../../../libs/account.js";
import { generateSelectItems, generateSortType } from './../../../utils/Query.js';
import Account from "../../../model/Account.js";
import conectMongoDB from "../../../config/db.js";
import colors from "colors"


const validAccountCreatedObj = {
  name: 'Test Account2',
  account_details: 'Lorem Ipsum',
  initial_value: 0,
  userId: new mongoose.Types.ObjectId().toString(),
};

jest.mock('../../../libs/account.js', () => {
    return {
      createAccount: jest.fn(),
      getById  : jest.fn(),
      getAll : jest.fn(),
      updateByPatch : jest.fn(),
      updateByPUT : jest.fn(),
      deleteById : jest.fn()
    };
});

// jest.mock('./../../../utils/Query.js' , () => {
//     return {
//         generateSelectItems : jest.fn(),
//         generateSortType : jest.fn()
//     }
// })


beforeAll(async () => {
    await conectMongoDB('test');
  });

describe('Account Service', () => {      
    describe('Create an Account Service', () => {
        describe('given valid argument', () => {
            it('should return a created account object', async () => {
                createAccount.mockResolvedValue({
                _id: 'mocked_id',
                createdAt: 'mocked_createdAt',
                updatedAt: 'mocked_updatedAt',
                ...validAccountCreatedObj,
                });
  
            const createdAccount = await createAccount(validAccountCreatedObj);
  
            expect(createdAccount).toEqual(expect.objectContaining({
            name: validAccountCreatedObj.name,
            account_details: validAccountCreatedObj.account_details,
            initial_value: validAccountCreatedObj.initial_value,
            userId: validAccountCreatedObj.userId,
            }));
            expect(createdAccount._id).toBeDefined();
            expect(createdAccount.createdAt).toBeDefined();
            expect(createdAccount.updatedAt).toBeDefined();
        });
      });
    });


    // Get Single Account By Id
    describe('GET Single Account', () => {
        describe('given invalid account id', () => {
            it('should return an undefined', async () => {
                const account = await getById({id : new mongoose.Types.ObjectId().toString()});
                expect(account).toBeUndefined()
            }); 
        });
    });

});
  