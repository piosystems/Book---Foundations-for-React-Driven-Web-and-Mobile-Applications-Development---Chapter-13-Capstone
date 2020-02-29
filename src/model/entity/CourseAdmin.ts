import { Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { User } from "./User";
import { AuditColumn } from "./AuditColumn";

import { EmploymentStatus } from "../../settings";
import { CourseOffering } from "./CourseOffering";

@Entity()
export class CourseAdmin extends AuditColumn{

    @Column({nullable: true})
    employeeNumber: string;

    @Column({type: 'enum', enum: EmploymentStatus, default: EmploymentStatus.FULLTIME_REGULAR})
    employmentStatus: EmploymentStatus;

    @Column({default: true})
    isActive: boolean;

    @Column({ type: 'simple-json', nullable: true })
    courseAdminProfile: {citation: string, personalSiteURL: string};

    //Below is a one-to-one relation between User and Course Admin. 
    //See https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    @OneToOne(() => User)
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key named here userId by default syntax
    user: User;

    //lazy relationship with course offerings as primary admin
    //an admin can have multiple course offerings as primary admin.
    @OneToMany(() => CourseOffering, courseOffering => courseOffering.primaryCourseAdmin)
    asPrimaryCourseAdmin_CourseOfferings: Promise<CourseOffering[]>;

    //set up lazy relationship with course offering as an additional courseAdmin
    @ManyToMany(() => CourseOffering, {nullable: true})
    asAdditionalCourseAdmin_CourseOfferings: Promise<CourseOffering[]>;
    
}
