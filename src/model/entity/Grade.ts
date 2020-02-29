/**
 * Multiple grade entry for each course enrollment. Each grade entry has a category, score and maximum scorable
 */
import { Entity, Column, ManyToOne } from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { CourseOfferingEnrollment } from "./CourseOfferingEnrollment";

//Possible grade categories to be used in capture score below. May be better read from database
import {GradeCategory} from '../../settings';
import { IsDefined } from "class-validator";

@Entity()
export class Grade extends AuditColumn{

    @Column({type: "simple-json"})//record each score as json in db
    @IsDefined()
    score: {category: GradeCategory, score: number, maxScorable: number}
    
    //many grades belong to one course offering enrollment.
    @ManyToOne(() => CourseOfferingEnrollment, courseOfferingEnrollment => courseOfferingEnrollment.grades)
    courseOfferingEnrollment: CourseOfferingEnrollment;
}