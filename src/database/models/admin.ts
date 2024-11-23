import * as Sequelize from 'sequelize';
import { database } from '../config/connection';
import { AdminModelInterface } from '../interfaces';
import { AdminRoleEnum } from '../../enums';

const sequelize = database.sequelize;

const Admin = sequelize.define<AdminModelInterface>('admins', {
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
  role: {
    type: Sequelize.ENUM(...Object.values(AdminRoleEnum)),
    allowNull: false,
  },
});

export default Admin;
