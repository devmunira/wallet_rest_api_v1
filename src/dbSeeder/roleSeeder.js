import { USERPERMISSION } from "../config/auth.js";
import Permission from "../model/Permission.js";
import PermissionRole from "../model/PermissionRole.js";
import Role from "../model/Role.js";


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
                        permissionId : permission?._id
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

export default roleSeeder