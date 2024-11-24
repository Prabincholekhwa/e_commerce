import * as Sequelize from 'sequelize';
import { database } from '../config/connection';
import { ProductModelInterface } from '../interfaces';

const sequelize = database.sequelize;

const Product = sequelize.define<ProductModelInterface>(
  'products',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ['product_id'],
        name: 'products_product_id_index',
        concurrently: true,
      },
    ],
  }
);

export default Product;
