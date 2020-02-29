//Data mapper for ProgramCourseOffering entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {ProgramCourseOffering} from "../entity/ProgramCourseOffering";
import { TERM_OR_SEMESTER } from "../../settings";

@EntityRepository(ProgramCourseOffering)
export class ProgramCourseOfferingRepository extends Repository<ProgramCourseOffering> {
    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertProgramCourseOfferings(programCourseOfferings: ProgramCourseOffering[]){//programCourseOfferings is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(ProgramCourseOffering)
        .values(programCourseOfferings)
        .execute();
    }
    //update using query builder. Also more efficient
    updateProgramCourseOffering(programCourseOfferingId: number, editedProgramCourseOfferingData: ProgramCourseOffering){
        return this.createQueryBuilder()
        .update(ProgramCourseOffering)
        .set(editedProgramCourseOfferingData)
        .where("id = :id", { id: programCourseOfferingId })
        .execute();
    }
    deleteProgramCourseOffering(programCourseOfferingId: number){
        return this.createQueryBuilder()
        .delete()
        .from(ProgramCourseOffering)
        .where("id = :id", { id: programCourseOfferingId })
        .execute();
    }
    //Create datamappers for relations
    setProgram(programCourseOfferingId: number, programId: number){
        return this.createQueryBuilder()
        .relation(ProgramCourseOffering, "program")
        .of(programCourseOfferingId)
        .set(programId) //Using set because it is a many-to-one relation
    }
    unsetProgram(programCourseOfferingId: number){
        return this.createQueryBuilder()
        .relation(ProgramCourseOffering, "program")
        .of(programCourseOfferingId)
        .set(null) //Using set because it is a many-to-one relation
    }
    setCourseOffering(programCourseOfferingId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(ProgramCourseOffering, "courseOffering")
        .of(programCourseOfferingId)
        .set(courseOfferingId) //Using set because it is a many-to-one relation
    }
    unsetCourseOffering(programCourseOfferingId: number){
        return this.createQueryBuilder()
        .relation(ProgramCourseOffering, "courseOffering")
        .of(programCourseOfferingId)
        .set(null) //Using set because it is a many-to-one relation
    }

    //finders

    //find by Program and Course Offering. Below will return programCourseOffering object for the programId and courseOfferingId provided
    findByProgramId_CourseOfferingId(programId: number, courseOfferingId: number) {
        return this.createQueryBuilder("programCourseOffering")
        .innerJoin("programCourseOffering.program", "program", "program.id = :programId", { programId: programId })
        .innerJoin("programCourseOffering.courseOffering", "courseOffering", "courseOffering.id = :courseOfferingId", {courseOfferingId: courseOfferingId})
        .getOne(); //Both ids are primary keys
    }
    //Below is useful for info on registration for a given program, academic session and semester
    //It will return ProgramCourseOffering along with program and courseOffering only for a given 
    //program id, courseOffering id, courseOffering academicSession id and active state which defaults to true.
    findByProgramId_AcademicSessionId_Semester_CourseOfferingIsActive(programId: number, academicSessionId: number, semester: TERM_OR_SEMESTER, courseOfferingActive:boolean = true) {
        return this.createQueryBuilder("programCourseOffering")
        .innerJoinAndSelect("programCourseOffering.program", "program", "program.id = :programId", { programId: programId })
        .innerJoinAndSelect("programCourseOffering.courseOffering", "courseOffering", "courseOffering.semester = :semester", {semester: semester})//Note that the entity CourseOffering has some eager relationships
        .where("courseOffering.academicSession = :academicSessionId", {academicSessionId: academicSessionId})
        .andWhere("courseOffering.isActive = :isActive", {isActive: courseOfferingActive})
        .getMany();
    }

    //Below will return ProgramCourseOffering for a given programId only. It will not embedd the program
    findByProgramId(programId:number){
        return this.createQueryBuilder("programCourseOffering")
        .innerJoin("programCourseOffering.program","program", "program.id = :programId",{programId: programId})
        .getMany();
    }

    findByCourseOfferingId(courseOfferingId: number){
        return this.createQueryBuilder("programCourseOffering")
        .innerJoin("programCourseOffering.courseOffering","courseOffering", "courseOfferingId.id = :courseOfferingId",{courseOfferingId: courseOfferingId})
        .getMany();
    }

}