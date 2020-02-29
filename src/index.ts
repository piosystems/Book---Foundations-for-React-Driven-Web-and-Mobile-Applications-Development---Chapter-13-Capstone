import connection from "./model/connection/connection";

//bootstrapping Koa
//import * as Koa from "koa"
import Koa from "koa";
import {Context} from 'koa'; //the type for request and response context

//As Koa does not ship with a type for next function, I have defined one in type-definitions
import {NextFunction} from './custom-types';

//for serving static files
import koaStatic from "koa-static";

//import router
import router from './router/router';

//Instantiate the Koa object.
export const app: Koa = new Koa();

//set a port number as preferred.
const port: number = 3001;

/*get connection to database and use the instantiated koa app 
if connection is successful
*/
connection.then(async _connection => {
    /*in Koa, error handler is the first in the middleware stack 
    unlike the case of express where it is the last. The error handler here 
    is characterized by a try{await next()}catch(error) statement
    */
    app.use(async(ctx: Context, next: NextFunction ) => {
        try {
            await next();
        } catch (error) {
            ctx.status = error.status || 500; //set error status to 500 if no error.status set in error object
            ctx.body = `Problem with site: ${error.message}`;
            ctx.app.emit('error', error, ctx); //Emit an event named 'error' so that you can do a more fine-grained handling
        }
    });
    /*Below is not mandatory but useful for more centralized error handling.
    This will be called whenever an event name 'error' is emitted.
    */
   app.on('error', async(_err: Error, _ctx: Context) => {//underscore here is a way to prevent Typescript from complaining if the variable is not in use
    /* Do some centralized error handling when there is an error event emitted
    * E.g. log to an error log file
    */
   });
   
   //Associate static directory with the app.
   app.use(koaStatic(__dirname + '/static'));

   //Associate router with the app
   app.use(router.routes());
   
   //start the server
   app.listen(port, () => console.log(`SILMS app listening on port ${port}!`))

}).catch(error => console.log(error));//log error to console if there is a problem connecting to database
