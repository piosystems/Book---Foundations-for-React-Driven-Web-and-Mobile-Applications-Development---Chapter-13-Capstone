/**
 * Program Course Offerings is useful as a course enrollment guide for students in a give Program.
 * This is a kind of many-to-many relationship between Program and CourseOffering
 * Since it has additional fields, we need to implement it using many-to-one for ProgramCourse to Program
 * and another many-to-one for ProgramCourse to CourseOffering.
 * Both fields need to be set as primary key
 */
//This should relate programs, levels to courses as a guide to Course enrollment.
//This is a kind of custom many-to-many for guiding course enrollment.
//Todo: investigate where many-to-many between Program and CourseOffering will allow additional field of level


import { Entity, Column, ManyToOne } from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { Level, TERM_OR_SEMESTER } from "../../settings";
import { Program } from "./Program";
import { CourseOffering } from "./CourseOffering";
import { IsDefined } from "class-validator";

@Entity()
export class ProgramCourseOffering extends AuditColumn{

    //Which programs are associated with this ProgramCourseOffering?
    @ManyToOne(() => Program, program => program.programCourseOfferings, { primary: true })
    program: Program;

    //Which courseOfferings are associated with this ProgramCourseOffering?
    @ManyToOne(() => CourseOffering, courseOffering => courseOffering.programCourseOfferings, { primary: true })
    courseOffering: CourseOffering;
    
    //Notice that the two above are set as primary key because there should be no repeat of the combination.

    @Column({type: "enum", enum: Level})
    @IsDefined()
    level: Level;

    @Column({type: "enum", enum: TERM_OR_SEMESTER})
    @IsDefined()
    termOrSemester: TERM_OR_SEMESTER;

    @Column()
    @IsDefined()
    isCompulsory: boolean;

    @Column()
    @IsDefined()
    isRequired: boolean;

    @Column()
    @IsDefined()
    isElective: boolean;

}

