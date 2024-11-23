import * as Sequelize from 'sequelize';
import { ModelTimeStampExtend } from './modelExtendedInterface';
import { AdminRoleEnum } from '../../enums';

export interface InputAdminInterface {
  full_name: string;
  email: string;
  password: string;
  access_token: string | null;
  role: AdminRoleEnum;
}

export interface AdminInterface extends ModelTimeStampExtend {
  id: string;
  full_name: string;
  email: string;
  password: string;
  access_token: string | null;
  role: AdminRoleEnum;
}

export interface AdminModelInterface
  extends Sequelize.Model<AdminInterface, Partial<InputAdminInterface>>,
    AdminInterface {}
