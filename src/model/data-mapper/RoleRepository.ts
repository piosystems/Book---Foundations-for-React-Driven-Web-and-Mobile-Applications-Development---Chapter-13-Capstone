//Data mapper for Role entity
//This is done by extending the base repository
import {EntityRepository, Repository} from "typeorm";
import { Role } from "../entity/Role";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {

    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    insertRoles(roles: Role[]){//roles is an array of objects
        return this.createQueryBuilder()
        .insert()
        .into(Role)
        .values(roles)
        .execute();
    }
    //update using query builder. Also more efficient
    updateRole(roleId: number, editedRoleData: Role){
        return this.createQueryBuilder()
        .update(Role)
        .set(editedRoleData)
        .where("id = :id", { id: roleId })
        .execute();
    }
    deleteRole(roleId: number){
        return this.createQueryBuilder()
        .delete()
        .from(Role)
        .where("id = :id", { id: roleId })
        .execute();
    }
    findByName(name: string) {
        return this.createQueryBuilder("role")
            .where("role.name = :name", { name })
            .getOne();//Name is set as unique
    }
    addUser(roleId: number, userId: number){
        return this.createQueryBuilder()
        .relation(Role, "users")
        .of(roleId)
        .add(userId)
    }
    removeUser(roleId: number, userId: number){
        return this.createQueryBuilder()
        .relation(Role, "users")
        .of(roleId)
        .remove(userId)
    }

    //finders
    //find roles that belong to a given user
    findByUserId(userId: number){
        return this.createQueryBuilder("role")
        .innerJoin("role.users","user")
        .where("user.id = :userId", {userId: userId})
        .getMany();
    }

    //find role and join users
    findByRoleId_LeftJoinAndSelectUsers(roleId: number){
        return this.createQueryBuilder("role")
        .leftJoinAndSelect("role.users","user")
        .where("role.id = :roleId", {roleId: roleId})
        .getOne();
    }

}