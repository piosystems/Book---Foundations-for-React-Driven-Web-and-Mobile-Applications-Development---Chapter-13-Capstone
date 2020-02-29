import { Context } from "koa";
import { NextFunction } from "../../custom-types";

import {renderEngine} from '../../view/helper/render-helper';
import { getCustomRepository, Repository, getRepository } from "typeorm";
import { FAQRepository } from "../../model/data-mapper/FAQRepository";
import { FAQ } from "../../model/entity/FAQ";
import { ValidationError, validate } from "class-validator";
import { FAQCategory } from "../../model/entity/FAQCategory";
import { FAQCategoryRepository } from "../../model/data-mapper/FAQCategoryRepository";

export default class FAQController{

//for HTTP method GET and path /faqs. This should return all faqs. Boundary queries can also be specified
    //See for boundary examples. We will lookout here for page and page_size. page=0 and page_size=10 means return 0 to 10
    public static getFAQsWeb = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository = getCustomRepository(FAQRepository);
            //It makes sense to habitually plan for restriction of number of records to return. Else it can be too large.
            //boundaries can be sent as parameters. Max can also be set using settings.
            
            const fAQs: FAQ[] = await fAQRepository.find();
            
            //For find options see https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
            //If for example we want to restrict number returned to 10 starting from 5 to 10, we would do
            //const fAQs: FAQ[] = await fAQRepository.find({skip: 5, take: 10});//these values can be read from parameters
            //we can also choose to enable cache and sort by 
            //const fAQs: FAQ[] = await fAQRepository.find({skip: ctx.query.page, take: ctx.query.page_size, cache: true});
            ctx.status=200;
            ctx.body = renderEngine.render('guest-website/faqs.html', {fAQs, title: 'Frequently Asked Questions (FAQ)',fAQsActive: true});
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    public static getFAQsWebAdmin = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository = getCustomRepository(FAQRepository);
            //It makes sense to habitually plan for restriction of number of records to return. Else it can be too large.
            //boundaries can be sent as parameters. Max can also be set using settings.
            
            const fAQs: FAQ[] = await fAQRepository.find();

            //We need categories to be able to have a drop down of categories when creating new faq
            const fAQCategoryRepository = getCustomRepository(FAQCategoryRepository);
            const fAQCategories: FAQCategory[] = await fAQCategoryRepository.find();
            
            //For find options see https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
            //If for example we want to restrict number returned to 10 starting from 5 to 10, we would do
            //const fAQs: FAQ[] = await fAQRepository.find({skip: 5, take: 10});//these values can be read from parameters
            //we can also choose to enable cache and sort by 
            //const fAQs: FAQ[] = await fAQRepository.find({skip: ctx.query.page, take: ctx.query.page_size, cache: true});
            ctx.status = 200;
            ctx.body = renderEngine.render('faq-management/faqs.html', 
                {fAQs, fAQCategories, title: 'Frequently Asked Questions (FAQs)', manageFAQsActive: true});
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    public static addFAQWebAdmin = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository: Repository<FAQ> = getRepository(FAQ);
            const newFAQ: FAQ = new FAQ();
            newFAQ.question = ctx.request.body.question;
            newFAQ.answer = ctx.request.body.answer;

            //Get the fAQCategory id from request
            const fAQCategoryId = ctx.request.body.fAQCategory;
            //find the Category
            const fAQCategoryRepository = getCustomRepository(FAQCategoryRepository);
            newFAQ.fAQCategory = await fAQCategoryRepository.findOne(fAQCategoryId.valueOf());
            //Below will also work but the above gives more assurance that the category id received in request exists.
            //newFAQ.fAQCategory = fAQCategoryId.valueOf();
            

            //Before saving, let us validate entries that need validation as specified in entity/FAQ.ts
            const errors: ValidationError[] = await validate(newFAQ, { skipMissingProperties: true });

            if (errors.length > 0){
                ctx.status = 400;//Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "validation error", detail: errors}})}`;
            }else{
                //valid entries; save
                const fAQ: FAQ = await fAQRepository.save(newFAQ);
                ctx.status = 201; //Created
                ctx.redirect('/admin/faqs');
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method DELETE and path /faqs/delete/:id should delete the faq with id for the Web. Forms do not support delete verb. This is really an anti-pattern for VERBs
    public static deleteFAQWebAdmin = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository: Repository<FAQ> = getRepository(FAQ);
            const fAQ = await fAQRepository.findOne(ctx.params.id);
            if(!fAQ){
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "FAQ with the id does not exist", detail: "FAQ with the id does not exist"}})}`;
            }else{
                await fAQRepository.remove(fAQ);
                //call getFAQsWeb to finish the job.
                ctx.redirect('/admin/faqs')
            }
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }


    public static getFAQsREST = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository = getCustomRepository(FAQRepository);
            //It makes sense to habitually plan for restriction of number of records to return. Else it can be too large.
            //boundaries can be sent as parameters. Max can also be set using settings.
            
            const fAQs: FAQ[] = await fAQRepository.find();
            
            //For find options see https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
            //If for example we want to restrict number returned to 10 starting from 5 to 10, we would do
            //const fAQs: FAQ[] = await fAQRepository.find({skip: 5, take: 10});//these values can be read from parameters
            //we can also choose to enable cache and sort by 
            //const fAQs: FAQ[] = await fAQRepository.find({skip: ctx.query.page, take: ctx.query.page_size, cache: true});
            if (fAQs.length == 0){
                ctx.status = 204; //No content. The server successfully executed the method but returns no response body.
            }else{
                ctx.status = 200;
            }
            ctx.body = {fAQs, title: 'Frequently Asked Questions (FAQ)',fAQsActive: true};
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //for API method GET and path /faqs/:id 
    public static getFAQ = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository: Repository<FAQ> = getRepository(FAQ);
            const fAQ = await fAQRepository.findOne(ctx.params.id);
            if (fAQ){
                ctx.status = 200;//OK
                ctx.body = `${JSON.stringify({"success": true, fAQ})}`;
            }else{
                //fAQ id sent is invalid
                ctx.status = 400;//Bad Request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "FAQ not found", detail: "The FAQ id sent cannot be found in the database"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //for Method POST and path /faqs. This should post a new FAQ and return the details of the new FAQ posted
    //expect faq(s) in a json array item named fAQs

    public static addFAQs = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository = getCustomRepository(FAQRepository)
            //Get the json array of FAQ objects from the post body
            const fAQsToInsert: FAQ[] = ctx.request.body.fAQs;
            const newFAQs: FAQ[] = [];//To hold the new FAQ objects to insert
            const invalidFAQEntries: any[] = []; //To hold the FAQ entries and error messages that are invalid
            
            await Promise.all(//this leads to wait for all awaits called within the map (iterable)
                fAQsToInsert.map(async (fAQToInsert): Promise<void> => {
                    const newFAQ: FAQ = new FAQ();
                    newFAQ.question = fAQToInsert.question;//notice that we are getting the parameters from request body
                    newFAQ.answer = fAQToInsert.answer;
                    
                    //Before adding to the newFAQs array for saving, let us validate entries that need validation as specified in entity/FAQ.ts
                    const errors: ValidationError[] = await validate(newFAQ, { skipMissingProperties: true });
                    
                    if (errors.length > 0){
                        invalidFAQEntries.push({fAQ: newFAQ, message: "validation error", detail: errors})
                    }else{
                        newFAQs.push(newFAQ);
                    }
                }))//end of Promise.all. Continue with the rest of the code

                if(invalidFAQEntries.length < fAQsToInsert.length){//At least some newFAQ data had no problems; Insert the non-problematic
                    const fAQs = await fAQRepository.insertFAQs(newFAQs)
                    if(invalidFAQEntries.length > 0){//There were some problems
                        ctx.status = 200; //OK but see the response for result
                        ctx.body = `${JSON.stringify({"success": fAQs, "error": invalidFAQEntries})}`
                    }else{//No problems at all
                        ctx.status = 201; //Created
                        ctx.body = `${JSON.stringify({success: fAQs})}`
                    }
                }else{
                    ctx.status = 400; //Bad request. All request data were problematic
                    ctx.body = `${JSON.stringify({"success": false, "error": invalidFAQEntries})}`
                }
            
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //With the above, the addFAQ below (for single FAQ) may not be necessary anymore.
    //for Method POST and path /faq should post a new FAQ and return the details of the new FAQ posted
    
    public static addFAQ = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository: Repository<FAQ> = getRepository(FAQ);
            const newFAQ: FAQ = new FAQ();
            newFAQ.question = ctx.request.body.question;//notice that we are getting the parameters from request body
            newFAQ.answer = ctx.request.body.answer;
                    
            //Before saving, let us validate entries that need validation as specified in entity/FAQ.ts
            const errors: ValidationError[] = await validate(newFAQ, { skipMissingProperties: true });

            if (errors.length > 0){
                ctx.status = 400;//Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "validation error", detail: errors}})}`;
            }else{
                //valid entries; save
                const fAQ: FAQ = await fAQRepository.save(newFAQ);
                ctx.status = 201; //Created
                ctx.body = `${JSON.stringify({"success": true, fAQ})}`
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method PUT and path /faqs/:id should edit the details of the faq with id
    public static updateFAQ = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository: Repository<FAQ> = getRepository(FAQ);

            //Get the fAQ to be updated
            const fAQ = await fAQRepository.findOne(ctx.params.id);

            if (fAQ){
                fAQ.question = ctx.request.body.question;//notice that we are getting the parameters from request body
                fAQ.answer = ctx.request.body.answer;

                //Before saving, let us validate entries that need validation as specified in User.entity.ts
                const errors: ValidationError[] = await validate(fAQ, { skipMissingProperties: true });

                if (errors.length > 0){
                    ctx.status = 400;//Bad request
                    ctx.body = `${JSON.stringify({"success": false, "error": {message: "Validation error", detail: errors}})}`;
                }else{
                    //valid entries; save
                    const updatedFAQ: FAQ = await fAQRepository.save(fAQ);
                    ctx.status = 201; //Created
                    ctx.body = `${JSON.stringify({"success": true, updatedFAQ})}`
                }

            }else{
                //The FAQ with the id does not exist. Depending on the case, you may opt for creating a new FAQ or return error
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "Invalid FAQ", detail: "FAQ with the id does not exist"}})}`;
            }

        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    //Method DELETE and path /faqs/:id should delete the FAQ with id 
    public static deleteFAQ = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository: Repository<FAQ> = getRepository(FAQ);
            const fAQ = await fAQRepository.findOne(ctx.params.id);
            if(!fAQ){
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": {message: "FAQ with the id does not exist", detail: "FAQ with the id does not exist"}})}`;
            }else{
                await fAQRepository.remove(fAQ);
                ctx.status = 204;
                ctx.body = `${JSON.stringify({"success": true})}`
            }
        }catch(error){
            ctx.status = 500;//Internal Server Error
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }

    /*
    Methods below that involve relationship may be more efficient if done with Querybuilder
    See https://github.com/typeorm/typeorm/blob/master/docs/relational-query-builder.md
    For such, we will use data-mapper to define the functions to be called from here as part 
    of CustomRepository
    */
    //Method PATCH and path /faqs/:fAQId/category/:categoryId should set a new category with id categoryId to FAQ with id fAQId
    public static setFAQCategory = async(ctx: Context, _next: NextFunction) => {
        try{
            const fAQRepository = getCustomRepository(FAQRepository);
            const fAQId: number = ctx.params.fAQId;
            const fAQ = await fAQRepository.findOne(fAQId);
            
            const fAQCategoryRepository: Repository<FAQCategory> = getRepository(FAQCategory); //no need to get custom repository here
            const fAQCategoryId: number = ctx.params.fAQCategoryId;
            const fAQCategory = await fAQCategoryRepository.findOne(fAQCategoryId);

            if (fAQ && fAQCategory){
                await fAQRepository.setFAQCategory(fAQId, fAQCategoryId);
                ctx.status = 201;//created
                ctx.body = `${JSON.stringify({"success": true, "FAQ": await fAQRepository.findOne(fAQ)})}`//send the updated FAQ
            }else{
                ctx.status = 400; //Bad request
                ctx.body = `${JSON.stringify({"success": false, "error": 'The FAQ or FAQ Category does not exist'})}`;
            }                      
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message}})}`;
        }
    }
  
}