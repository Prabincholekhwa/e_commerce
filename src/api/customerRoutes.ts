import { Router } from 'express';
import ZOD from '../lib/zod';
import {
  CustomerLogin,
  Customer_Id,
  CustomerInsert,
  CustomerChangePassword,
  CustomerUpdate,
} from '../schemas/customer.schema';
import customerController from './controller/customerController';
import validateCustomer from './middlewares/validateCustomer';

export default function customerRoutes(router: Router) {
  router
    .post(
      '/customers/signup',
      ZOD.requestAsyncParser({
        schema: CustomerInsert.strict(),
        type: 'Body',
      }),
      customerController.create
    )
    .patch(
      '/customers',
      validateCustomer(),
      ZOD.requestAsyncParser({
        schema: CustomerUpdate.strict(),
        type: 'Body',
      }),
      customerController.update
    )
    .get(
      '/customers/profile',
      validateCustomer(),
      customerController.getOwnProfile
    )
    .post(
      '/customers/login',
      ZOD.requestAsyncParser({ schema: CustomerLogin.strict(), type: 'Body' }),
      customerController.login
    )
    .patch(
      '/customers/change-password',
      validateCustomer(),
      ZOD.requestAsyncParser({
        schema: CustomerChangePassword.strict(),
        type: 'Body',
      }),
      customerController.changePassword
    )
    .patch('/customers/logout', validateCustomer(), customerController.logout);
}
