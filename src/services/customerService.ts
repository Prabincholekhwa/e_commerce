import {
  CustomerInsert,
  CustomerLogin,
  CustomerChangePassword,
  Customer_Id,
  CustomerUpdate,
} from '../schemas/customer.schema';
import { customerRepository } from '../database/repositories';
import Bcrypt from '../lib/bcrypt';
import JWT from '../lib/jwt';
import { getSecretKey } from '../utils/helpers';
const customerService = {
  async create({
    full_name,
    email,
    password,
    address,
    contact,
  }: CustomerInsert) {
    try {
      const doesEmailExist = await customerRepository.findByEmail({ email });
      if (doesEmailExist) throw new Error('Email address already used');
      const hash = await Bcrypt.hash(password, 10);
      console.log('rrr');
      const response = await customerRepository.insert({
        full_name,
        email,
        password: hash,
        address,
        contact,
        access_token: null,
      });

      return response ? true : false;
    } catch (e) {
      throw e;
    }
  },
  async login({
    email,
    password,
    userAgent,
  }: CustomerLogin & { userAgent: string }) {
    try {
      const customer = await customerRepository.findByEmail({
        email,
        password: true,
      });
      if (!customer) throw new Error('Invalid Email');
      const isValid = await Bcrypt.compare(password, customer.password);
      if (!isValid) throw new Error('Invalid Password');
      const token = JWT.sign({
        data: {
          id: customer.id,
          email: customer.email,
          userAgent,
        },
        secretKey: getSecretKey('access'),
      });

      await customerRepository.update({
        id: customer.id,
        access_token: token,
      });

      const customerDetails = await customerRepository.findById({
        id: customer.id,
      });
      return {
        token,
        customer: customerDetails,
      };
    } catch (e) {
      throw e;
    }
  },

  async changePassword({
    id,
    newPassword,
    oldPassword,
  }: CustomerChangePassword & {
    id: string;
  }) {
    try {
      const doesExist = await customerRepository.findById({
        id,
        password: true,
      });
      if (!doesExist) throw new Error('Customer not found');
      const isValid = await Bcrypt.compare(oldPassword, doesExist.password);
      if (!isValid) throw new Error('Incorrect Old Password');

      if (oldPassword === newPassword)
        throw new Error('New Password cannot be same as old');

      const hash = await Bcrypt.hash(newPassword, 10);
      return await customerRepository.update({
        id,
        password: hash,
      });
    } catch (error) {
      throw error;
    }
  },

  async logout({ id }: Customer_Id) {
    try {
      const customer = await customerRepository.findById({
        id,
        access_token: true,
      });

      if (!customer || !customer.id || !customer.access_token)
        throw new Error('Customer not found');

      const response = await customerRepository.update({
        id: customer.id,
        access_token: null,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async findById({ id }: Customer_Id) {
    try {
      const customer = await customerRepository.findById({
        id,
      });
      return customer;
    } catch (error) {
      throw error;
    }
  },

  async update({ id, ...data }: Customer_Id & Partial<CustomerUpdate>) {
    try {
      await customerRepository.update({ id, ...data });
      return await this.findById({ id });
    } catch (error) {
      throw error;
    }
  },
};
export default customerService;
