import { Context } from "koa";
import { NextFunction } from "../../custom-types";
import { getCustomRepository, Repository, getRepository } from "typeorm";
import { FAQCategoryRepository } from "../../model/data-mapper/FAQCategoryRepository";
import { FAQCategory } from "../../model/entity/FAQCategory";
import { ValidationError, validate } from "class-validator";
import { FAQ } from "../../model/entity/FAQ";

export default class FAQCategoryController{

//for API method GET and path /faq-categories. This should return all faq-categories. Boundary queries can also be specified
    //See for boundary examples. We will lookout here for page and page_size. page=0 and page_size=10 means return 0 to 10
    public static getFAQCategories = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQCategoryRepository = getCustomRepository(FAQCategoryRepository);
            //It makes sense to habitually plan for restriction of number of records to return. Else it can be too large.
            //boundaries can be sent as parameters. Max can also be set using settings.
            
            const fAQCategories: FAQCategory[] = await fAQCategoryRepository.find();
            
            //For find options see https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
            //If for example we want to restrict number returned to 10 starting from 5 to 10, we would do
            //const fAQCategories: FAQCategory[] = await fAQCategoryRepository.find({skip: 5, take: 10});//these values can be read from parameters
            //we can also choose to enable cache and sort by 
            //const fAQCategories: FAQCategory[] = await fAQCategoryRepository.find({skip: ctx.query.page, take: ctx.query.page_size, cache: true});
            if (fAQCategories.length == 0){
                ctx.status = 204; //No content. The server successfully executed the method but returns no response body.
            }else{
                ctx.status = 200;
            }
            ctx.body =  `${JSON.stringify({"success": true, fAQCategories})}`;
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //for API method GET and path /faq-categories/:id 
    public static getFAQCategory = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQCategoryRepository: Repository<FAQCategory> = getRepository(FAQCategory);
            const fAQ = await fAQCategoryRepository.findOne(ctx.params.id);
            if (fAQ){
                ctx.status = 200;//OK
                ctx.body = `${JSON.stringify({"success": true, fAQ})}`;
            }else{
                //fAQ id sent is invalid
                ctx.status = 400;//Bad Request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "FAQ Category not found", detail: "The FAQ Category id sent cannot be found in the database"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //for Method POST and path /faq-categories. This should post a new FAQ and return the details of the new FAQ posted
    //expect faq(s) in a json array item named fAQCategories

    public static addFAQCategories = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQCategoryRepository = getCustomRepository(FAQCategoryRepository)
            //Get the json array of FAQ objects from the post body
            const fAQCategoriesToInsert: FAQCategory[] = ctx.request.body.fAQCategories;
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
                        ctx.status = 200; //OK but see the response for result
                        ctx.body = `${JSON.stringify({"success": fAQCategories, "error": invalidFAQCategoryEntries})}`
                    }else{//No problems at all
                        ctx.status = 201; //Created
                        ctx.body = `${JSON.stringify({success: fAQCategories})}`
                    }
                }else{
                    ctx.status = 400; //Bad request. All request data were problematic
                    ctx.body = `${JSON.stringify({"success": false, "error": invalidFAQCategoryEntries})}`
                }
            
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //With the above, the addFAQ below (for single FAQCategory) may not be necessary anymore.
    //for Method POST and path /faq-category should post a new FAQ and return the details of the new FAQ posted
    
    public static addFAQCategory = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQCategoryRepository: Repository<FAQCategory> = getRepository(FAQCategory);
            const newFAQCategory: FAQCategory = new FAQCategory();
            newFAQCategory.name = ctx.request.body.name;//notice that we are getting the parameters from request body
                    
            //Before saving, let us validate entries that need validation as specified in entity/FAQ.ts
            const errors: ValidationError[] = await validate(newFAQCategory, { skipMissingProperties: true });

            if (errors.length > 0){
                ctx.status = 400;//Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "validation error", detail: errors}})}`;
            }else{
                //valid entries; save
                const fAQCategory: FAQCategory = await fAQCategoryRepository.save(newFAQCategory);
                ctx.status = 201; //Created
                ctx.body = `${JSON.stringify({"success": true, fAQCategory})}`
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method PUT and path /faq-categories/:id should edit the details of the faq with id
    public static updateFAQCategory = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQCategoryRepository: Repository<FAQCategory> = getRepository(FAQCategory);

            //Get the fAQCategory to be updated
            const fAQCategory = await fAQCategoryRepository.findOne(ctx.params.id);

            if (fAQCategory){
                fAQCategory.name = ctx.request.body.name;//notice that we are getting the parameters from request body

                //Before saving, let us validate entries that need validation as specified in User.entity.ts
                const errors: ValidationError[] = await validate(fAQCategory, { skipMissingProperties: true });

                if (errors.length > 0){
                    ctx.status = 400;//Bad request
                    ctx.body = `${JSON.stringify({"success": false, "error": {message: "Validation error", detail: errors}})}`;
                }else{
                    //valid entries; save
                    const updatedFAQCategory: FAQCategory = await fAQCategoryRepository.save(fAQCategory);
                    ctx.status = 201; //Created
                    ctx.body = `${JSON.stringify({"success": true, updatedFAQCategory})}`
                }

            }else{
                //The FAQ with the id does not exist. Depending on the case, you may opt for creating a new FAQCategory or return error
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "Invalid FAQ Category", detail: "FAQ Category with the id does not exist"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method DELETE and path /faq-categories/:id should delete the FAQCategory with id 
    public static deleteFAQ = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQCategoryRepository: Repository<FAQCategory> = getRepository(FAQCategory);
            const fAQCategory = await fAQCategoryRepository.findOne(ctx.params.id);
            if(!fAQCategory){
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "FAQ Category with the id does not exist", detail: "FAQ Category with the id does not exist"}})}`;
            }else{
                await fAQCategoryRepository.remove(fAQCategory);
                ctx.status = 204;
                ctx.body = `${JSON.stringify({"success": true})}`
            }
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Relationships
    public static getFAQCategoryFAQs = async(ctx: Context, _next: NextFunction) => {

        try{
            const fAQCategoryRepository: Repository<FAQCategory> = getRepository(FAQCategory);
            const fAQCategory = await fAQCategoryRepository.findOne(ctx.params.id);
            if (fAQCategory){
                const fAQCategoryFAQs: FAQ[] = await fAQCategory.fAQs;
                ctx.status = 200;//OK
                ctx.body = `${JSON.stringify({"success": true, "FAQs": fAQCategoryFAQs})}`;
            }else{
                //FAQCategory id sent is invalid
                ctx.status = 400;//Bad Request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "FAQ Category not found", detail: "The FAQ Category id sent cannot be found in the database"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }
}