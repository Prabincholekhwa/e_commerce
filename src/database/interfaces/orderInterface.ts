import * as Sequelize from 'sequelize';
import { ModelTimeStampExtend } from './modelExtendedInterface';
import { PaymentStatusEnum } from '../../enums';

export interface InputOrderInterface {
  product_id: string;
  quantity: number;
  total_price: number;
  payment_status: PaymentStatusEnum;
  customer_id: string;
  order_id: string;
  order_date: Date;
  customer_name: string;
}

export interface OrderInterface extends ModelTimeStampExtend {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  payment_status: PaymentStatusEnum;
  customer_id: string;
  order_id: string;
  order_date: Date;
  customer_name: string;
}

export interface OrderModelInterface
  extends Sequelize.Model<OrderInterface, Partial<InputOrderInterface>>,
    OrderInterface {}
