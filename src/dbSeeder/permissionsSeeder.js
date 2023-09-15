import { PERMISSIONSARARY } from "../config/auth.js";
import Permission from "../model/Permission.js";

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

export default permissionSeeder
