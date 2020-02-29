/**
 * Categories of FAQ
 */
import {Entity, Column, OneToMany} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import {FAQ} from './FAQ'
import { IsDefined } from "class-validator";

@Entity()//You can change the table name
export class FAQCategory extends AuditColumn{//AuditColumns abstract class contains fields for audit info common to all tables

    @Column({unique: true})
    @IsDefined()
    name: string;

    //lazy relationship with FAQs
    @OneToMany(() => FAQ, fAQ => fAQ.fAQCategory)
    fAQs: Promise<FAQ[]>;

}