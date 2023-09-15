import Category from "../model/Category.js";
import {faker} from "@faker-js/faker"
import { generateSlug } from "../utils/Generate.js";

// category seed
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

export default categoryseed
