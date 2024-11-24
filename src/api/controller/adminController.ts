import adminService from '../../services/adminService';
import { Request, Response, NextFunction } from 'express';
import {
  AdminInsert,
  AdminChangePassword,
  Admin_Id,
  AdminUpdate,
  ChangePasswordByAdmin,
} from '../../schemas/admin.schema';
import { formatResponseData } from '../../utils/helpers';

const adminController = {
  async create(
    req: Request<{}, {}, AdminInsert>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, full_name, password, role } = req.body;
      const userAgent = req.headers['user-agent']!;

      await adminService.create({
        email,
        full_name,
        password,
        role,
      });
      const loginResponse = await adminService.login({
        email,
        password,
        userAgent,
      });
      res
        .status(201)
        .json(
          formatResponseData(
            true,
            loginResponse,
            'Admin Registered Successfully'
          )
        );
    } catch (error) {
      console.log('err', error);
      next(error);
    }
  },
  async login(
    req: Request<{}, {}, AdminInsert>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent']!;
    try {
      const response = await adminService.login({
        email,
        password,
        userAgent,
      });
      res
        .status(200)
        .json(formatResponseData(true, response, 'Admin Login success'));
    } catch (error) {
      next(error);
    }
  },

  async changePassword(
    req: Request<{}, {}, AdminChangePassword>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { newPassword, oldPassword } = req.body;
    const { id } = req.admin!;
    try {
      await adminService.changePassword({
        id,
        newPassword,
        oldPassword,
      });
      res
        .status(201)
        .json(formatResponseData(true, undefined, 'Password changed'));
    } catch (error) {
      next(error);
    }
  },

  async changePasswordBySuperAdmin(
    req: Request<Admin_Id, {}, ChangePasswordByAdmin>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { newPassword } = req.body;
    try {
      await adminService.changePasswordByAdmin({
        id,
        newPassword,
      });
      res
        .status(201)
        .json(formatResponseData(true, undefined, 'Password changed'));
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    const { id } = req.admin!;
    try {
      await adminService.logout({ id });
      res
        .status(200)
        .json(formatResponseData(true, undefined, 'Logout success'));
    } catch (error) {
      next(error);
    }
  },

  async update(
    req: Request<{}, {}, AdminUpdate>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { full_name } = req.body;
    const { id } = req.admin!;
    try {
      const response = await adminService.update({
        id,
        full_name,
      });
      response &&
        res
          .status(200)
          .json(formatResponseData(true, response, 'Admin Updated'));
    } catch (error) {
      next(error);
    }
  },

  async getOwnProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.admin!;
      const response = await adminService.findById({ id });
      res
        .status(200)
        .json(
          formatResponseData(true, response, 'Profile Fethched Successfully')
        );
    } catch (error) {
      console.log(error, 'errs');
      next(error);
    }
  },

  async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await adminService.getAllAdmins();
      res
        .status(200)
        .json(
          formatResponseData(true, response, 'All Admin Fethched Successfully')
        );
    } catch (error) {
      next(error);
    }
  },
};

export default adminController;
