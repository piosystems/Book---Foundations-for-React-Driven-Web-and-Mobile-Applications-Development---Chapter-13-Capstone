/*For simplicity, parameters for all routes are defined here.
If you prefer, use different files for different routes
*/
import {httpMethod, koaBodyOptionsWithfileUploadOptions} from '../helper/route-helper';
import koaBody from 'koa-body';//Note that koa-body uses formidable under the hood for file uploads
import HomeController from '../../controller/guest-website/HomeController';
import FAQController from '../../controller/guest-website/FAQController';
import UserController from '../../controller/user-management/UserController';
import { Routes } from '../../custom-types';

const routes: Array<Routes> = 

[
    /*guest-website routes*/
    {
        "method": [httpMethod.GET],
        "path" : '/',
        "middlewares" : [],
        "controller" : HomeController.getHome
      },
      {
        "method": [httpMethod.GET],
        "path" : '/faqs',
        "middlewares" : [],
        "controller" : FAQController.getFAQsWeb
      },
      {
        "method": [httpMethod.GET],
        "path" : '/admin/faqs',
        "middlewares" : [],
        "controller" : FAQController.getFAQsWebAdmin
      },
      {
        "method": [httpMethod.POST],
        "path" : '/admin/faq',
        "middlewares" : [koaBody()],
        "controller" : FAQController.addFAQWebAdmin
      },
      {
        "method": [httpMethod.GET],//anti-pattern
        "path" : '/faqs/delete/:id',
        "middlewares" : [],
        "controller" : FAQController.deleteFAQWebAdmin
      },
      {
        "method": [httpMethod.GET],
        "path" : '/v1/faqs',
        "middlewares" : [],
        "controller" : FAQController.getFAQsREST
      },
      {
        "method": [httpMethod.POST],
        "path" : '/v1/faqs',
        "middlewares" : [koaBody()],
        "controller" : FAQController.addFAQs
      },
      {
        "method": [httpMethod.POST],
        "path" : '/v1/faq',
        "middlewares" : [koaBody()],
        "controller" : FAQController.addFAQ
      },
      {
        "method": [httpMethod.PUT],
        "path" : '/v1/faqs/:id',
        "middlewares" : [koaBody()],
        "controller" : FAQController.updateFAQ
      },
      {
        "method": [httpMethod.DELETE],
        "path" : '/v1/faqs/:id',
        "middlewares" : [],
        "controller" : FAQController.deleteFAQ
      },
      {
        "method": [httpMethod.PATCH],
        "path" : '/v1/faqs/:fAQId/category/:fAQCategoryId',
        "middlewares" : [],
        "controller" : FAQController.setFAQCategory
      },
      
      
      /* role-management routes*/
      

      /* user-management routes*/
      {
        "method": [httpMethod.GET],
        "path" : '/admin/users',
        "middlewares" : [],
        "controller" : UserController.getUsersWebAdmin
      },
      {
        "method": [httpMethod.POST],
        "path" : '/admin/user',
        "middlewares" : [koaBody()],
        "controller" : UserController.addUserWebAdmin
      },
      {
        "method": [httpMethod.GET],//anti-pattern
        "path" : '/users/delete/:id',
        "middlewares" : [],
        "controller" : UserController.deleteUserWebAdmin
      },
      {
        "method": [httpMethod.GET],
        "path" : '/v1/users',
        "middlewares" : [],
        "controller" : UserController.getUsers
      },
      {
        "method": [httpMethod.POST],
        "path" : '/v1/users',
        "middlewares" : [koaBody()],
        "controller" : UserController.addUsers
      },
      {
        "method": [httpMethod.POST],
        "path" : '/v1/user',
        "middlewares" : [koaBody()],
        "controller" : UserController.addUser
      },
      {
        "method": [httpMethod.GET],
        "path" : '/v1/users/:id',
        "middlewares" : [],
        "controller" : UserController.getUser
      },
      {
        "method": [httpMethod.PUT],
        "path" : '/v1/users/:id',
        "middlewares" : [koaBody()],
        "controller" : UserController.updateUser
      },
      {
        "method": [httpMethod.DELETE],
        "path" : '/v1/users/:id',
        "middlewares" : [],
        "controller" : UserController.deleteUser
      },
      {
        "method": [httpMethod.PATCH],
        "path" : '/v1/users/:userId/roles/:roleId',
        "middlewares" : [],
        "controller" : UserController.addRole
      },
      {
        "method": [httpMethod.PATCH],
        "path" : '/v1/users/:id/roles',
        "middlewares" : [],
        "controller" : UserController.getUserRoles
      },
      {
        "method": [httpMethod.DELETE],
        "path" : '/v1/users/:userId/roles/:roleId',
        "middlewares" : [],
        "controller" : UserController.removeRole
      },
      {
        "method": [httpMethod.PATCH,httpMethod.POST],//post is here because of use from a form
        "path": '/v1/users/forgot-password/',
        "middlewares":[koaBody()],
        "controller" : UserController.forgotPassword
      },
      {
        "method": [httpMethod.PATCH, httpMethod.GET, httpMethod.POST],//get is here because of use from a form
        "path": '/v1/users/reset-password/:token',
        "middlewares":[koaBody(koaBodyOptionsWithfileUploadOptions)],
        "controller" : UserController.resetPassword
      }
  ]
  
  export default routes;