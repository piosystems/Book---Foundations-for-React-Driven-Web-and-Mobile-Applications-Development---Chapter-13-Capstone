import { HTTPMethod } from "find-my-way";
import { Middleware, ParameterizedContext } from "koa";

/**
 * As Koa ships not with a type for next function, we are creating one here.
 * Whenever we tag a variable type as NextFunction,
 * that variable is expected to hold a function that returns a promise. 
 * The function can optionally receive an argument of any type 
 * which could typically be error type 
 */
export interface NextFunction{
    (err?:any): Promise<any> 
}

/**
 * Define a type for defining elements of routes.
 */
export interface Routes{
    method: HTTPMethod[],
    path : string,
    middlewares : Middleware<ParameterizedContext<{}, {}>>[],
    controller : any
}