import * as Sequelize from 'sequelize';
import { ModelTimeStampExtend } from './modelExtendedInterface';

export interface InputProductInterface {
  name: string;
  product_id: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface ProductInterface extends ModelTimeStampExtend {
  name: string;
  product_id: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface ProductModelInterface
  extends Sequelize.Model<ProductInterface, Partial<InputProductInterface>>,
    ProductInterface {}
