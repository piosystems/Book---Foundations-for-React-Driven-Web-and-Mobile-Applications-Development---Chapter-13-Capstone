/**
 * Teacher is a special role with respect to learning. Hence this entity is needed.
 * Teacher can be a primary teacher or additional teacher for courseoffering
 */
import { Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { User } from "./User";
import { AuditColumn } from "./AuditColumn";
import { EmploymentStatus } from "../../settings";
import { CourseOffering } from "./CourseOffering";


@Entity()
export class Teacher extends AuditColumn{

    @Column({nullable: true})
    employeeNumber: string;

    @Column({type: 'enum', enum: EmploymentStatus, default: EmploymentStatus.FULLTIME_REGULAR})
    employmentStatus: EmploymentStatus;

    @Column({default: true})
    isActive: boolean;

    @Column({type: 'simple-json', nullable: true })
    teacherProfile: {citation: string, personalSiteURL: string};

    //Below is a one-to-one relation between User and Teacher. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User)
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    user: User;

    //lazy relationship with course offerings as primary teacher
    //a teacher can have multiple course offerings as primary teacher.
    @OneToMany(() => CourseOffering, courseOffering => courseOffering.primaryTeacher)
    asPrimaryTeacher_CourseOfferings: Promise<CourseOffering[]>;

    //set up lazy relationship with course offering as an additional teacher
    @ManyToMany(() => CourseOffering, {nullable: true})
    asAdditionalTeacher_courseOfferings: Promise<CourseOffering[]>;
    
}
