import { z } from 'zod';
import { emailField, passwordSchema, stringField } from './common.schema';
import { AdminRoleEnum } from '../enums';

export const Admin = z.object({
  id: stringField('ID'),
  full_name: stringField('Name'),
  email: emailField('Email'),
  password: passwordSchema('Password'),
  inserted: stringField('Inserted'),
  updated: stringField('Updated'),
  access_token: stringField('Access Token'),
  role: z
    .nativeEnum(AdminRoleEnum)
    .refine((role) => role !== AdminRoleEnum.superAdmin, {
      message:
        'super-admin role is not allowed, Allowed values: admin, csr, others',
    }),
});

export const AdminInsert = Admin.omit({
  id: true,
  inserted: true,
  updated: true,
  access_token: true,
});

export const AdminUpdate = Admin.omit({
  id: true,
  inserted: true,
  updated: true,
  access_token: true,
  email: true,
  password: true,
  role: true,
});
export const AdminLogin = Admin.pick({
  email: true,
  password: true,
});

export const AdminChangePassword = z.object({
  oldPassword: passwordSchema('Old Password'),
  newPassword: passwordSchema('New Password'),
});

export const ChangePasswordByAdmin = AdminChangePassword.pick({
  newPassword: true,
});

export const Admin_Id = Admin.pick({ id: true });

export const AdminEmail = Admin.pick({
  email: true,
});

export type Admin = z.infer<typeof Admin>;
export type AdminLogin = z.infer<typeof AdminLogin>;
export type AdminInsert = z.infer<typeof AdminInsert>;
export type AdminChangePassword = z.infer<typeof AdminChangePassword>;
export type AdminEmail = z.infer<typeof AdminEmail>;
export type AdminUpdate = z.infer<typeof AdminUpdate>;
export type Admin_Id = z.infer<typeof Admin_Id>;
export type ChangePasswordByAdmin = z.infer<typeof ChangePasswordByAdmin>;
