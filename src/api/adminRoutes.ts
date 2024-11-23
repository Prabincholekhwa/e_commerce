import { Router } from 'express';
import ZOD from '../lib/zod';
import {
  AdminLogin,
  Admin_Id,
  AdminInsert,
  AdminChangePassword,
  AdminUpdate,
  ChangePasswordByAdmin,
} from '../schemas/admin.schema';
import adminController from './controller/adminController';
import validateAdmin from './middlewares/validateAdmin';

export default function adminRoutes(router: Router) {
  router
    .post(
      '/admins',
      validateAdmin({ onlySuperAdmin: true }),
      ZOD.requestAsyncParser({
        schema: AdminInsert.strict(),
        type: 'Body',
      }),
      adminController.create
    )
    .patch(
      '/admins',
      validateAdmin(),
      ZOD.requestAsyncParser({
        schema: AdminUpdate.strict(),
        type: 'Body',
      }),
      adminController.update
    )
    .get('/admins/profile', validateAdmin(), adminController.getOwnProfile)
    .post(
      '/admins/login',
      ZOD.requestAsyncParser({ schema: AdminLogin.strict(), type: 'Body' }),
      adminController.login
    )
    .patch(
      '/admins/change-password',
      validateAdmin(),
      ZOD.requestAsyncParser({
        schema: AdminChangePassword.strict(),
        type: 'Body',
      }),
      adminController.changePassword
    )
    .patch(
      '/admins/change-password-by-admin/:id',
      validateAdmin({ onlySuperAdmin: true }),
      ZOD.requestAsyncParser({
        schema: ChangePasswordByAdmin.strict(),
        type: 'Body',
      }),
      ZOD.requestAsyncParser({
        schema: Admin_Id.strict(),
        type: 'Params',
      }),
      adminController.changePasswordBySuperAdmin
    )
    .get(
      '/admins',
      validateAdmin({ onlySuperAdmin: true }),
      adminController.getAllAdmins
    )
    .patch('/admins/logout', validateAdmin(), adminController.logout);
}
