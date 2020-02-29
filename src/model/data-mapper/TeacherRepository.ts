//Data mapper for Teacher entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {Teacher} from "../entity/Teacher";

@EntityRepository(Teacher)
export class TeacherRepository extends Repository<Teacher> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertTeachers(teachers: Teacher[]){//teachers is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Teacher)
        .values(teachers)
        .execute();
    }
    //update using query builder. Also more efficient
    updateTeacher(teacherId: number, editedTeacherData: Teacher){
        return this.createQueryBuilder()
        .update(Teacher)
        .set(editedTeacherData)
        .where("id = :id", { id: teacherId })
        .execute();
    }
    deleteTeacher(teacherId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Teacher)
        .where("id = :id", { id: teacherId })
        .execute();
    }
    //functions to set/unset add/remove relations values
    setUser(teacherId: number, userId: number){
        return this.createQueryBuilder()
        .relation(Teacher, "user")
        .of(teacherId)
        .set(userId); //Using add because it is a one-to-many relation
    }
    unsetUser(teacherId: number){
        return this.createQueryBuilder()
        .relation(Teacher, "user")
        .of(teacherId)
        .set(null); //Using add because it is a one-to-many relation
    }
    addCourseOfferingAsPrimaryTeacher(teacherId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(Teacher, "asPrimaryTeacher_CourseOfferings")
        .of(teacherId)
        .add(courseOfferingId);
    }
    removeCourseOfferingAsPrimaryTeacher(teacherId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(Teacher, "asPrimaryTeacher_CourseOfferings")
        .of(teacherId)
        .remove(courseOfferingId);
    }
    addCourseOfferingAsAdditionalTeacher(teacherId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(Teacher, "asAdditionalTeacher_courseOfferings")
        .of(teacherId)
        .add(courseOfferingId);
    }
    removeCourseOfferingAsAdditionalTeacher(teacherId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(Teacher, "asAdditionalTeacher_courseOfferings")
        .of(teacherId)
        .remove(courseOfferingId);
    }

    //Use the select query builder to create selections as required by the business case
    //See https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md

    //Below is to find an teacher and return the teacher object with courseofferings as primary teacher embedded
    findByTeacherId_LeftJoinAndSelect_AsPrimaryTeacher_CourseOfferings(teacherId: number){
        return this.createQueryBuilder("teacher")
        .leftJoinAndSelect("teacher.asPrimaryTeacher_CourseOfferings", "asPrimaryTeacher_CourseOffering")
        .where("teacher.id = :id", { id: teacherId })
        .getOne();
    }
    //from the above, you will get result like that below. If you don't want the relation embedded 
    //in the returned object, use only .leftJoin
    /*
    {
        id: 1,
        employeeNumber: ...,
        ...
        asPrimaryTeacher_CourseOfferings: [{
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
    findByTeacherId_LeftJoinAndSelect_AsAdditionalTeacher_CourseOfferings(teacherId: number){
        return this.createQueryBuilder("teacher")
        .leftJoinAndSelect("teacher.asAdditionalTeacher_courseOfferings", "asAdditionalTeacher_courseOffering")
        .where("teacher.id = :id", { id: teacherId })
        .getOne();
    }
    //from the above, you will get result like
    /*
    {
        id: 1,
        employeeNumber: ...,
        ...
        asAdditionalTeacher_courseOfferings: [{
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
   //Get a teacher along with his user info
   findByTeacherId_LeftJoinAndSelectUser(teacherId: number){
       return this.createQueryBuilder("teacher")
       .leftJoinAndSelect("teacher.user", "user")
       .where ("teacher.id = :teacherId",{teacherId: teacherId} )
       .getOne();
   }
   //above will return a teach object that has the equivalent user object embedded for quick reference.

   //find orphan teachers. Anomally
   findTeachersWithNoUserIndentity(){
       return this.createQueryBuilder("teacher")
       .innerJoin("teacher.user","user")
       .where ("user.id = :userId",{userId: null})
       .getMany();
    }

    //find teacher and return full teacher object with the different relations joined embedded whether empty or not.
    findByTeacherId_LeftJoinAndSelectAll(teacherId: number){
        return this.createQueryBuilder("teacher")
        .leftJoinAndSelect("teacher.user", "user")
        .leftJoinAndSelect("teacher.asPrimaryTeacher_CourseOfferings", "asPrimaryTeacher_CourseOffering")
        .leftJoinAndSelect("teacher.asAdditionalTeacher_courseOfferings", "asAdditionalTeacher_courseOffering")
        .where ("teacher.id = :teacherId", {teacherId: teacherId})
        .getOne();
    }
}