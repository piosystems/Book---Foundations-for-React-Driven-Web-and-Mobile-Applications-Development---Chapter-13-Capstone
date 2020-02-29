import {Entity, Column, ManyToMany, JoinTable} from "typeorm";
import { AuditColumn } from "./AuditColumn";

import { Gender } from "../../settings";
import { Role } from "./Role";

//optionally use class validator (remember to run npm install class-validator)
import {IsDefined, IsEmail, IsDate} from 'class-validator';

@Entity('user_table')//You can change the table name
export class User extends AuditColumn{//AuditColumns abstract class contains fields for audit info common to all tables

    @Column()
    @IsDefined()
    firstName: string;

    @Column({nullable: true})
    middleName: string;

    @Column()
    @IsDefined()
    lastName: string;

    @Column({nullable: true})
    commonName: string;

    @Column({nullable: true})
    homeAddress: string;

    @Column({type: 'enum', enum: Gender})
    @IsDefined()
    gender: Gender;

    @Column({nullable: true})
    @IsDate()//validator
    dateOfBirth: Date;

    @Column({nullable: true})
    Nationality: string;

    @Column({nullable: true})
    stateOfOrigin: string;

    @Column({nullable: true})
    photo: string; //photo id

    @Column({default: true})
    isActive: boolean;

    @Column({unique: true, nullable: false})
    @IsEmail()//validator
    primaryEmailAddress: string;

    @Column({default: false})
    isPrimaryEmailAddressVerified: boolean;

    @Column({nullable: true})
    passwordSalt: string;

    @Column({nullable: true})
    passwordHash: string;

    //set to true if password change is required
    @Column({default: false})
    isPasswordChangeRequired: boolean;

    //token to be generated when password change request is made
    @Column({unique: true, nullable: true})
    resetPasswordToken: string;

    @Column({nullable: true})
    resetPasswordExpiration: Date;

    @Column({nullable: true})
    primaryEmailVerificationToken: string;

    //Incorporating OTP. See https://github.com/speakeasyjs/speakeasy
    @Column({default: false})
    otpEnabled: boolean

    @Column({nullable: true})
    otpSecret: string;
    
    @ManyToMany(() => Role, role => role.users, {nullable: true, eager: true, onDelete: 'CASCADE' })
    //eager: true here means that you load roles immediately along with user
    @JoinTable()
    roles: Role[];
}


