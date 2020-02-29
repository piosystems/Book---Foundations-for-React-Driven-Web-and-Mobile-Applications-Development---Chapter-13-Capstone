//Data mapper for CoureRepository entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {Course} from "../entity/Course";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertCourses(courses: Course[]){//courses is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Course)
        .values(courses)
        .execute();
    }
    //update using query builder. Also more efficient
    updateCourse(courseId: number, editedCourseData: Course){
        return this.createQueryBuilder()
        .update(Course)
        .set(editedCourseData)
        .where("id = :id", { id: courseId })
        .execute();
    }
    deleteCourse(courseId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Course)
        .where("id = :id", { id: courseId })
        .execute();
    }
    //finders   
    findByCode(code: string) {
        return this.createQueryBuilder("course")
        .where("course.code = :code", { code })
        .getOne();//code is set as unique. Otherwise, getMany()
    }
    //Create datamappers for relations
    setDepartment(courseId: number, departmentId: number){
        return this.createQueryBuilder()
        .relation(Course, "department")
        .of(courseId)
        .set(departmentId) //Using set because it is a many-to-one relation
    }
    unsetDepartment(courseId: number){
        return this.createQueryBuilder()
        .relation(Course, "department")
        .of(courseId)
        .set(null) //Using set because it is a many-to-one relation
    }
    
    //More finders
    //find course by id and return it with the owning department
    findByCourseId_LeftJoinDepartment(courseId: number){
        return this.createQueryBuilder()
        .leftJoinAndSelect("course.department", "department")
        .where("course.id = :courseId", {courseId: courseId})
        .getOne();
    }

}