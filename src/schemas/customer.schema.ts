import { z } from 'zod';
import { emailField, passwordSchema, stringField } from './common.schema';

export const Customer = z.object({
  id: stringField('ID'),
  full_name: stringField('Name'),
  email: emailField('Email'),
  password: passwordSchema('Password'),
  inserted: stringField('Inserted'),
  updated: stringField('Updated'),
  access_token: stringField('Access Token'),
  address: stringField('Address'),
  contact: stringField('Contact'),
});

export const CustomerInsert = Customer.omit({
  id: true,
  inserted: true,
  updated: true,
  access_token: true,
});

export const CustomerUpdate = Customer.omit({
  id: true,
  inserted: true,
  updated: true,
  access_token: true,
  email: true,
  password: true,
});
export const CustomerLogin = Customer.pick({
  email: true,
  password: true,
});

export const CustomerChangePassword = z.object({
  oldPassword: passwordSchema('Old Password'),
  newPassword: passwordSchema('New Password'),
});

export const CustomerId = z.object({
  customerId: stringField('customerId'),
});

export const Customer_Id = Customer.pick({ id: true });

export const CustomerEmail = Customer.pick({
  email: true,
});

export type CustomerId = z.infer<typeof CustomerId>;
export type Customer = z.infer<typeof Customer>;
export type CustomerLogin = z.infer<typeof CustomerLogin>;
export type CustomerInsert = z.infer<typeof CustomerInsert>;
export type CustomerChangePassword = z.infer<typeof CustomerChangePassword>;
export type CustomerEmail = z.infer<typeof CustomerEmail>;
export type CustomerUpdate = z.infer<typeof CustomerUpdate>;
export type Customer_Id = z.infer<typeof Customer_Id>;
