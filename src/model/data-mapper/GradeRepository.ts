//Data mapper for Grade entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {Grade} from "../entity/Grade";

@EntityRepository(Grade)
export class GradeRepository extends Repository<Grade> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertGrades(grades: Grade[]){//grades is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Grade)
        .values(grades)
        .execute();
    }
    //update using query builder. Also more efficient
    updateGrade(gradeId: number, editedGradeData: Grade){
        return this.createQueryBuilder()
        .update(Grade)
        .set(editedGradeData)
        .where("id = :id", { id: gradeId })
        .execute();
    }
    deleteGrade(gradeId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Grade)
        .where("id = :id", { id: gradeId})
        .execute();
    }

    //Set related data
    setCourseOfferingEnrollment(gradeId: number, courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(Grade, "courseOfferingEnrollment")
        .of(gradeId)
        .set(courseOfferingEnrollmentId)
    }
    unsetCourseOfferingEnrollment(gradeId: number){
        return this.createQueryBuilder()
        .relation(Grade, "courseOfferingEnrollment")
        .of(gradeId)
        .set(null)
    }
    
    //finders
    findByCourseOfferingEnrollmentId_InnerJoinAndSelect(courseOfferingEnrollmentId: number){
        return this.createQueryBuilder("grade")
        .innerJoinAndSelect("grade.courseOfferingEnrollment", "courseOfferingEnrollment", "courseOfferingEnrollment.id = :courseOfferingEnrollmentId",{courseOfferingEnrollmentId: courseOfferingEnrollmentId})
        .getMany();
    }

    findByStudentId(studentId: number){
        return this.createQueryBuilder("grade")
        .innerJoin("grade.courseOfferingEnrollment", "courseOfferingEnrollment")
        .innerJoin("courseOfferingEnrollment.student", "student", "student.id = :studentId", {studentId: studentId})
        .getMany();
    }
}