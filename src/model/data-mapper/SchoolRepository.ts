//Data mapper for School entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {School} from "../entity/School";

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertSchools(schools: School[]){//schools is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(School)
        .values(schools)
        .execute();
    }
    //update using query builder. Also more efficient
    updateSchool(schoolId: number, editedSchoolData: School){
        return this.createQueryBuilder()
        .update(School)
        .set(editedSchoolData)
        .where("id = :id", { id: schoolId })
        .execute();
    }
    deleteSchool(schoolId: number){
        return this.createQueryBuilder()
        .delete()
        .from(School)
        .where("id = :id", { id: schoolId })
        .execute();
    }

    //finders
    findByName(name: string) {
        return this.createQueryBuilder("school")
            .where("school.name = :name", { name })
            .getOne();//name is set as unique
    }
    //Create datamappers for relations
    setCurrentDean(schoolId: number, userId: number){
        return this.createQueryBuilder()
        .relation(School, "currentDean")
        .of(schoolId)
        .set(userId) //Using set because it is a one-to-one relation
    }
    unsetCurrentDean(schoolId: number){
        return this.createQueryBuilder()
        .relation(School, "currentHeadOfDepartment")
        .of(schoolId)
        .set(null) //Using set because it is a one-to-one relation
    }
    setCurrentDeputyDean(schoolId: number, userId: number){
        return this.createQueryBuilder()
        .relation(School, "currentDeputyDean")
        .of(schoolId)
        .set(userId) //Using set because it is a one-to-one relation
    }
    unsetCurrentDeputyDean(schoolId: number){
        return this.createQueryBuilder()
        .relation(School, "currentDeputyDean")
        .of(schoolId)
        .set(null) //Using set because it is a one-to-one relation
    }
    setCurrentSecretaryOfSchool(schoolId: number, userId: number){
        return this.createQueryBuilder()
        .relation(School, "currentSecretaryOfSchool")
        .of(schoolId)
        .set(userId) //Using set because it is a one-to-one relation
    }
    unsetCurrentSecretaryOfSchool(schoolId: number){
        return this.createQueryBuilder()
        .relation(School, "currentSecretaryOfSchool")
        .of(schoolId)
        .set(null) //Using set because it is a one-to-one relation
    }
    addDepartment(schoolId: number, departmentId: number){
        return this.createQueryBuilder()
        .relation(School, "departments")
        .of(schoolId)
        .add(departmentId) //Using add because it is a one-to-many relation
    }
    removeDepartment(schoolId: number, departmentId: number){
        return this.createQueryBuilder()
        .relation(School, "departments")
        .of(schoolId)
        .remove(departmentId) //Using remove because it is a one-to-many relation
    }
    //More finders
    //Get school along with the departments
    findBySchoolId_LeftJoinAndSelectDepartments(schoolId: number){
        return this.createQueryBuilder("school")
        .leftJoinAndSelect("school.departments", "department")
        .where("school.id = :schoolId", {schoolId: schoolId})
        .getOne();
    }

    //Get school along with all relations except departments
    findBySchoolId_LeftJoinAndSelectAllRelationsExceptDepartment(schoolId: number){
        return this.createQueryBuilder("school")
        .leftJoinAndSelect("school.currentDean", "currentDean")
        .leftJoinAndSelect("school.currentDeputyDean", "currentDeputyDean")
        .leftJoinAndSelect("school.currentSecretaryOfSchool","currentSecretaryOfSchool")
        .where("school.id = :schoolId", {schoolId: schoolId})
        .getOne();
    }
    //Get school along with all relations objects embedded
    findBySchoolId_LeftJoinAndSelectAllRelations(schoolId: number){
        return this.createQueryBuilder("school")
        .leftJoinAndSelect("school.currentDean", "currentDean")
        .leftJoinAndSelect("school.currentDeputyDean", "currentDeputyDean")
        .leftJoinAndSelect("school.currentSecretaryOfSchool","currentSecretaryOfSchool")
        .leftJoinAndSelect("school.departments", "department")
        .where("school.id = :schoolId", {schoolId: schoolId})
        .getOne();
    }

    
}