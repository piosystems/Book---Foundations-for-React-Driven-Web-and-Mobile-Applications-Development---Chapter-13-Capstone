/*This entity contains base entry for courses available in the institution
It is related to Department on a Many-to-one basis. That is, many courses can belong
to one department and conversely, one department can have many courses.
Implication: a course cannot belong to more than one department.
See 
*/
import {Entity, Column, ManyToOne, OneToMany} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { Department } from "./Department";
import { IsDefined } from "class-validator";
import { CourseOffering } from "./CourseOffering";

@Entity()
export class Course extends AuditColumn{

    @Column({unique: true})
    @IsDefined()
    code: string;

    @Column()
    @IsDefined()
    title: string;

    @Column()
    description: string;

    @Column()
    @IsDefined()
    creditUnits: number;

    @Column({type: "simple-array", nullable: true})
    recommendedPrerequiteCourses: number[]; //capture courseId's recommended as prerequisites.

    //Answers the question, which department owns this course?
    @ManyToOne(() => Department, department => department.courses)
    department: Department; //notice the singular department variable here as conventional

    //Answers the question, how and when has the course been offered?
    @OneToMany(() => CourseOffering, courseOffering => courseOffering.course)
    courseOfferings: Promise<CourseOffering[]>//lazy, hence Promise

}