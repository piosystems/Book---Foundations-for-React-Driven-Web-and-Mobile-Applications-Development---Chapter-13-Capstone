//Data mapper for Role entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import { FAQ } from "../entity/FAQ";

@EntityRepository(FAQ)
export class FAQRepository extends Repository<FAQ> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertFAQs(fAQs: FAQ[]){//fAQs is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(FAQ)
        .values(fAQs)
        .execute();
    }
    //update using query builder. Also more efficient
    updateFAQ(fAQId: number, editedFAQData: FAQ){
        return this.createQueryBuilder()
        .update(FAQ)
        .set(editedFAQData)
        .where("id = :id", { id: fAQId })
        .execute();
    }
    deleteFAQ(fAQId: number){
        return this.createQueryBuilder()
        .delete()
        .from(FAQ)
        .where("id = :id", { id: fAQId })
        .execute();
    }
    setFAQCategory(fAQId: number, fAQCategoryId: number){
        return this.createQueryBuilder()
        .relation(FAQ, "fAQCategory")
        .of(fAQId)
        .set(fAQCategoryId) //as per many to one.
    }
    unsetCategory(fAQId: number, fAQCategoryId: number){
        return this.createQueryBuilder()
        .relation(FAQ, "fAQCategory")
        .of(fAQId)
        .remove(fAQCategoryId)
    }

    //finders
    //find FAQs that belong to a given FAQCategory
    findByFAQCategoryId(fAQCategoryId: number){
        return this.createQueryBuilder("fAQ")
        .innerJoin("fAQ.fAQCategory","fAQCategory")
        .where("fAQCategory.id = :fAQCategoryId", {fAQCategoryId: fAQCategoryId})
        .getMany();
    }

}