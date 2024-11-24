import { Router } from 'express';
import orderController from './controller/orderController';
import validateCustomer from './middlewares/validateCustomer';
import ZOD from '../lib/zod';
import {
  filterCustomerOrder,
  filterOrdersByAdmin,
  OrderId,
  OrderInsert,
} from '../schemas/order.schema';
import validateAdmin from './middlewares/validateAdmin';

export default function orderRoutes(router: Router) {
  router
    .post(
      '/orders',
      validateCustomer(),
      ZOD.requestAsyncParser({
        schema: OrderInsert.strict(),
        type: 'Body',
      }),
      orderController.createOrder
    )
    .patch(
      '/orders/pay/:order_id',
      validateCustomer(),
      ZOD.requestAsyncParser({
        schema: OrderId.strict(),
        type: 'Params',
      }),
      orderController.payOrder
    )
    //Order Detail Route For Admin use with more customer details
    .get(
      '/orders/admin/:order_id',
      validateAdmin(),
      ZOD.requestAsyncParser({
        schema: OrderId.strict(),
        type: 'Params',
      }),
      orderController.getOrderDetailByAdmin
    )
    //Filter Own Orders for customer use
    //Filter ?payment_status=not-paid&product_id=ad6787as8d&from_date_time=2024-11-23T00:00:00Z&to_date_time=2024-11-24T00:00:00Z are optional
    .get(
      '/orders/my-orders',
      validateCustomer(),
      ZOD.requestAsyncParser({
        schema: filterCustomerOrder.strict(),
        type: 'Query',
      }),
      orderController.getOwnOrders
    )

    //Order Detail Route For Customer
    .get(
      '/orders/:order_id',
      validateCustomer(),
      ZOD.requestAsyncParser({
        schema: OrderId.strict(),
        type: 'Params',
      }),
      orderController.getOrderDetailByCustomer
    )
    //Filter Orders for Admin use more customers details
    //Filter ?payment_status=not-paid&product_id=ad6787as8d&from_date_time=2024-11-23T00:00:00Z&to_date_time=2024-11-24T00:00:00Z&customer_id=oiu2342 are optional
    .get(
      '/orders',
      validateAdmin(),
      ZOD.requestAsyncParser({
        schema: filterOrdersByAdmin.strict(),
        type: 'Query',
      }),
      orderController.getOrdersByAdmin
    );
}
