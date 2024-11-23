import * as Sequelize from 'sequelize';
import { ModelTimeStampExtend } from './modelExtendedInterface';

export interface InputOrderInterface {
  product_id: string;
  quantity: number;
  total_price: number;
  is_dispatched_status: boolean;
  customer_id: string;
  order_id: string;
  order_date: Date;
}

export interface OrderInterface extends ModelTimeStampExtend {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  is_dispatched_status: boolean;
  customer_id: string;
  order_id: string;
  order_date: Date;
}

export interface OrderModelInterface
  extends Sequelize.Model<OrderInterface, Partial<InputOrderInterface>>,
    OrderInterface {}
