//Data mapper for CourseOfferingEnrollment entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import { CourseOfferingEnrollment } from "../entity/CourseOfferingEnrollment";

@EntityRepository(CourseOfferingEnrollment)
export class CourseOfferingEnrollmentRepository extends Repository<CourseOfferingEnrollment> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertCourseOfferingEnrollments(courseOfferingEnrollments: CourseOfferingEnrollment[]){// is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(CourseOfferingEnrollment)
        .values(courseOfferingEnrollments)
        .execute();
    }
    //update using query builder. Also more efficient
    updateCourseOfferingEnrollment(courseOfferingEnrollmentId: number, editedCourseOfferingEnrollmentData: CourseOfferingEnrollment){
        return this.createQueryBuilder()
        .update(CourseOfferingEnrollment)
        .set(editedCourseOfferingEnrollmentData)
        .where("id = :id", { id: courseOfferingEnrollmentId })
        .execute();
    }
    deleteCourseOfferingEnrollment(courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .delete()
        .from(CourseOfferingEnrollment)
        .where("id = :id", { id: courseOfferingEnrollmentId})
        .execute();
    }

    //Set related data
    setCourseOffering(courseOfferingEnrollmentId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOfferingEnrollment, "courseOffering")
        .of(courseOfferingEnrollmentId)
        .set(courseOfferingId)
    }
    unsetCourseOffering(courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(CourseOfferingEnrollment, "courseOffering")
        .of(courseOfferingEnrollmentId)
        .set(null)
    }
    setStudent(courseOfferingEnrollmentId: number, studentId: number){
        return this.createQueryBuilder()
        .relation(CourseOfferingEnrollment, "student")
        .of(courseOfferingEnrollmentId)
        .set(studentId)
    }
    unsetStudent(courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(CourseOfferingEnrollment, "student")
        .of(courseOfferingEnrollmentId)
        .set(null)
    }
    
    addGrade(courseOfferingEnrollmentId: number, gradeId: number){
        return this.createQueryBuilder()
        .relation(CourseOfferingEnrollment, "grades")
        .of(courseOfferingEnrollmentId)
        .add(gradeId)
    }
    removeGrade(courseOfferingEnrollmentId: number, gradeId: number){
        return this.createQueryBuilder()
        .relation(CourseOfferingEnrollment, "grades")
        .of(courseOfferingEnrollmentId)
        .remove(gradeId)
    }

    //finders
    findByCourseOfferingId_LeftJoinAndSelectCourseOffering(courseOfferingId: number){
        return this.createQueryBuilder("courseOfferingEnrollment")
        .leftJoinAndSelect("courseOfferingEnrollment.courseOffering", "courseOffering", "courseOffering.id = :courseOfferingId",{courseOfferingId: courseOfferingId})//same as separating where
        .getMany();
    }
}