import {getConnection, getCustomRepository} from "typeorm";
import {User} from "../../model/entity/User";
import { UserRepository } from "../../model/data-mapper/UserRepository";


//In order to use just one import for the controller methods, we will put all the methods in one class
//and declare the classes as static, so we don't even have to instantiate the class first.
export default class UserController{
    
    //Let us illustrate transaction with addUserTxn
    public static addUserByTxn = async(ctx: any, _next: any) =>{
        // get a connection and create a new query runner
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner(); //only used in Entity Manager transactions

        const userRepository = getCustomRepository(UserRepository)

        const newUser: User = new User();
        newUser.isActive = ctx.request.body.isActive;//notice that we are getting the parameters from request body
        newUser.firstName = ctx.request.body.firstName;
        newUser.middleName = ctx.request.body.middleName;
        newUser.lastName = ctx.request.body.lastName;
        newUser.commonName = ctx.request.body.commonName;
        //newUser.passwordHash = ctx.request.body.passwordHash;
        //newUser.passwordSalt = "";
        newUser.photo = ctx.request.body.photo;
        newUser.primaryEmailAddress = ctx.params.primaryEmailAddress;//unique is true in db
        newUser.stateOfOrigin = ctx.request.body.stateOfOrigin;
        newUser.gender = ctx.request.body.gender;

        const userSaveSQL: string = userRepository.insertUserSQL(newUser);

        // lets now open a new transaction:
        await queryRunner.startTransaction();

        try {
            // execute some operations on this transaction:
            //can use the manager below or run my sql query following my preferred pattern
            //await queryRunner.manager.save(user);
            //await queryRunner.manager.save(photo);
            
            const user: User = await queryRunner.query(userSaveSQL);
            //const photo: any = await queryRunner.query(photoSaveSQL);
            
            // commit transaction now:
            await queryRunner.commitTransaction();

            ctx.status = 201; //Created
            ctx.body = `${JSON.stringify({success: user})}`

        } catch (err) {
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
            ctx.status = 400;//Bad request
            ctx.body = `${JSON.stringify({"success": false, "error": {message: err.message, detail: err.detail}})}`;

        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }



/*

    //how to save in a transaction. see https://github.com/typeorm/typeorm/blob/master/docs/transactions.md
    //imagine a situation in which you want user to be saved only if photo is also successfully saved
    //alternatively, used queryRunner style shown after this function
    async saveUserAndPhoto(user: User, photo: any){
        
        await getManager().transaction(async transactionalEntityManager => {
            try{
                await transactionalEntityManager.save(user);
                await transactionalEntityManager.save(photo);
            }catch(error){
                //role back here
                //how? not clear
            }
        });
        
    }
    

    //how to save in a transaction. see https://github.com/typeorm/typeorm/blob/master/docs/transactions.md
    //imagine a situation in which you want user to be saved only if photo is also successfully saved
    async saveUserAndPhotoUsingQueryRunner(user: User, photo: any){

        // get a connection and create a new query runner
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner(); //only used in Entity Manager transactions

        //In this example, we want to subject user creation and photo addition to transaction
        //Good idea to generate the raw sql first

        let userSaveSQL: string = this.createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .getSql();

        let photoSaveSQL: string = this.createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .getSql();
        

        // lets now open a new transaction:
        await queryRunner.startTransaction();

        try {
            // execute some operations on this transaction:
            //can use the manager below or run my sql query following my preferred pattern
            //await queryRunner.manager.save(user);
            //await queryRunner.manager.save(photo);
            
            const user: User = await queryRunner.query(userSaveSQL);
            const photo: any = await queryRunner.query(photoSaveSQL);
            
            // commit transaction now:
            await queryRunner.commitTransaction();


        } catch (err) {
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
*/

}

