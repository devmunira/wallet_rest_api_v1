import { faker } from '@faker-js/faker';
import User from './../model/User.js';
import dotenv from "dotenv"
import { DEFAULTPASS, PERMISSIONSARARY, USERPERMISSION } from '../config/auth.js';
import Role from '../model/Role.js';
dotenv.config();
import bcrypt  from 'bcrypt';
import { notFoundError } from '../utils/Error.js';
import Permission from '../model/Permission.js';
import PermissionRole from '../model/PermissionRole.js';
import Account from "../model/Account.js"
import {generateSlug} from "../utils/Generate.js"
import Category from '../model/Category.js';
import Expanse from '../model/Expanse.js';
import Income from '../model/Income.js'; 

// Seed numOfUser Permission Data to Permission Documents
const permissionSeeder = async () => {
    try {
        await Permission.deleteMany();
        console.log('Please wait permissions are creating........'.bgRed)
        PERMISSIONSARARY.forEach(async (item) => {
            const per = new Permission({
                name : item,
            });
            await per.save()
        })
        console.log('Permissions Created Successfully!'.bgGreen)
    } catch (error) {
        throw error;
    }
}


// Seed numOfUser User Data to User Documents
const roleSeeder = async (roles = ['admin' , 'user' , 'editor']) => {
    try {
        await Role.deleteMany();
        await PermissionRole.deleteMany();
        console.log('Please wait roles are creating........'.bgRed)
        roles.forEach(async (item) => {
            if(item == 'user'){
                const role = new Role({name : item});
                await role.save()
                // assign user permissions
                USERPERMISSION.forEach(async (item) => {
                    const permission = await Permission.findOne({name : item}).exec();
                    const perrole = new PermissionRole({
                        roleId : role._doc._id,
                        permissionId : permission._id
                    }) 
                    await perrole.save()
                    
                })
            }else{
                const role = new Role({name : item});
                await role.save()
            }
        })
        console.log('Role Created Successfully!'.bgGreen)
    } catch (error) {
        throw error;
    }
}


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


// expanse seed
const expanseSeed = async (user,categories,item) => {
    const note = faker.lorem.sentence();
    const amount = faker.number.int({min : 1000 , max:100000}); 
    const userId = user._doc._id;  
    const categoryId = categories[faker.number.int({min : 1 , max:5})]; 
    const accountId = item; 

    const expanse = new Expanse({
        note,
        amount,
        userId,
        categoryId,
        accountId,
    });
    await expanse.save();
}
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



// account seed
const categoryseed = async (numOfAccounts = 5) => {
    await Category.deleteMany()
    console.log('Please wait, categories are being created........'.bgRed);
    let categories = [];
    for (let i = 0; i < numOfAccounts; i++) {
        const name = faker.word.noun();
        const slug = generateSlug(name)
        const category = new Category({
            name,
            slug
        });

        categories.push(category._doc._id)
        await category.save();
    }
    console.log('Category Created Successfully!'.bgGreen);

    return categories;
}


export async function seedData() {
    try {
        // Execute functions in serial order
        await permissionSeeder();
        await roleSeeder();
        await categoryseed();
        await userSeeder();
        console.log('All seed functions executed successfully.'.bgWhite);
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

