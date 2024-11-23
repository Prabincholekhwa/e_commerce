import * as Sequelize from 'sequelize';
import { database } from '../config/connection';
import { CustomerModelInterface } from '../interfaces';

const sequelize = database.sequelize;

const Customer = sequelize.define<CustomerModelInterface>('customers', {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  full_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  access_token: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  contact: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Customer;
