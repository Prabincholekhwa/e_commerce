import {
  ProductInterface,
  ProductModelInterface,
  InputProductInterface,
} from '../interfaces';
import Model from '../models';
import { Id } from '../../schemas/common.schema';

export const productRepository = {
  async insert({ ...data }: InputProductInterface): Promise<ProductInterface> {
    try {
      return await Model.Product.create({ ...data });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async bulkInsert(
    products: InputProductInterface[]
  ): Promise<ProductInterface[]> {
    try {
      const data = await Model.Product.bulkCreate(products, {
        returning: true,
      });
      console.log('dats', data, products);
      return data;
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async findByProductId({ id }: Id): Promise<ProductModelInterface | null> {
    try {
      return await Model.Product.findOne({
        where: {
          product_id: id,
        },
      });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async updateStock({
    product_id,
    count,
    isIncrement,
  }: {
    product_id: string;
    count: number;
    isIncrement: boolean;
  }) {
    try {
      if (isIncrement) {
        return await Model.Product.increment(
          { stock: count },
          { where: { product_id } }
        );
      } else {
        return await Model.Product.decrement(
          { stock: count },
          { where: { product_id } }
        );
      }
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async find() {
    try {
      return await Model.Product.findAndCountAll();
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },
};
