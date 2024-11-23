import { CustomerInterface, InputCustomerInterface } from '../interfaces';
import Model from '../models';
import { Id } from '../../schemas/common.schema';

export const customerRepository = {
  async findByEmail({
    email,
    password,
  }: {
    email: string;
    password?: boolean;
  }): Promise<CustomerInterface | null> {
    try {
      const attributes = ['id', 'email', 'full_name', 'inserted', 'updated'];
      password && attributes.push('password');
      const data = await Model.Customer.findOne({
        where: {
          email,
        },
        attributes,
      });
      return data;
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async findById({
    id,
    password,
    access_token,
  }: Id & {
    password?: boolean;
    access_token?: boolean;
  }): Promise<CustomerInterface | null> {
    try {
      let exclude: string[] = [];

      !password && exclude.push('password');
      !access_token && exclude.push('access_token');
      const data = await Model.Customer.findByPk(id, {
        attributes: {
          exclude,
        },
      });
      return data;
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async insert({
    ...data
  }: Omit<
    InputCustomerInterface,
    'inserted' | 'updated' | 'accessToken'
  >): Promise<CustomerInterface> {
    console.log('datas', data);
    return await Model.Customer.create({ ...data });
  },

  async update({
    id,
    ...data
  }: Id &
    Omit<
      Partial<InputCustomerInterface>,
      'id' | 'inserted' | 'updated'
    >): Promise<[number]> {
    try {
      return await Model.Customer.update(data, { where: { id } });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },
};
