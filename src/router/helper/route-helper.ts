import {Context} from 'koa';

/* Prepare router options for koa-router-find-my-way*/
export const routerOpts: Object = {
    "ignoreTrailingSlash": true, //the default is false. If set to false a URL with a trailing / is considered different from a URL without a trailing /
    "caseSensitive": true, //the default is true
    "maxParamLength": 1000, //the default is 100. I am making this longer than the default 100 so as to accommodate reset link
    "allowUnsafeRegex": false, //the default is false
    "defaultRoute": (ctx: Context)=>{ctx.body = `Cannot find the url ${ctx.url}`} //A way to catch error 404 - page not found
}

/*Prepare upload options*/
import { UPLOAD_DIR } from '../../settings';//good idea to have a settings module where we define application settings for our app

/*As we plan to do file upload using formidable, we need to check to ensure that the upload path 
chosen is accessible, otherwise there will be a system crash if formidable tries to access a non-existent upload directory. 
In production, do this only once at setup time
*/
import fs from 'fs';
const validUploadDir = () => {
  let validUploadDir = false;
  try {
    fs.statSync(UPLOAD_DIR);
    //if no failure, it means that the file or directory indicated exists.
    validUploadDir = true;
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      //file or directory does not exist;
      validUploadDir = false;
    }
  }
  return validUploadDir;
}

//formidable options for file upload. 
const formidableOptions: Object = {
  /* 
  Below is a way to set upload directory using uploadDir element. We want to be sure that the file path is valid. 
  If not, mark uploadDir as undefined. This will cause formidable to upload to default tmp directory on the system.
  Alternative way is to implement onFileBegin option within which a custom file.path can be specified, as done below.
  The onFileBegin option also gives room to implement more complex storage like streaming to cloud like S3.
  */
  keepExtensions: true, //if you want the original file name extension to be preserved. Default is false
  onFileBegin: (_name: any,file: any) => {
    if(validUploadDir()){
      file.path = `${UPLOAD_DIR}/${new Date().valueOf()}.${file.name}`;
    }//if the upload directory is not valid, default value will be used which points to system tmp directory.
  },
  //For illustration, some other options include the following below. See https://github.com/felixge/node-formidable for more)
  maxFieldsSize: 20 * 1024 * 1024, //i.e. 20MB. Limits the amount of memory all fields together (except files) can allocate in bytes. 20MB is the default. If this value is exceeded, an 'error' event is emitted
  maxFileSize: 200 * 1024 * 1024, //i.e. 200MB. Limits the size of uploaded file. If this value is exceeded, an 'error' event is emitted. The default size is 200MB.
  maxFields: 1000, //Limits the number of fields that the querystring parser will decode. Defaults to 1000 (0 for unlimited).
  onError: (error: Error, ctx: Context) => {
    ctx.app.emit('error', error, ctx); //Emit an event named 'error' so that you can do a more fine-grained handling
  }
}

//Finally, prepare options for file upload koa-body middleware which includes formidable options prepared above
export const koaBodyOptionsWithfileUploadOptions = {
  "multipart":true, 
  "formidable":formidableOptions,
  "onError":(error: Error, ctx: Context)=>{
    ctx.app.emit('error', error, ctx); //Emit error to be caught my our centralized error handler in the index.js page
  }
}

/**
 * If using koa-router-find-my-way, we can compose routes separately.
 * We need these verbs to be of type HTTPMethod
 */ 
import { HTTPMethod } from 'find-my-way';

const GET: HTTPMethod = 'GET';
const POST: HTTPMethod = 'POST';
const PUT: HTTPMethod = 'PUT';
const PATCH: HTTPMethod = 'PATCH';
const DELETE: HTTPMethod = 'DELETE';

//let's unify them and export at once.
export const httpMethod = {
  'GET': GET,
  'POST': POST,
  'PUT': PUT,
  'PATCH': PATCH,
  'DELETE': DELETE
}
