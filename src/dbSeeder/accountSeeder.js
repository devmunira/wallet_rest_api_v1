import Account from "../model/Account.js";
import {faker} from "@faker-js/faker"

// account seed
const accountSeed = async (id,numOfAccounts = 1) => {
    console.log('Please wait, accounts are being created........'.bgRed);
    let accounts = [];
    for (let i = 0; i < numOfAccounts; i++) {
        const name = faker.lorem.sentence({min : 3 , max:5});
        const account_details = faker.lorem.sentence();
        const initial_value = faker.number.int({min : 1000 , max:100000}); 
        const userId = id; 

        const account = new Account({
            name,
            account_details,
            initial_value,
            userId,
        });

        accounts.push(account._doc._id)
        await account.save();
    }
    console.log('Accounts Created Successfully!'.bgGreen);

    return accounts;
}

export default accountSeed
