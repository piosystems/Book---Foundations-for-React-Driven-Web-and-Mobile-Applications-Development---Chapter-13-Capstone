//Data mapper for Student entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import {Student} from "../entity/Student";

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertStudents(students: Student[]){//students is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Student)
        .values(students)
        .execute();
    }
    //update using query builder. Also more efficient
    updateStudents(studentId: number, editedStudentData: Student){
        return this.createQueryBuilder()
        .update(Student)
        .set(editedStudentData)
        .where("id = :id", { id: studentId })
        .execute();
    }
    deleteStudent(studentId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Student)
        .where("id = :id", { id: studentId })
        .execute();
    }
    //functions to set/unset add/remove relations values
    setUser(studentId: number, userId: number){
        return this.createQueryBuilder()
        .relation(Student, "user")
        .of(studentId)
        .set(userId); //Using add because it is a one-to-many relation
    }
    unsetUser(studentId: number){
        return this.createQueryBuilder()
        .relation(Student, "user")
        .of(studentId)
        .set(null); //Using add because it is a one-to-many relation
    }
    setProgram(studentId: number, programId: number){
        return this.createQueryBuilder()
        .relation(Student, "programOfStudy")
        .of(studentId)
        .set(programId); //Using add because it is a one-to-many relation
    }
    unsetProgram(studentId: number){
        return this.createQueryBuilder()
        .relation(Student, "programOfStudy")
        .of(studentId)
        .set(null); //Using add because it is a one-to-many relation
    }
    addCourseOfferingEnrollments(studentId: number, courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(Student, "courseOfferingEnrollments")
        .of(studentId)
        .add(courseOfferingEnrollmentId);
    }
    removeCourseOfferingEnrollments(studentId: number, courseOfferingEnrollmentId: number){
        return this.createQueryBuilder()
        .relation(Student, "courseOfferingEnrollments")
        .of(studentId)
        .remove(courseOfferingEnrollmentId);
    }
    //finders
    findByProgramId_LeftJoinAndSelectProgram(programId: number) {
        return this.createQueryBuilder("student")
        .leftJoinAndSelect("student.programOfStudy", "program")
        .where("program.id = :programId", { programId: programId })
        .getMany(); //a program has many students
    }
    //select a student along with his user info
   findByStudentId_LeftJoinAndSelectUser(studentId: number){
       return this.createQueryBuilder("student")
       .leftJoinAndSelect("student.user", "user")
       .where ("student.id = :studentId",{studentId: studentId})
       .getOne();
   }
   //above will return a teach object that has the equivalent user object embedded for quick reference.

   //get a student's enrollments and drill down to grades through courseOfferingEnrollment
   findByStudentId_LeftJoinAndSelectEnrollments(studentId: number){
       return this.createQueryBuilder("student")
       .leftJoinAndSelect("student.courseOfferingEnrollments", "courseOfferingEnrollment")
       .leftJoinAndSelect("courseOfferingEnrollment.grades", "grade")//join grades on courseOfferingEnrollment
       .where("student.id = :studentId", {studentId: studentId})
   }
    //select a student along with his user info
    findByStudentId_LeftJoinAndSelect(studentId: number){
        return this.createQueryBuilder("student")
        .leftJoinAndSelect("student.user", "user")
        .where ("student.id = :studentId",{studentId: studentId})
        .getOne();
    }

    //select a student along with his user info
    findByUserId_LeftJoinAndSelectUser(userId: number){
        return this.createQueryBuilder("student")
        .leftJoinAndSelect("student.user", "user")
        .where ("user.id = :userId",{userId: userId})
        .getOne();
    }

   //find orphan students. Anomally
   findStudentsWithNoUserIndentity(){
       return this.createQueryBuilder("student")
       .innerJoin("student.user","user")
       .where ("user.id = :userId", {userId: null})
       .getMany();
    }

}