import orderService from '../../services/orderService';
import { Request, Response, NextFunction } from 'express';
import { formatResponseData } from '../../utils/helpers';
import {
  OrderInsert,
  OrderId,
  filterCustomerOrder,
  filterOrdersByAdmin,
} from '../../schemas/order.schema';
import { orderRepository } from '../../database/repositories/orderRepository';

const orderController = {
  //For Customers Use
  async createOrder(
    req: Request<{}, {}, OrderInsert>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { product_id, quantity } = req.body;
      const { id } = req.customer!;
      const response = await orderService.createOrder({
        customer_id: id,
        product_id: product_id,
        quantity,
      });
      res
        .status(200)
        .json(
          formatResponseData(true, response, 'Order Created  Successfully')
        );
    } catch (err) {
      next(err);
    }
  },

  //For Customers Use
  async payOrder(
    req: Request<OrderId, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { order_id } = req.params;
      const response = await orderService.payOrder({ order_id });
      res
        .status(200)
        .json(
          formatResponseData(true, response, 'Order Payment Made Successfully')
        );
    } catch (err) {
      next(err);
    }
  },

  //For Customers Use
  //Filter Works
  async getOwnOrders(
    req: Request<{}, {}, {}, filterCustomerOrder>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.customer!;
      const { product_id, payment_status, from_date_time, to_date_time } =
        req.query;
      const response = await orderService.customerGetOrders({
        customerId: id,
        payment_status,
        product_id,
        from_date_time,
        to_date_time,
      });
      res
        .status(200)
        .json(formatResponseData(true, response, 'Order Fetched Successfully'));
    } catch (err) {
      next(err);
    }
  },

  //For Customer use
  async getOrderDetailByCustomer(
    req: Request<OrderId, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { order_id } = req.params;
      const response = await orderRepository.findByOrderId({ order_id });
      res
        .status(200)
        .json(formatResponseData(true, response, 'Order Fetched Successfully'));
    } catch (err) {
      next(err);
    }
  },

  //For Admin use
  async getOrderDetailByAdmin(
    req: Request<OrderId, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { order_id } = req.params;
      const response = await orderRepository.findByOrderId({
        order_id,
        includeCustomer: true,
      });
      res
        .status(200)
        .json(formatResponseData(true, response, 'Order Fetched Successfully'));
    } catch (err) {
      next(err);
    }
  },

  //For Admin Use
  //Filter Works
  async getOrdersByAdmin(
    req: Request<{}, {}, {}, filterOrdersByAdmin>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        customer_id,
        from_date_time,
        payment_status,
        product_id,
        to_date_time,
      } = req.query;
      const response = await orderRepository.find({
        customer_id,
        includeCustomer: true,
        from_date_time,
        payment_status,
        product_id,
        to_date_time,
      });
      res
        .status(200)
        .json(formatResponseData(true, response, 'Order Fetched Successfully'));
    } catch (err) {
      next(err);
    }
  },
};

export default orderController;
