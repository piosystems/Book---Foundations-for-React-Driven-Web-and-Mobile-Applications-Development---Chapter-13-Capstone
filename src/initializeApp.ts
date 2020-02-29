import { getCustomRepository, getConnection } from "typeorm";
import { FAQCategoryRepository } from "./model/data-mapper/FAQCategoryRepository";
import { FAQCategory } from "./model/entity/FAQCategory";
import { ValidationError, validate } from "class-validator";
import connection from "./model/connection/connection";
import { Role } from "./model/entity/Role";
import { RoleRepository } from "./model/data-mapper/RoleRepository";

/**
 * Define what should be initialized
 */
export default class InitializeApp{

    /**
     * Initialize FAQ Categories
     */
    public static FAQCategories = async (fAQCategories: FAQCategory[]) => {
        try{
            const fAQCategoryRepository = getCustomRepository(FAQCategoryRepository)
            //Get the json array of FAQ objects from the value passed
            const fAQCategoriesToInsert: FAQCategory[] = fAQCategories;
            const newFAQCategories: FAQCategory[] = [];//To hold the new FAQCategory objects to insert
            const invalidFAQCategoryEntries: any[] = []; //To hold the FAQCategory entries and error messages that are invalid
            
            await Promise.all(//this leads to wait for all awaits called within the map (iterable)
                fAQCategoriesToInsert.map(async (fAQCategoryToInsert): Promise<void> => {
                    const newFAQCategory: FAQCategory = new FAQCategory();
                    newFAQCategory.name = fAQCategoryToInsert.name;//notice that we are getting the parameters from request body
                    
                    //Before adding to the newFAQCategoriess array for saving, let us validate entries that need validation as specified in entity/FAQCategory.ts
                    const errors: ValidationError[] = await validate(newFAQCategory, { skipMissingProperties: true });
                    
                    if (errors.length > 0){
                        invalidFAQCategoryEntries.push({fAQ: newFAQCategory, message: "validation error", detail: errors})
                    }else{
                        newFAQCategories.push(newFAQCategory);
                    }
                }))//end of Promise.all. Continue with the rest of the code

                if(invalidFAQCategoryEntries.length < fAQCategoriesToInsert.length){//At least some newFAQ data had no problems; Insert the non-problematic
                    const fAQCategories = await fAQCategoryRepository.insertFAQCategories(newFAQCategories)
                    if(invalidFAQCategoryEntries.length > 0){//There were some problems
                        console.log(`${JSON.stringify({"success": fAQCategories, "error": invalidFAQCategoryEntries})}`)
                    }else{//No problems at all
                        console.log(`${JSON.stringify({success: fAQCategories})}`)
                    }
                }else{
                    //Bad request. All request data were problematic
                    console.log(`${JSON.stringify({"success": false, "error": invalidFAQCategoryEntries})}`)
                }
            
        }catch(error){
            //Internal Server Error
            console.log(`${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`);
        }

    }
    /**
     * Initialize Roles
     */
    public static Roles = async(roles: Role[]) => {
        try{
            const roleRepository = getCustomRepository(RoleRepository)
            //Get the json array of role objects from the post body
            const rolesToInsert: Role[] = roles;
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
                        console.log(`${JSON.stringify({"success": roles, "error": invalidRoleEntries})}`);
                    }else{//No problems at all
                        console.log(`${JSON.stringify({success: roles})}`);
                    }
                }else{
                    //Bad request. All request data were problematic
                    console.log(`${JSON.stringify({"success": false, "error": invalidRoleEntries})}`);
                }
            
        }catch(error){
            //Internal Server Error
            console.log(`${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`);
        }
    }

}

connection.then(async _connection => {
    //Call initialize FAQCategories
    const fAQCategories: any = [{name: "Uncategorized"},{name: "Login"},{name: "Others"}];
    await InitializeApp.FAQCategories(fAQCategories);

    //Call initialize Roles
    const roles: any = [{name: "user", description: "Basic user"}, {name: "admin", description: "Admin user"}];
    await InitializeApp.Roles(roles);

    //close connection
    await _connection.close();
}).catch(error => console.log(error));//log error to console if there is a problem connecting to database
