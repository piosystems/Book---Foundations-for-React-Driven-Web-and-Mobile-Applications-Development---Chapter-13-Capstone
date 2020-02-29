/**
 * This maintains a list of programs by the institution.
 * Columns are degree, title, owningDepartment, numberOfLevel, entryRequirements, etc.
 * This should guide admissions and programCourse setup
 */

import {Entity, Column, ManyToOne, OneToMany} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { Department } from "./Department";
import { Student } from "./Student";

import { QualificationInView } from "../../settings";
import { ProgramCourseOffering } from "./ProgramCourseOffering";
import { IsDefined } from "class-validator";

@Entity()
export class Program extends AuditColumn{

    @Column({unique: true})
    @IsDefined()
    code: string; //e.g. ISMS

    @Column()
    @IsDefined()
    title: string; //e.g. BSC Information Science and Media Studies

    @Column()
    description: string;

    @Column({type: "enum", enum: QualificationInView})
    @IsDefined()
    qualificationInView: QualificationInView;

    @Column({nullable: true})
    noOfAcademicYears: number;//applies only to degree and diploma

    @Column({nullable: true})
    durationInDays: number;//for certificate programmes

    @Column({nullable: true})
    expectedEntryQualification: string;//a general statement on entry qualification

    //Answers the question, which programs belong to a department?
    //Many programs belong to a department
    @ManyToOne(() => Department, department => department.programs)
    department: Department; //notice the singular department variable here as conventional

    //one program of study has many students
    //lazy relationship
    @OneToMany(() => Student, student => student.programOfStudy)
    students: Promise<Student[]>;

    @Column({default: true})
    isActive: boolean;

    //relation with the program course offerings if any. From here we can know which courseOfferings are associated with a give program
    //lazy
    @OneToMany(() => ProgramCourseOffering, programCourseOffering => programCourseOffering.program, {nullable: true})
    programCourseOfferings: Promise<ProgramCourseOffering[]>;
    
}
