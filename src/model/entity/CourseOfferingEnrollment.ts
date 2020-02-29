/**
 * This is for capturing student enrollments for course offerings
 * Technically, this is a kind of many to many relationship between student and course offering
 * that has other fields added.
 * Such is implemented using the many-to-one for both student and course offering as shown below
 */
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { Student } from "./Student";
import { Grade } from "./Grade";
import { CourseOffering } from "./CourseOffering";

@Entity()
export class CourseOfferingEnrollment extends AuditColumn{

    //a many-to-one relationship between enrollment and CourseOffering
    //Answers the question, what is the course offering enrolled?
    @ManyToOne(() => CourseOffering, courseOffering => courseOffering.courseOfferingEnrollments)
    courseOffering: CourseOffering;

    //Below is for many course offering Enrollments to one student
    //Many course offering Enrollments belong to one student. And a student has many grades
    //Answers the question, what are the enrollments for this student?
    @ManyToOne(() => Student, student => student.courseOfferingEnrollments)
    student: Student; //notice the singular student variable here as conventional

    @Column({default: false})//set to true when grading is complete.
    gradingComplete: boolean //score finalization process sets this and the three denomalized fields below

    @Column({type: "jsonb", nullable: true})
    scoreBreakDown: Object //denomalized for  query efficiency. Flexible name:value pairs of caterory:score

    @Column({type: "jsonb", nullable: true})
    maxScorableBreakDown: Object //denomalized for  query efficiency. Flexible name:value pairs of category:maxScorable

    @Column({type: "simple-json", nullable: true})
    totalScore: {score: number, maxScorable: number} //denomalized for  query efficiency. Flexible name:value pairs of category:maxScorable
    
    //one course offering enrollment to many grades
    @OneToMany(() => Grade, grade => grade.courseOfferingEnrollment)
    grades: Grade[];
}