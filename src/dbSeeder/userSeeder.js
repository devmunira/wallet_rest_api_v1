import Account from "../model/Account.js";
import Expanse from "../model/Expanse.js";
import Income from "../model/Income.js";
import Role from "../model/Role.js";
import User from "../model/User.js";
import { notFoundError } from "../utils/Error.js";
import bcrypt from "bcrypt";
import accountSeed from "./accountSeeder.js";
import expanseSeed from "./expnaseSeeder.js";
import incomeSeed from "./incomeSeeder.js";
import { DEFAULTPASS } from "../config/auth.js";
import Category from "../model/Category.js";

// Seed numOfUser User Data to User Documents
const userSeeder = async () => {
    try {
        await User.deleteMany();
        await Account.deleteMany();
        await Expanse.deleteMany();
        await Income.deleteMany();

        const userRole = await Role.findOne({name : 'user'}).exec();
        if(!userRole) throw notFoundError('Please First Set a Role or Add a Role Named user!');

        const adminRole = await Role.findOne({name : 'admin'}).exec();
        if(!adminRole) throw notFoundError('Please First Set a Role or Add a Role Named Admin!');

        const hashPassword = await bcrypt.hash(DEFAULTPASS , 10);

        console.log('Please wait users are creating........'.bgRed)

        const user = new User({
            username : 'userOne',
            email : 'user@gmail.com', // Set your valid email for email verification
            password : hashPassword, // Default Pass - 200720Ab!
            roleId : userRole,
        });
        await user.save()

        // Admin User created
        const adminUser = new User({
            username : 'Admin',
            email : 'admin@gmail.com', // Set your valid email for email verification
            password : hashPassword, // Default Pass - 200720Ab!
            roleId : adminRole,
        });

        await adminUser.save();

        // Create Number of Accounts for user
        const accounts =  await accountSeed(user._doc._id, 10);

        // Get Created Categories for query in expanse and income
        const categories = await Category.find().distinct('_id').lean().exec();

        console.log('Please wait expanses and incomes are creating........'.bgRed)
        accounts.forEach(async (item) => {
            await expanseSeed(user,categories,item)
            await incomeSeed(user,categories,item)  
        })
        console.log('User & Admin Created Successfully!'.bgGreen)
        console.log('Expanses & Incomes Created Successfully!'.bgGreen)
    } catch (error) {
        throw error;
    }
}

export default userSeeder

