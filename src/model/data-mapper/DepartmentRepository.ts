//Data mapper for Department entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {Department} from "../entity/Department";


@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {
    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertDepartments(departments: Department[]){//departments is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Department)
        .values(departments)
        .execute();
    }
    //update using query builder. Also more efficient
    updateDepartment(departmentId: number, editedDepartmentData: Department){
        return this.createQueryBuilder()
        .update(Department)
        .set(editedDepartmentData)
        .where("id = :id", { id: departmentId })
        .execute();
    }
    deleteDepartment(departmentId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Department)
        .where("id = :id", { id: departmentId })
        .execute();
    }
    //finders
    findByName(name: string) {
        return this.createQueryBuilder("department")
        .where("department.name = :name", { name })
        .getOne();//Name is set as unique
    }
    //Create datamappers for relations
    setCurrentHeadOfDepartment(departmentId: number, userId: number){
        return this.createQueryBuilder()
        .relation(Department, "currentHeadOfDepartment")
        .of(departmentId)
        .set(userId) //Using set because it is a one-to-one relation
    }
    unsetCurrentHeadOfDepartment(departmentId: number){
        return this.createQueryBuilder()
        .relation(Department, "currentHeadOfDepartment")
        .of(departmentId)
        .set(null) //Using set because it is a one-to-one relation
    }
    //Create datamappers for relations
    setCurrentSecretaryOfDepartment(departmentId: number, userId: number){
        return this.createQueryBuilder()
        .relation(Department, "currentSecretaryOfDepartment")
        .of(departmentId)
        .set(userId) //Using set because it is a one-to-one relation
    }
    unsetCurrentSecretaryOfDepartment(departmentId: number){
        return this.createQueryBuilder()
        .relation(Department, "currentSecretaryOfDepartment")
        .of(departmentId)
        .set(null) //Using set because it is a one-to-one relation
    }
    setSchool(departmentId: number, schoolId: number){
        return this.createQueryBuilder()
        .relation(Department, "school")
        .of(departmentId)
        .set(schoolId) //Using set because it is a many-to-one relation
    }
    unsetSchool(departmentId: number){
        return this.createQueryBuilder()
        .relation(Department, "school")
        .of(departmentId)
        .set(null) //Using set because it is a many-to-one relation
    }
    addCourse(departmentId: number, courseId: number){
        return this.createQueryBuilder()
        .relation(Department, "courses")
        .of(departmentId)
        .add(courseId) //Using add because it is a one-to-many relation
    }
    removeCourse(departmentId: number, courseId: number){
        return this.createQueryBuilder()
        .relation(Department, "courses")
        .of(departmentId)
        .remove(courseId) //Using add because it is a one-to-many relation
    }
    addProgram(departmentId: number, programId: number){
        return this.createQueryBuilder()
        .relation(Department, "programs")
        .of(departmentId)
        .add(programId) //Using add because it is a one-to-many relation
    }
    removeProgram(departmentId: number, programId: number){
        return this.createQueryBuilder()
        .relation(Department, "programs")
        .of(departmentId)
        .remove(programId) //Using add because it is a one-to-many relation
    }

    //More finders
    findByDepartmentId_LeftJoinAndSelectAllRelations(departmentId: number){
        return this.createQueryBuilder("department")
        .leftJoinAndSelect("department.currentHeadOfDepartment","currentHeadOfDepartment")
        .leftJoinAndSelect("department.currentSecretaryOfDepartment", "currentSecretaryOfDepartment")
        .leftJoinAndSelect("department.currentSecretaryOfDepartment","currentSecretaryOfDepartment")
        .leftJoinAndSelect("department.school","school")
        .leftJoinAndSelect("department.courses", "course")
        .leftJoinAndSelect("department.programs","program")
        .where("department.id = :departmentId",{departmentId: departmentId})
        .getOne();
    }
    findByDepartmentId_LeftJoinAndSelectAllRelations_ExceptCoursesAndPrograms(departmentId: number){
        return this.createQueryBuilder("department")
        .leftJoinAndSelect("department.currentHeadOfDepartment","currentHeadOfDepartment")
        .leftJoinAndSelect("department.currentSecretaryOfDepartment", "currentSecretaryOfDepartment")
        .leftJoinAndSelect("department.currentSecretaryOfDepartment","currentSecretaryOfDepartment")
        .leftJoinAndSelect("department.school","school")
        .where("department.id = :departmentId",{departmentId: departmentId})
        .getOne();
    }
    findByDepartmentId_LeftJoinAndSelectPrograms(departmentId: number){
        return this.createQueryBuilder("department")
        .leftJoinAndSelect("department.programs","program")
        .where("department.id = :departmentId",{departmentId: departmentId})
        .getOne();
    }
    findByDepartmentId_LeftJoinAndSelectCourses(departmentId: number){
        return this.createQueryBuilder("department")
        .leftJoinAndSelect("department.courses","course")
        .where("department.id = :departmentId",{departmentId: departmentId})
        .getOne();
    }

}