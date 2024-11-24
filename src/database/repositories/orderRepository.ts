import {
  OrderInterface,
  OrderModelInterface,
  InputOrderInterface,
} from '../interfaces';
import Model from '../models';
import { filterCustomerOrder, OrderId } from '../../schemas/order.schema';
import sequelize, { IncludeOptions, WhereOptions } from 'sequelize';

export const orderRepository = {
  async insert({ ...data }: InputOrderInterface): Promise<OrderInterface> {
    try {
      return await Model.Order.create({ ...data });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async findByOrderId({
    order_id,
    includeCustomer,
  }: OrderId & { includeCustomer?: boolean }): Promise<OrderInterface | null> {
    try {
      let include: IncludeOptions[] = [];
      if (includeCustomer)
        include.push({
          model: Model.Customer,
          as: 'customer',
          attributes: { exclude: ['password', 'access_token'] },
        });
      const data = await Model.Order.findOne({
        where: { order_id: order_id },
        include,
      });
      console.log('data', data);
      return data;
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async update({
    order_id,
    ...data
  }: { order_id: string } & Partial<InputOrderInterface>): Promise<[number]> {
    try {
      return await Model.Order.update(data, { where: { order_id } });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async find({
    product_id,
    customer_id,
    payment_status,
    from_date_time,
    to_date_time,
    includeCustomer,
  }: {
    customer_id?: string;
    includeCustomer?: boolean;
  } & filterCustomerOrder): Promise<{
    rows: OrderInterface[];
    count: number;
  }> {
    try {
      let where: WhereOptions = {};
      let include: IncludeOptions[] = [];
      if (includeCustomer)
        include.push({
          model: Model.Customer,
          as: 'customer',
          attributes: { exclude: ['password', 'access_token'] },
        });
      if (product_id) where.product_id = product_id;
      if (customer_id) where.customer_id = customer_id;
      if (payment_status) where.payment_status = payment_status;
      if (from_date_time || to_date_time) {
        where.order_date = {};
        if (from_date_time) {
          where.order_date[sequelize.Op.gte] = new Date(from_date_time);
        }
        if (to_date_time) {
          where.order_date[sequelize.Op.lte] = new Date(to_date_time);
        }
      }

      return await Model.Order.findAndCountAll({
        where,
        include,
      });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },
};
