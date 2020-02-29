/**
 * This is a registry for academic sessions. It has a one-to-many relationship with course offering
 */
import {Entity, Column, OneToMany} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { CourseOffering } from "./CourseOffering";
import { IsDefined, IsDate } from "class-validator";

@Entity()//You can change the table name
export class AcademicSession extends AuditColumn{//AuditColumns abstract class contains fields for audit info common to all tables

    @Column({unique: true})
    @IsDefined()
    title: string;//e.g. '2018/2019'

    @Column()
    @IsDefined()
    @IsDate()
    startDate: Date;

    @Column()
    @IsDefined()
    @IsDate()
    endDate: Date;

    @Column({nullable: true})
    notes: string;//anything worth noting about the academic session

    @Column({default: false})
    isCurrent: boolean;//is it the current session. Role over process should set this.

    //Let us make Academic session to have a lazy relationship with courseOfferings.
    //Notice the use of Promise<> to achieve this.
    //In this way, courses are not loaded each time AcademicSession is loaded.
    //See https://typeorm.io/#/eager-and-lazy-relations for how to process such relations
    @OneToMany(() => CourseOffering, courseOffering => courseOffering.academicSession, {nullable: true})
    courseOfferings: Promise<CourseOffering[]>;
}