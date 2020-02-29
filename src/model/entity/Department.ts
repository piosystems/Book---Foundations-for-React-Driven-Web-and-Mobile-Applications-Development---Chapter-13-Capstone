/** 
This is for holding basic department info. Related to HOD, Sec as users
Also related to courses and programs owned - lazily related.
*/
import {Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { User } from "./User";
import { Course } from "./Course";
import { Program } from "./Program";
import { School } from "./School";
import { IsDefined } from "class-validator";

@Entity()//You can change the table name
export class Department extends AuditColumn{//AuditColumns abstract class contains fields for audit info common to all tables

    @Column({unique: true})
    @IsDefined()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({type: "jsonb", nullable: true})
    otherDepartmentalInfo: Object

    //Below is a one-to-one relation between department and head as user. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    currentHeadOfDepartment: User;

    //Below is a one-to-one relation between department and secretary as user. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    currentSecretaryOfDepartment: User;

    //Answers the question, which school does this department belong to?
    @ManyToOne(() => School, school => school.departments, {nullable: true})
    school: School; //notice the singular department variable here as conventional

    //What courses belong to this department if any?
    @OneToMany(() => Course, course => course.department, {nullable: true})
    courses: Promise<Course[]>; //notice the plural courses here used in three places

    //What programs belong to this department if any?
    @OneToMany(() => Program, program => program.department, {nullable: true})
    programs: Promise<Program[]>; 

}