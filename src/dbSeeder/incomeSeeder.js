import {faker} from "@faker-js/faker"
import Income from "../model/Income.js";

// income seed
const incomeSeed = async (user, categories,item) => {
    const incomenote = faker.lorem.sentence();
    const incomeamount = faker.number.int({min : 1000 , max:100000}); 
    const incomeuserId = user._doc._id;  
    const incomecategoryId = categories[faker.number.int({min : 1 , max:5})]; 
    const incomeaccountId = item; 

    const income = new Income({
    note : incomenote,
    amount :  incomeamount,
    accountId : incomeaccountId,
    userId :  incomeuserId,
    categoryId :  incomecategoryId,
    });

    await income.save();
}

export default incomeSeed