/**
 * FAQ has a many to one relationship with FAQCategory
 */
import {Entity, Column, OneToMany, ManyToOne} from "typeorm";
import { AuditColumn } from "./AuditColumn";
import {FAQCategory} from './FAQCategory';

@Entity()//You can change the table name
export class FAQ extends AuditColumn{//AuditColumns abstract class contains fields for audit info common to all tables

    @Column()//setting primary to true here means that this is unique
    question: string;

    @Column()
    answer: string;

    //relationship with category
    @ManyToOne(() => FAQCategory, fAQCategory => fAQCategory.fAQs, {nullable: true, eager: true})
    fAQCategory: FAQCategory;

    //lazy relationship with self
    @OneToMany(() => FAQ, fAQ => fAQ.relatedFAQs, {nullable: true})
    relatedFAQs: Promise<FAQ[]>;
}