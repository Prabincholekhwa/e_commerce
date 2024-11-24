import {
  AdminInterface,
  AdminModelInterface,
  InputAdminInterface,
} from '../interfaces';
import Model from '../models';
import { Id } from '../../schemas/common.schema';
import { Op } from 'sequelize';

export const adminRepository = {
  async findByEmail({
    email,
    password,
  }: {
    email: string;
    password?: boolean;
  }): Promise<AdminInterface | null> {
    try {
      const attributes = [
        'id',
        'email',
        'full_name',
        'inserted',
        'updated',
        'role',
      ];
      password && attributes.push('password');
      const data = await Model.Admin.findOne({
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
  }): Promise<AdminInterface | null> {
    try {
      let exclude: string[] = [];

      !password && exclude.push('password');
      !access_token && exclude.push('access_token');
      const data = await Model.Admin.findByPk(id, {
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
    InputAdminInterface,
    'inserted' | 'updated' | 'accessToken'
  >): Promise<AdminInterface> {
    try {
      return await Model.Admin.create({ ...data });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async update({
    id,
    ...data
  }: Id &
    Omit<Partial<InputAdminInterface>, 'id' | 'inserted' | 'updated'>): Promise<
    [number]
  > {
    try {
      return await Model.Admin.update(data, { where: { id } });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },

  async getAllAdmins(): Promise<{
    rows: AdminModelInterface[];
    count: number;
  }> {
    try {
      return await Model.Admin.findAndCountAll({
        where: {
          role: {
            [Op.not]: 'super-admin',
          },
        },
        attributes: {
          exclude: ['password', 'access_token'],
        },
      });
    } catch (error: any) {
      error.level = 'Critical';
      throw error;
    }
  },
};
