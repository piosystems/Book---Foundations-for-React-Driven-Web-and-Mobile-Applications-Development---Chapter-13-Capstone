/** 
This is for holding basic school info. Related to Dean, Sec as users
Also related to courses and programs owned - lazily related.
*/
import {Entity, Column, OneToOne, JoinColumn, OneToMany} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { User } from "./User";
import { IsDefined } from "class-validator";
import { Department } from "./Department";

@Entity()//You can change the table name
export class School extends AuditColumn{//AuditColumns abstract class contains fields for audit info common to all tables

    @Column({unique: true})
    @IsDefined()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({type: "jsonb", nullable: true})
    otherSchoolInfo: Object

    //Below is a one-to-one relation between department and head as user. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    currentDean: User;

    //Below is a one-to-one relation between department and head as user. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    currentDeputyDean: User;

    //Below is a one-to-one relation between department and secretary as user. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    currentSecretaryOfSchool: User;

    //What departments belong to this school if any?
    @OneToMany(() => Department, department => department.school, {nullable: true})
    departments: Promise<Department[]>; //notice the plural courses here used in three places 

}