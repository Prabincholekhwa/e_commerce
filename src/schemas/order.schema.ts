import { z } from 'zod';
import {
  stringField,
  positiveNumberField,
  ISODateTimeString,
} from './common.schema';
import { PaymentStatusEnum } from '../enums';

export const OrderInsert = z.object({
  product_id: stringField('Product Id'),
  quantity: positiveNumberField('Quantity'),
});
export const OrderId = z.object({
  order_id: stringField('Order Id'),
});

export const filterCustomerOrder = z.object({
  product_id: stringField('Product Id').optional(),
  from_date_time: ISODateTimeString('From Date Time(ISO)').optional(),
  to_date_time: ISODateTimeString('To Date Time(ISO)').optional(),
  payment_status: z
    .nativeEnum(PaymentStatusEnum)
    .describe('Payment Status Enum(paid | not-paid)')
    .optional(),
});

export const filterOrdersByAdmin = z.object({
  customer_id: stringField('Customer Id').optional(),
  product_id: stringField('Product Id').optional(),
  from_date_time: ISODateTimeString('From Date Time(ISO)').optional(),
  to_date_time: ISODateTimeString('To Date Time(ISO)').optional(),
  payment_status: z
    .nativeEnum(PaymentStatusEnum)
    .describe('Payment Status Enum(paid | not-paid)')
    .optional(),
});

export type OrderInsert = z.infer<typeof OrderInsert>;
export type OrderId = z.infer<typeof OrderId>;
export type filterCustomerOrder = z.infer<typeof filterCustomerOrder>;
export type filterOrdersByAdmin = z.infer<typeof filterOrdersByAdmin>;
