import { orderRepository } from '../database/repositories/orderRepository';
import { InputOrderInterface } from '../database/interfaces';
import { generateRandomHex } from '../utils/helpers';
import { productRepository } from '../database/repositories/productRepository';
import { PaymentStatusEnum } from '../enums';
import { customerRepository } from '../database/repositories';
import { CustomerId } from '../schemas/customer.schema';
import { filterCustomerOrder } from '../schemas/order.schema';

const orderService = {
  async createOrder({
    customer_id,
    product_id,
    quantity,
  }: Omit<
    InputOrderInterface,
    | 'payment_status'
    | 'order_id'
    | 'order_date'
    | 'total_price'
    | 'customer_name'
  >) {
    try {
      const productData = await productRepository.findByProductId({
        id: product_id,
      });
      const customerDetails = await customerRepository.findById({
        id: customer_id,
      });
      if (!customerDetails) throw new Error('Customer Not Found');
      if (!productData) throw new Error('Product Not Found');
      if (productData.stock <= 0)
        throw new Error('The product stock is emply '); /*Checking Stock*/
      if (productData.stock < quantity)
        throw new Error(
          'Not Enough Stock Available to Procced Quantity'
        ) /*Checking order quantity and available stock */;
      else {
        const orderData = await orderRepository.insert({
          customer_id,
          payment_status: PaymentStatusEnum.notPaid,
          order_date: new Date(),
          order_id: generateRandomHex(3),
          product_id,
          quantity,
          total_price: quantity * productData.price,
          customer_name: customerDetails.full_name,
        });
        orderData &&
          productRepository.updateStock({
            count: quantity,
            isIncrement: false,
            product_id,
          });

        return orderData;
      }
    } catch (e) {
      throw e;
    }
  },

  async payOrder({ order_id }: { order_id: string }) {
    try {
      const updated = await orderRepository.update({
        order_id,
        payment_status: PaymentStatusEnum.paid,
      });

      return await orderRepository.findByOrderId({ order_id });
    } catch (e) {
      throw e;
    }
  },

  async customerGetOrders({
    customerId,
    product_id,
    payment_status,
    from_date_time,
    to_date_time,
  }: CustomerId & filterCustomerOrder) {
    try {
      return await orderRepository.find({
        customer_id: customerId,
        payment_status,
        product_id,
        from_date_time,
        to_date_time,
      });
    } catch (e) {
      throw e;
    }
  },
};

export default orderService;
