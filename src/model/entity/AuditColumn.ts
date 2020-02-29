//This abstract class contain audit fields and is inherited by all classes.
//In this way, there is no need to repeat the fields in each class.
import {Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export abstract class AuditColumn {//columns common to all entities to be inherited
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn() //update this automatically on creation
    dateCreated: Date;

    @Column({nullable: true})
    createdBy: string;//just use the username, fullname, userid. For audit purpose. No need for relations

    @UpdateDateColumn() //update this automatically whenever there is modification
    dateLastModified: Date;

    @Column({nullable: true})
    lastModifiedBy: string;//just use the username, fullname, userid. For audit purpose. No need for relations

    @Column({nullable: true})
    lastChangeInfo: string;
    
}