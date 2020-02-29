//Data mapper for AcademicSession entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {AcademicSession} from "../entity/AcademicSession";

@EntityRepository(AcademicSession)
export class AcademicSessionRepository extends Repository<AcademicSession> {
    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertAcademicSessions(academicSessions: AcademicSession[]){//academicSessions is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(AcademicSession)
        .values(academicSessions)
        .execute();
    }
    //update using query builder. Also more efficient
    updateAcademicSessions(academicSessionId: number, editedAcademicSessionData: AcademicSession){
        return this.createQueryBuilder()
        .update(AcademicSession)
        .set(editedAcademicSessionData)
        .where("id = :id", { id: academicSessionId })
        .execute();
    }
    deleteAcademicSession(academicSessionId: number){
        return this.createQueryBuilder()
        .delete()
        .from(AcademicSession)
        .where("id = :id", { id: academicSessionId })
        .execute();
    }
    //finders   
    findByTitle(title: string) {
        return this.createQueryBuilder("academicSession")
        .where("academicSession.title = :title", { title })
        .getOne();//title is set as unique in the entity
    }
    addCourseOffering(academicSessionId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(AcademicSession, "courseOfferings")
        .of(academicSessionId)
        .add(courseOfferingId) //Using add because it is a one-to-many relation
    }
    removeCourseOffering(academicSessionId: number, courseOfferingId: number){
        return this.createQueryBuilder()
        .relation(AcademicSession, "courseOfferings")
        .of(academicSessionId)
        .remove(courseOfferingId) //Using remove because it is a one-to-many relation
    }
    //More finders
    //this will return the academic session found along with the course offerings of that session
    findByAcademicSessionId_LeftJoinAndSelectCourseOfferings(academicSessionId: number){
        return this.createQueryBuilder("academicSession")
        .leftJoinAndSelect("academicSession.courseOfferings", "courseOffering")
        .where("academicSession.id = :academicSessionId", {academicSessionId: academicSessionId})
        .getOne();
    }

    findByIsCurrent(isCurrent: boolean){
        return this.createQueryBuilder("academicSession")
        .where("academicSession.isCurrent = :isCurrent", {isCurrent: isCurrent})
        .getMany();
    }
}