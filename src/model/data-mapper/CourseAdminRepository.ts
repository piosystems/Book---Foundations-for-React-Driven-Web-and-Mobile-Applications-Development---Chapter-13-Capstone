//Data mapper for CourseAdminRepository
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {CourseAdmin} from "../entity/CourseAdmin";

@EntityRepository(CourseAdmin)
export class CourseAdminRepository extends Repository<CourseAdmin> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertCourseAdmin(courseAdmins: CourseAdmin[]){// is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(CourseAdmin)
        .values(courseAdmins)
        .execute();
    }
    //update using query builder. Also more efficient
    updateCourseAdmin(courseAdminId: number, editedCourseAdminData: CourseAdmin){
        return this.createQueryBuilder()
        .update(CourseAdmin)
        .set(editedCourseAdminData)
        .where("id = :id", { id: courseAdminId })
        .execute();
    }
    deleteCourseAdmin(courseAdminId: number){
        return this.createQueryBuilder()
        .delete()
        .from(CourseAdmin)
        .where("id = :id", { id: courseAdminId })
        .execute();
    }
    //functions to set/unset add/remove relations values
    setUser(courseAdminId: number, userId: number){
        return this.createQueryBuilder()
        .relation(CourseAdmin, "user")
        .of(courseAdminId)
        .set(userId); //Using set because it is a one-to-one relation
    }
    unsetUser(courseAdminId: number){
        return this.createQueryBuilder()
        .relation(CourseAdmin, "user")
        .of(courseAdminId)
        .set(null); //Using set because it is a one-to-one relation
    }
    addCourseOfferingAsPrimaryCourseAdmin(courseAdminId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseAdmin, "asPrimaryCourseAdmin_CourseOfferings")
        .of(courseAdminId)
        .add(courseOfferingId);
    }
    removeCourseOfferingAsPrimaryCourseAdmin(courseAdminId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseAdmin, "asPrimaryCourseAdmin_CourseOfferings")
        .of(courseAdminId)
        .remove(courseOfferingId);
    }
    addCourseOfferingAsAdditionalCourseAdmin(courseAdminId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseAdmin, "asAdditionalCourseAdmin_CourseOfferings")
        .of(courseAdminId)
        .add(courseOfferingId);
    }
    removeCourseOfferingAsAdditionalTeacher(courseAdminId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseAdmin, "asAdditionalCourseAdmin_CourseOfferings")
        .of(courseAdminId)
        .remove(courseOfferingId);
    }

    //Use the select query builder to create selections as required by the business case
    //See https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md

    //Below is to find a courseAdmin and return the courseAdmin object with courseofferings as primary courseAdmin embedded
    findByCourseAdminId_LeftJoinAndSelect_AsPrimaryCourseAdmin_CourseOfferings(courseAdminId: number){
        return this.createQueryBuilder("courseAdmin")
        .leftJoinAndSelect("courseAdmin.asPrimaryCourseAdmin_CourseOfferings", "asPrimaryCourseAdmin_CourseOffering")
        .where("courseAdmin.id = :id", { id: courseAdminId })
        .getOne();
    }
    //from the above, you will get result like that below. If you don't want the relation embedded 
    //in the returned object, use only .leftJoin
    /*
    {
        id: 1,
        employeeNumber: ...,
        ...
        asPrimaryCourseAdmin_CourseOfferings: [{
            id: 1,
            startDate: ...
            endDate: ...
            isActive: ...
            ...
        }, {
            id: 2,
            startDate: ...
            endDate: ...
            isActive: ...
            ...
        }]
    }
    */


    //Below is to return a teacher along with the course offerings as additional teacher embedded.
    findByCourseAdminId_LeftJoinAndSelect_AsAdditionalCourseAdmin_CourseOfferings(courseAdminId: number){
        return this.createQueryBuilder("courseAdmin")
        .leftJoinAndSelect("courseAdmin.asAdditionalCourseAdmin_courseOfferings", "asAdditionalCourseAdmin_courseOffering")
        .where("courseAdmin.id = :id", { id: courseAdminId })
        .getOne();
    }
    //from the above, you will get result like
    /*
    {
        id: 1,
        employeeNumber: ...,
        ...
        asAdditionalCourseAdmin_courseOfferings: [{
            id: 1,
            startDate: ...
            endDate: ...
            isActive: ...
            ...
        }, {
            id: 2,
            startDate: ...
            endDate: ...
            isActive: ...
            ...
        }]
    }
    */
   //Below will return a courseAdmin object that has the equivalent user object embedded for quick reference.
   findByCourseAdminId_LeftJoinAndSelectUser(courseAdminId: number){
       return this.createQueryBuilder("courseAdmin")
       .leftJoinAndSelect("courseAdmin.user", "user")
       .where ("courseAdmin.id = :courseAdminId",{courseAdminId: courseAdminId} )
       .getOne();
   }
   

   //find orphan courseAdmins. Anomally
   findCourseAdminsWithNoUserIndentity(){
       return this.createQueryBuilder("courseAdmin")
       .innerJoin("courseAdmin.user","user") //for a review of differences in joins, see https://www.codeproject.com/Articles/33052/Visual-Representation-of-SQL-Joins
       .where ("user.id = :userId",{userId: null})
       .getMany();
    }

    //find courseAdmin and return full courseAdmin object with the different relations joined embedded whether empty or not.
    findByCourseAdminId_LeftJoinAndSelectAll(courseAdminId: number){
        return this.createQueryBuilder("courseAdmin")
        .leftJoinAndSelect("courseAdmin.user", "user")
        .leftJoinAndSelect("courseAdmin.asPrimaryCourseAdmin_CourseOfferings", "asPrimaryCourseAdmin_CourseOffering")
        .leftJoinAndSelect("courseAdmin.asAdditionalCourseAdmin_courseOfferings", "asAdditionalCourseAdmin_courseOffering")
        .where ("courseAdmin.id = :courseAdminId", {courseAdminId: courseAdminId})
        .getOne();
    }
}