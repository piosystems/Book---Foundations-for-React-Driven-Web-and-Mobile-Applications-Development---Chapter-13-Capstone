//Data mapper for Program entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import { Program } from "../entity/Program";

@EntityRepository(Program)
export class ProgramRepository extends Repository<Program> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertPrograms(programs: Program[]){//programs is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Program)
        .values(programs)
        .execute();
    }
    //update using query builder. Also more efficient
    updateProgram(programId: number, editedProgramData: Program){
        return this.createQueryBuilder()
        .update(Program)
        .set(editedProgramData)
        .where("id = :id", { id: programId })
        .execute();
    }
    deleteProgram(programId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Program)
        .where("id = :id", { id: programId })
        .execute();
    }

    setDepartment(programId: number, departmentId: number){
        return this.createQueryBuilder()
        .relation(Program, "department")
        .of(programId)
        .set(departmentId)
    }
    unsetDepartment(programId: number){
        return this.createQueryBuilder()
        .relation(Program, "department")
        .of(programId)
        .set(null)
    }
    addStudent(programId: number, studentId: number){
        return this.createQueryBuilder()
        .relation(Program, "students")
        .of(programId)
        .add(studentId)
    }
    removeStudent(programId: number, studentId: number){
        return this.createQueryBuilder()
        .relation(Program, "students")
        .of(programId)
        .remove(studentId)
    }
    addProgramCourseOffering(programId: number, programCourseOfferingId: number){
        return this.createQueryBuilder()
        .relation(Program, "programCourseOfferings")
        .of(programId)
        .add(programCourseOfferingId)
    }
    removeProgramCourseOffering(programId: number, programCourseOfferingId: number){
        return this.createQueryBuilder()
        .relation(Program, "programCourseOfferings")
        .of(programId)
        .remove(programCourseOfferingId)
    }
    
    //finders
    findByCode(code: string) {
        return this.createQueryBuilder("program")
        .where("program.code = :code", { code })
        .getOne();//Code is set as unique
    }

    findByDepartmentId(departmentId: number) {
        return this.createQueryBuilder("program")
        .innerJoin("program.department", "department")//only return programs that have department. Hence inner join 
        .where("department.id = :departmentId", { departmentId: departmentId })
        .getMany();//many programs belong to one department
    }
    findByStudentId(studentId: number) {
        return this.createQueryBuilder("program")
        .innerJoin("program.students", "student")//only return program that have students
        .where("student.id = :studentId", {studentId: studentId})
        .getOne(); //a student belongs to one program
    }
    //find programId and return object with students embedded. Using leftJoin will ensure that program is returned even if students are not found for the program
    findByProgramId_LeftJoinAndSelectStudents(programId: number) {
        return this.createQueryBuilder("program")
        .leftJoinAndSelect("program.students", "student")
        .where("program.id = :programId", {programId: programId})
        .getOne(); 
    }

}