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
    stockIncrementCount,
  }: {
    product_id: string;
    stockIncrementCount: number;
  }) {
    try {
      return await Model.Product.increment(
        { stock: stockIncrementCount },
        { where: { product_id } }
      );
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },
};
