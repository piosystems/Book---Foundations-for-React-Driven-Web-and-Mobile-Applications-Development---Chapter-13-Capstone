import { Context } from "koa";
import { NextFunction } from "../../custom-types";

import {renderEngine} from '../../view/helper/render-helper';

export default class HomeController{
    public static getHome = async (ctx: Context, _next: NextFunction) => {
        try{
            //ctx.body = "Hello World! This is the home page";
            //below uses our nunjucks render engine
            //ctx.body = await render('home.html', {username: 'Pius'});//asynchronous call
            ctx.body = renderEngine.render('guest-website/home.html', {title: 'SILMS Home', homeActive: 'true'}); //synchronous call
        }catch(error){
            ctx.status = 500;
            ctx.body = `${JSON.stringify({"success": false, "error": {message: error.message, detail: error.detail}})}`;
        }
    }
}