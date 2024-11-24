import {
  AdminInsert,
  AdminLogin,
  AdminChangePassword,
  Admin_Id,
  AdminUpdate,
  ChangePasswordByAdmin,
} from '../schemas/admin.schema';
import { adminRepository } from '../database/repositories';
import Bcrypt from '../lib/bcrypt';
import JWT from '../lib/jwt';
import { getSecretKey } from '../utils/helpers';
const adminService = {
  async create({ full_name, email, password, role }: AdminInsert) {
    try {
      const doesEmailExist = await adminRepository.findByEmail({ email });
      if (doesEmailExist) throw new Error('Email address already used');
      const hash = await Bcrypt.hash(password, 10);
      const response = await adminRepository.insert({
        full_name,
        email,
        password: hash,
        access_token: null,
        role,
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
  }: AdminLogin & { userAgent: string }) {
    try {
      const admin = await adminRepository.findByEmail({
        email,
        password: true,
      });
      console.log('admin', admin);
      if (!admin) throw new Error('Invalid Email');
      const isValid = await Bcrypt.compare(password, admin.password);
      if (!isValid) throw new Error('Invalid Password');
      const token = JWT.sign({
        data: {
          id: admin.id,
          email: admin.email,
          userAgent,
          role: admin.role,
        },
        secretKey: getSecretKey('access'),
      });

      await adminRepository.update({
        id: admin.id,
        access_token: token,
      });

      const adminDetails = await adminRepository.findById({
        id: admin.id,
      });
      return {
        token,
        admin: adminDetails,
      };
    } catch (e) {
      throw e;
    }
  },

  async changePassword({
    id,
    newPassword,
    oldPassword,
  }: AdminChangePassword & {
    id: string;
  }) {
    try {
      const doesExist = await adminRepository.findById({
        id,
        password: true,
      });
      if (!doesExist) throw new Error('Admin not found');
      const isValid = await Bcrypt.compare(oldPassword, doesExist.password);
      if (!isValid) throw new Error('Incorrect Old Password');

      if (oldPassword === newPassword)
        throw new Error('New Password cannot be same as old');

      const hash = await Bcrypt.hash(newPassword, 10);
      return await adminRepository.update({
        id,
        password: hash,
      });
    } catch (error) {
      throw error;
    }
  },

  async changePasswordByAdmin({
    id,
    newPassword,
  }: ChangePasswordByAdmin & Admin_Id) {
    try {
      const doesExist = await adminRepository.findById({
        id,
        password: true,
      });
      if (!doesExist) throw new Error('Admin not found');
      const hash = await Bcrypt.hash(newPassword, 10);
      return await adminRepository.update({
        id,
        password: hash,
      });
    } catch (error) {
      throw error;
    }
  },

  async logout({ id }: Admin_Id) {
    try {
      const admin = await adminRepository.findById({
        id,
        access_token: true,
      });

      if (!admin || !admin.id || !admin.access_token)
        throw new Error('Admin not found');

      const response = await adminRepository.update({
        id: admin.id,
        access_token: null,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async findById({ id }: Admin_Id) {
    try {
      const admin = await adminRepository.findById({
        id,
      });
      return admin;
    } catch (error) {
      throw error;
    }
  },

  async update({ id, ...data }: Admin_Id & Partial<AdminUpdate>) {
    try {
      await adminRepository.update({ id, ...data });
      return await this.findById({ id });
    } catch (error) {
      throw error;
    }
  },

  async getAllAdmins() {
    try {
      return await adminRepository.getAllAdmins();
    } catch (error) {
      throw error;
    }
  },
};
export default adminService;
