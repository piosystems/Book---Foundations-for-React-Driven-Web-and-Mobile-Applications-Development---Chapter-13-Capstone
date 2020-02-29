import koaRouter from 'koa-router-find-my-way'; //router middleware recommended by me.
import {routerOpts} from './helper/route-helper';

//import route definitions
import routes from './route-definition/all-routes';

import { BaseContext } from 'koa';
import { NextFunction } from '../custom-types';

//declare koaRouter
const router: koaRouter.Instance = koaRouter(routerOpts);//Here we pass the options created as an Object literal.

//loop through the route definitions and add each to the router
routes.map(route => {
  router.on(route.method, route.path, ...route.middlewares,route.controller)
})

/*Finally, before exporting router for use in our app, let us add a route in last postion, 
that will thus trap not-found issues. Below matches any method and any url.
If router gets here, it means that the url entered was not found
This is the equivalent of defaultRoute option passed to the router instance when using koa-router-find-my-way
*/
router.all("*", async(ctx: BaseContext, _next: NextFunction) => { 
  ctx.body = `Cannot find the url ${ctx.url}`;
})

export default router;

