import * as Sequelize from 'sequelize';
import { ModelTimeStampExtend } from './modelExtendedInterface';

export interface InputCustomerInterface {
  full_name: string;
  email: string;
  password: string;
  access_token: string | null;
  contact: string | null;
  address: string | null;
}

export interface CustomerInterface extends ModelTimeStampExtend {
  id: string;
  full_name: string;
  email: string;
  password: string;
  access_token: string | null;
  contact: string | null;
  address: string | null;
}

export interface CustomerModelInterface
  extends Sequelize.Model<CustomerInterface, Partial<InputCustomerInterface>>,
    CustomerInterface {}
