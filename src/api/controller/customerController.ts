import customerService from '../../services/customerService';
import { Request, Response, NextFunction } from 'express';
import {
  CustomerInsert,
  CustomerChangePassword,
  Customer_Id,
  CustomerUpdate,
} from '../../schemas/customer.schema';
import { formatResponseData } from '../../utils/helpers';

const customerController = {
  async create(
    req: Request<{}, {}, CustomerInsert>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, full_name, password, address, contact } = req.body;
      const userAgent = req.headers['user-agent']!;

      await customerService.create({
        email,
        full_name,
        password,
        address,
        contact,
      });
      const loginResponse = await customerService.login({
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
            'Customer Registered Successfully'
          )
        );
    } catch (error) {
      console.log('err', error);
      next(error);
    }
  },
  async login(
    req: Request<{}, {}, CustomerInsert>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent']!;
    try {
      const response = await customerService.login({
        email,
        password,
        userAgent,
      });
      res
        .status(200)
        .json(formatResponseData(true, response, 'Customer Login success'));
    } catch (error) {
      next(error);
    }
  },

  async changePassword(
    req: Request<{}, {}, CustomerChangePassword>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { newPassword, oldPassword } = req.body;
    const { id } = req.customer!;
    try {
      await customerService.changePassword({
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

  async logout(req: Request, res: Response, next: NextFunction) {
    const { id } = req.customer!;
    try {
      await customerService.logout({ id });

      res
        .status(200)
        .json(formatResponseData(true, undefined, 'Logout success'));
    } catch (error) {
      next(error);
    }
  },
  async update(
    req: Request<{}, {}, CustomerUpdate>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { full_name, address, contact } = req.body;
    const { id } = req.customer!;
    try {
      const response = await customerService.update({
        id,
        full_name,
        address,
        contact,
      });
      response &&
        res
          .status(200)
          .json(formatResponseData(true, response, 'Customer Updated'));
    } catch (error) {
      next(error);
    }
  },

  async getOwnProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.customer!;
      const response = await customerService.findById({ id });
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
};

export default customerController;
