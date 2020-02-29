//We want to use nunjucks for rendering. Let's configure it here and then export it for use.
//Alternatively, you can use koa-views (https://github.com/queckezz/koa-views) which uses consolidate.js under the hood. May be heavier

import nunjucks from 'nunjucks';
import { VIEWS_BASE_PATH } from '../../settings';
import path from 'path';

//Compose the base path.
//Since this render-helper.ts file is in koa/view/helper folder and not in koa/ where the view folder is, we need to navigate out
//hence the ../../ in the basePath construction below.
//const basePath = `${__dirname}/../../${VIEWS_BASE_PATH?VIEWS_BASE_PATH:'view/template'}/`;//defaults to ${__dirname}/'view/templates' if VIEWS_BASE_PATH is not set
const basePath = path.join(__dirname, `/../../${VIEWS_BASE_PATH?VIEWS_BASE_PATH:'view/template'}/`); //VIEWS_BASE_PATH defaults to 'view/template'
//create the renderEngine variable

export const renderEngine = nunjucks.configure(basePath, {
    autoescape: true,
    watch: false // (default: false) reload templates when they are changed (server-side). To use watch, make sure optional dependency chokidar is installed.
    //see https://mozilla.github.io/nunjucks/api.html#configure for more options.
});

//for Koa, we can use the exported renderEngine above in our code or 
//we can implement a render function that returns Promise as shown below.
//The latter will enable us call renderEngine.render in an asynchronous manner if desired.
const render = (path: string, params: Object = {}) => {

    return new Promise((resolve, reject) => {
        
        renderEngine.render(path, params, (err: any, content: any) => {
           if (err) return reject(err);
           resolve(content);
       })

    });

};

export default render;