import {Context} from 'koa';
import {NextFunction} from '../../custom-types';
import { getCustomRepository, getRepository, Repository } from 'typeorm';
import { Role } from '../../model/entity/Role';
import { RoleRepository } from '../../model/data-mapper/RoleRepository';
import { UserRepository } from '../../model/data-mapper/UserRepository';
import { ValidationError, validate } from 'class-validator';
import { User } from '../../model/entity/User';

export default class RoleController{
    //for API method GET and route /roles
    public static getRoles = async (ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository: Repository<Role> = getRepository(Role);
            const roles: Role[] = await roleRepository.find();
            if (roles.length == 0){
                ctx.status = 204; //No content. The server successfully executed the method but returns no response body.
            }else{
                ctx.status = 200;
            }
            ctx.body = roles;
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //for API method GET and path /roles/:id 
    public static getRole = async (ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository: Repository<Role> = getRepository(Role);
            const role = await roleRepository.findOne(ctx.params.id);
            if (role){
                ctx.status = 200;//OK
                ctx.body = `${JSON.stringify({"success": true, role})}`;
            }else{
                //role id sent is invalid
                ctx.status = 400;//Bad Request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "role not found", detail: "The role id sent cannot be found in the database"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    public static addRoles = async(ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository = getCustomRepository(RoleRepository)
            //Get the json array of role objects from the post body
            const rolesToInsert: Role[] = ctx.request.body.roles
            const newRoles: Role[] = [];//To hold the new role objects to insert
            const invalidRoleEntries: any[] = []; //To hold the role entries and error messages that are invalid
            
            await Promise.all(//this leads to wait for all awaits called within the map (iterable)
                rolesToInsert.map(async (roleToInsert): Promise<void> => {
                    const newRole: Role = new Role();
                    newRole.name = roleToInsert.name;//notice that we are getting the parameters from request body
                    newRole.description = roleToInsert.description;

                    //Before adding to the newRoles array for saving, let us validate entries that need validation as specified in entity/Role.ts
                    const errors: ValidationError[] = await validate(newRole, { skipMissingProperties: true });
                    
                    if (errors.length > 0){
                        invalidRoleEntries.push({role: newRole, message: "validation error", detail: errors})
                    }else if(await roleRepository.findOne({name: newRole.name})){
                        //The role with the name already exists in the database.
                        invalidRoleEntries.push({role: newRole, message: "role name in use", detail: "role with name already exists in database"})
                    }else if(newRoles.some(role => role.name === newRole.name)){
                        //You are repeating name in this role insert batch request.
                        invalidRoleEntries.push({role: newRole, message: "role name repetition", detail: "role name is already in use in this batch"})
                    }else{
                        newRoles.push(newRole);
                    }
                }))//end of Promise.all. Continue with the rest of the code

                if(invalidRoleEntries.length < rolesToInsert.length){//At least some newRole data had no problems; Insert the non-problematic
                    const roles = await roleRepository.insertRoles(newRoles)
                    if(invalidRoleEntries.length > 0){//There were some problems
                        ctx.status = 200; //OK but see the response for result
                        ctx.body = `${JSON.stringify({"success": roles, "error": invalidRoleEntries})}`
                    }else{//No problems at all
                        ctx.status = 201; //Created
                        ctx.body = `${JSON.stringify({success: roles})}`
                    }
                }else{
                    ctx.status = 400; //Bad request. All request data were problematic
                    ctx.body = `${JSON.stringify({"success": false, "error": invalidRoleEntries})}`
                }
            
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //for Method POST and path /roles should post a new role and return the details of the new role posted
    public static addRole = async(ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository: Repository<Role> = getRepository(Role);
            const newRole: Role = new Role();
            newRole.name = ctx.request.body.name;
            newRole.description = ctx.request.body.description;
            //Before saving, let us validate entries that need validation as specified in entity/User.ts
            const errors: ValidationError[] = await validate(newRole, { skipMissingProperties: true });

            if (errors.length > 0){
                ctx.status = 400;//Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "validation error", detail: errors}})}`;
            }else if (await roleRepository.findOne({name: newRole.name})){
                //Role with the name already exists.
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "Role with name already exists", detail: "Role with name already exists"}})}`;
            }else{
                //valid entries; save
                const role: Role = await roleRepository.save(newRole);
                ctx.status = 201; //Created
                ctx.body = `${JSON.stringify({"success": true, role})}`
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method PUT and path /roles/:id should edit the details of the role with id
    public static updateRole = async(ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository: Repository<Role> = getRepository(Role);
            //Get the role to be updated
            const role = await roleRepository.findOne(ctx.params.id);
            if (role){
                role.name = ctx.request.body.name;
                role.description = ctx.request.body.description;
                //Before saving, let us validate entries that need validation as specified in Role.entity.ts
                const errors: ValidationError[] = await validate(role, { skipMissingProperties: true });
                if (errors.length > 0){
                    ctx.status = 400;//Bad request
                    ctx.body = `${JSON.stringify({"success": false, "error": {message: "Validation error", detail: errors}})}`;
                }else if (await roleRepository.findOne({name: role.name})){
                    //The role with the name already exists.
                    ctx.status = 400; //Bad request
                    ctx.body = `${JSON.stringify({"success": false, "error": {message: "Role with name address already exists", detail: "Role with name already exists"}})}`;
                }else{
                    //valid entries; save
                    const updatedRole: Role = await roleRepository.save(role);
                    ctx.status = 201; //Updated
                    ctx.body = `${JSON.stringify({"success": true, updatedRole})}`
                }
            }else{
                //The role with the id does not exist.
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "Role with the id does not exist", detail: "Role with the id does not exist"}})}`;
            }
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method DELETE and path /role/:id should delete the role with id 
    public static deleteRole = async(ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository: Repository<Role> = getRepository(Role);
            const role = await roleRepository.findOne(ctx.params.id);
            if(!role){
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "Role with the id does not exist", detail: "Role with the id does not exist"}})}`;
            }else{
                await roleRepository.remove(role);
                ctx.status = 204;
                ctx.body = `${JSON.stringify({"success": true})}`
            }
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }
    //Method PATCH and path /roles/:roleId/users/:userId
    public static addUserToRole = async(ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository = getCustomRepository(RoleRepository);
            let roleId = ctx.params.roleId; //this should come from url param
            const role = await roleRepository.findOne(roleId);
            
            const userRepository = getCustomRepository(UserRepository);
            let userId = ctx.params.userId; //this should come from url param
            const user = await userRepository.findOne(userId);
            
            if (role && user){
                //first check to see if the user already has the role. If I set userId and roleId in join table as primary key, it should check this for me
                let userHasRole = false;
                userHasRole = user.roles.some(role => role.id == roleId); //Breaks out when true
                /*
                user.roles.map((role => {
                    if (role.id == roleId){
                        userHasRole = true;
                        return;//leave loop as soon as condition is met.
                        }
                    }))
                    */
                if (userHasRole) {
                    ctx.status = 400; //Bad request
                    ctx.body = `${JSON.stringify({"success": false, "error": 'The user already has this role'})}`;
                }else{
                    //add the role to the user
                    await userRepository.addRole(userId, roleId); //use this if using custom repository      
                    ctx.status = 201;//created
                    ctx.body = `${JSON.stringify({"success": true, "user": await userRepository.findOne(userId)})}`//send the updated user
                }
            }else{
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": 'The user or role does not exist'})}`;
            }                      
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message}})}`;
        }
    }

    //Method GET and path /roles/:id/user should get the users assigned a given role
    //In the entity/Role.ts we specified a lazy relationship.
    public static getRoleUsers = async(ctx: Context, _next: NextFunction) => {
        try{
            const roleRepository: Repository<Role> = getRepository(Role);
            const role = await roleRepository.findOne(ctx.params.id);
            if (role){
                const roleUsers: User[] = await role.users;
                ctx.status = 200;//OK
                ctx.body = `${JSON.stringify({"success": true, "users": roleUsers})}`;
            }else{
                //role id sent is invalid
                ctx.status = 400;//Bad Request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "role not found", detail: "The role id sent cannot be found in the database"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method PATCH and path /roles/:roleId/users/:userId should remove user with userId from role with roleId
    public static deleteUserFromRole = async(ctx: Context, _next: NextFunction) => {
        try{
            const userRepository = getCustomRepository(UserRepository);
            const roleRepository: Repository<Role> = getRepository(Role);
            const userId = ctx.params.userId;
            const roleId = ctx.params.roleId;
            const user = await userRepository.findOne(userId);
            const role = await roleRepository.findOne(roleId);

            if (user && role){
                await userRepository.removeRole(userId, roleId);
                ctx.status = 201; //Successful execution. Return the current state of role
                ctx.body = `${JSON.stringify({"success": true, role})}`
            }else{
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "user or role not found", detail: "The user or role id sent cannot be found in the database"}})}`;
            }
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message}})}`;
        }
    }
}

