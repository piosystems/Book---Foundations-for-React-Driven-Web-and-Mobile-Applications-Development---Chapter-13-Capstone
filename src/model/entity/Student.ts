/**
 * The base student registry. The student is related to program which is related to department.
 * A student also has course enrollments lazily related so that they are not loaded each time a student data is gotten.
 * Relationship with mentoring can be built. [To be done]
 */
import { Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "./User";
import { AuditColumn } from "./AuditColumn";
import { CourseOfferingEnrollment } from "./CourseOfferingEnrollment";
import { Program } from "./Program";

import { Level } from "../../settings";

@Entity()
export class Student extends AuditColumn{

    @Column({ nullable: true })
    admissionNumber: string;

    @Column({ nullable: true })
    matriculationNumber: string;

    //many students have the same program of study
    @ManyToOne(() => Program, program => program.students)
    programOfStudy: Program;

    @Column({ nullable: true })
    yearOfEntry: number;

    @Column({type: 'enum', enum: Level, default: Level.NOT_SPECIFIED})
    entryLevel: Level;

    @Column({type: 'enum', enum: Level, default: Level.NOT_SPECIFIED})
    currentLevel: Level;

    @Column({ type: 'simple-array', nullable: true })
    entryQualifications: string[];

    @Column({ type: 'simple-array', nullable: true })
    schoolsAttended: string[];

    @Column({default: false})
    graduated: boolean;

    //Below is a one-to-one relation between User and Student. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User)
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    user: User;

    //Below is for one student to many courseOfferredEnrollment records.
    //Answers the question, what are the enrollments for this student
    //lazy
    @OneToMany(() => CourseOfferingEnrollment, courseOfferingEnrollment => courseOfferingEnrollment.student)
    courseOfferingEnrollments: Promise<CourseOfferingEnrollment[]>; //notice the plural courseOfferingEnrollments here.
}
