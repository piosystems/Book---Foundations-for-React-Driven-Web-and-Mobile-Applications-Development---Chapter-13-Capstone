/*
This entity is for indicating the courses available for enrollment during a given peroid.
It contains the academic session in which it is taken, the semester, etc.
It is related to teachers, admins, HOD at the period of offering.
*/
import { Entity, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { AuditColumn } from "./AuditColumn";
import { Course } from "./Course";
import { User } from "./User";
import { Teacher } from "./Teacher";

import {TERM_OR_SEMESTER} from '../../settings'
import { AcademicSession } from "./AcademicSession";
import { CourseOfferingEnrollment } from "./CourseOfferingEnrollment";
import { CourseAdmin } from "./CourseAdmin";
import { ProgramCourseOffering } from "./ProgramCourseOffering";
import { IsDefined } from "class-validator";

@Entity()
export class CourseOffering extends AuditColumn{

    @Column({nullable: true})
    name: string;//an option that is useful for differenting because course offerings involving same course

    //In which academic session if tied, is this course offering?
    //There are many course offerings in each academic session. Hence the many-to-one
    @ManyToOne(() => AcademicSession, academicSession => academicSession.courseOfferings, {nullable: true})
    academicSession: AcademicSession;

    @Column({type: 'enum', enum: TERM_OR_SEMESTER, nullable: true})
    term_or_semester: TERM_OR_SEMESTER;//1, 2 etc if school uses terms for example

    @Column()
    @IsDefined()
    startDate: Date;

    @Column({nullable: true})
    endDate: Date;

    @Column({nullable: true, default: false})
    isTermOrSemesterIndependent: boolean; //is this course offering independent of semester calendar?

    @Column({nullable: true, default: true})
    isActive: boolean; //is this course offering still active?

    //a Many-to-one relationship between CourseOffering and Course. This is for getting details about the course being offered
    //Answers the question, what is the course being offerred in this course offering?
    @ManyToOne(() => Course, course => course.courseOfferings, {eager: true})
    course: Course;

    //Who is the primary teacher for this course offering?
    /*
    @OneToOne(type => Teacher, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key to teacher, named here primaryTeacher.
    primaryTeacher: Teacher;
    */
    //many course offerings to a teacher as primary teacher.
    @ManyToOne(() => Teacher, teacher => teacher.asPrimaryTeacher_CourseOfferings, {nullable: true, eager: true})
    primaryTeacher: Teacher;

    //Who is the primary course admin for this course offerred?
    /*
    @OneToOne(() => User, {nullable: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the foreign key to teacher, named here primaryCourseAdmin.
    primaryCourseAdmin: User;
    */
    //many course offerings to a course admin as primary admin.
    @ManyToOne(() => CourseAdmin, courseAdmin => courseAdmin.asPrimaryCourseAdmin_CourseOfferings, {nullable: true, eager: true})
    primaryCourseAdmin: CourseAdmin;

    //assign course offering to additional teachers?
    @ManyToMany(() => Teacher, {nullable: true, eager: true})
    @JoinTable()
    additionalTeachers: Teacher[];

    //assign course offering to additional admins?
    @ManyToMany(() => CourseAdmin, {nullable: true, eager: true})
    @JoinTable()
    additionalCourseAdmins: CourseAdmin[];

    //Who was the departmental HOD during course offering?
    @OneToOne(() => User, {nullable: true, eager: true})
    @JoinColumn()//JoinColumn must be set only on one side. The side will contain the user id of current department HOD when the course was offerred.
    departmentHOD: User;//HOD when the course was offered.

    //What are the enrollments for this course offering
    //Make this lazy so that the enrollments are not loaded immediately, each time Course offerings is called
    //See https://typeorm.io/#/eager-and-lazy-relations for how lazy is implemented
    @OneToMany(() => CourseOfferingEnrollment, courseOfferingEnrollment => courseOfferingEnrollment.courseOffering)
    courseOfferingEnrollments: Promise<CourseOfferingEnrollment[]>;

    //relation with the program course offerings if any. From here we can know which programs are associated with a given courseOffering
    //lazy
    @OneToMany(() => ProgramCourseOffering, programCourseOffering => programCourseOffering.courseOffering, {nullable: true})
    programCourseOfferings: Promise<ProgramCourseOffering[]>;
    
}
