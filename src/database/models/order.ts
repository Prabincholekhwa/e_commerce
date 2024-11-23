import * as Sequelize from 'sequelize';
import { database } from '../config/connection';
import { OrderModelInterface } from '../interfaces';
import Product from './product';
import Customer from './customer';

const sequelize = database.sequelize;

const Order = sequelize.define<OrderModelInterface>(
  'orders',
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    total_price: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    is_dispatched_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    customer_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Customer,
        key: 'id',
      },
    },
    order_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    order_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ['product_id'],
        name: 'orders_product_id_index',
        concurrently: true,
      },
      {
        fields: ['customer_id'],
        name: 'orders_customer_id_index',
        concurrently: true,
      },
      {
        fields: ['order_id'],
        name: 'orders_order_id_index',
        concurrently: true,
      },
    ],
  }
);

Product.hasMany(Order, {
  foreignKey: 'product_id',
  as: 'orders',
});
Order.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

Customer.hasMany(Order, {
  foreignKey: 'customer_id',
  as: 'orders',
});

Order.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer',
});

export default Order;
