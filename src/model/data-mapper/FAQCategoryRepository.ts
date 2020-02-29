//Data mapper for FAQCategory entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import { FAQCategory } from "../entity/FAQCategory";

@EntityRepository(FAQCategory)
export class FAQCategoryRepository extends Repository<FAQCategory> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertFAQCategories(fAQCategories: FAQCategory[]){//fAQCategories is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(FAQCategory)
        .values(fAQCategories)
        .execute();
    }
    //update using query builder. Also more efficient
    updateFAQCategory(fAQCategoryId: number, editedFAQCategoryData: FAQCategory){
        return this.createQueryBuilder()
        .update(FAQCategory)
        .set(editedFAQCategoryData)
        .where("id = :id", { id: fAQCategoryId })
        .execute();
    }
    deleteFAQCategory(fAQCategoryId: number){
        return this.createQueryBuilder()
        .delete()
        .from(FAQCategory)
        .where("id = :id", { id: fAQCategoryId })
        .execute();
    }
    findByName(name: string) {
        return this.createQueryBuilder("fAQCategory")
            .where("fAQCategory.name = :name", { name })
            .getOne();//Name is set as unique
    }
    addFAQ(fAQCategoryId: number, fAQId: number){
        return this.createQueryBuilder()
        .relation(FAQCategory, "fAQs")
        .of(fAQCategoryId)
        .add(fAQId)//using add as per one to many
    }
    removeFAQ(fAQCategoryId: number, fAQId: number){
        return this.createQueryBuilder()
        .relation(FAQCategory, "fAQs")
        .of(fAQCategoryId)
        .remove(fAQId) //using remove as per one to many
    }

    //More finders

    //find FAQCategory and join FAQs
    findByFAQCategoryId_LeftJoinAndSelectFAQs(fAQCategoryId: number){
        return this.createQueryBuilder("fAQCategory")
        .leftJoinAndSelect("fAQCategory.fAQs","FAQ")
        .where("fAQCategory.id = :fAQCategoryId", {fAQCategoryId: fAQCategoryId})
        .getOne();
    }

}