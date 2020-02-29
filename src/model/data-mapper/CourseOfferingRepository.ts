//Data mapper for CourseOffering entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import { CourseOffering } from "../entity/CourseOffering";

@EntityRepository(CourseOffering)
export class CourseOfferingRepository extends Repository<CourseOffering> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertCourseOfferings(courseOfferings: CourseOffering[]){// is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(CourseOffering)
        .values(courseOfferings)
        .execute();
    }
    //update using query builder. Also more efficient
    updateCourseOffering(courseOfferingId: number, editedCourseOfferingData: CourseOffering){
        return this.createQueryBuilder()
        .update(CourseOffering)
        .set(editedCourseOfferingData)
        .where("id = :id", { id: courseOfferingId })
        .execute();
    }
    deleteCourseOffering(courseOfferingId: number){
        return this.createQueryBuilder()
        .delete()
        .from(CourseOffering)
        .where("id = :id", { id: courseOfferingId })
        .execute();
    }
    //Set related data
    setAcademicSession(courseOfferingId: number, academicSessionId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "academicSession")
        .of(courseOfferingId)
        .set(academicSessionId)
    }
    unsetAcademicSession(courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "academicSession")
        .of(courseOfferingId)
        .set(null)
    }
    setCourse(courseOfferingId: number, courseId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "course")
        .of(courseOfferingId)
        .set(courseId)
    }
    unsetCourse(courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "course")
        .of(courseOfferingId)
        .set(null)
    }
    setPrimaryTeacher(courseOfferingId: number, primaryTeacherId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "primaryTeacher")
        .of(courseOfferingId)
        .set(primaryTeacherId)
    }
    unsetPrimaryTeacher(courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "primaryTeacher")
        .of(courseOfferingId)
        .set(null)
    }
    setPrimaryCourseAdmin(courseOfferingId: number, primaryCourseAdminId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "primaryCourseAdmin")
        .of(courseOfferingId)
        .set(primaryCourseAdminId)
    }
    unsetPrimaryCourseAdmin(courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "primaryCourseAdmin")
        .of(courseOfferingId)
        .set(null)
    }
    setDepartmentHOD(courseOfferingId: number, departmentHODUserId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "departmentHOD")
        .of(courseOfferingId)
        .set(departmentHODUserId)
    }
    unsetDepartmentHOD(courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "departmentHOD")
        .of(courseOfferingId)
        .set(null)
    }
    addAdditionalTeacher(courseOfferingId: number, additionalTeacherId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "additionalTeachers")
        .of(courseOfferingId)
        .add(additionalTeacherId)
    }
    removeAdditionalTeacher(courseOfferingId: number, additionalTeacherId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "additionalTeachers")
        .of(courseOfferingId)
        .remove(additionalTeacherId)
    }
    addAdditionalCourseAdmin(courseOfferingId: number, additionalCourseAdminId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "additionalCourseAdmins")
        .of(courseOfferingId)
        .add(additionalCourseAdminId)
    }
    removeAdditionalCourseAdmin(courseOfferingId: number, additionalCourseAdminId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "additionalCourseAdmins")
        .of(courseOfferingId)
        .remove(additionalCourseAdminId)
    }
    addCourseOfferingEnrollment(courseOfferingId: number, courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "courseOfferingEnrollments")
        .of(courseOfferingId)
        .add(courseOfferingEnrollmentId)
    }
    removeCourseOfferingEnrollment(courseOfferingId: number, courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "courseOfferingEnrollments")
        .of(courseOfferingId)
        .remove(courseOfferingEnrollmentId)
    }
    addProgramCourseOffering(courseOfferingId: number, programCourseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "programCourseOfferings")
        .of(courseOfferingId)
        .add(programCourseOfferingId)
    }
    removeProgramCourseOffering(courseOfferingId: number, programCourseOfferingId: number){
        return this.createQueryBuilder()
        .relation(CourseOffering, "programCourseOfferings")
        .of(courseOfferingId)
        .remove(programCourseOfferingId)
    }

    //finders
    findByIsActiveAndAcademicSessionIdAndCourseId_LeftJoinAndSelectAcademicSessionAndCourse(isActive: boolean, academicSessionId: number, courseId: number){
        return this.createQueryBuilder("courseOffering")
        .innerJoinAndSelect("courseOffering.academicSession", "academicSession", "academicSession.id = :academicSessionId",{academicSessionId: academicSessionId})
        .innerJoinAndSelect("courseOffering.course", "course", "course.id = :courseId", {courseId: courseId})
        .where("courseOffering.isActive = :isActive", {isActive: isActive})
        .getMany();
    }
    findByCourseOfferingId_LeftJoinAndSelectCourseOfferingEnrollments(courseOfferingId: number){
        return this.createQueryBuilder("courseOffering")
        .leftJoinAndSelect("courseOffering.courseOfferingEnrollments", "courseOfferingEnrollment")
        .where("courseOffering.id = :courseOfferingId", {courseOfferingId: courseOfferingId})
        .getOne();
    }

    findByCourseOfferingId_LeftJoinAndSelectProgramCourseOfferings(courseOfferingId: number){
        return this.createQueryBuilder("courseOffering")
        .leftJoinAndSelect("courseOffering.programCourseOfferings", "programCourseOffering")
        .where("courseOffering.id = :courseOfferingId", {courseOfferingId: courseOfferingId})
        .getOne();
    }

}