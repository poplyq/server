import { RequestWithCookie } from '../../types/requestCookie';
import { UserInfoImg, UserInfoRequest } from '../../types/userInfo';
import { UserDTO } from './dto/user.dto';
import { validationResult } from 'express-validator';
const userServices = require('./../../services/user/user.service');
const { ApiError } = require('../../error/api-error');
const uuid = require('uuid');
const path = require('path');

class UserController {
  async signup(req: UserDTO, res: any, next: any) {
    console.log(123);  
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при вводе', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userServices.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 + 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async signin(req: UserDTO, res: any, next: any) {
    try {
      const { email, password } = req.body;
      const userData = await userServices.login(email, password);
      console.log(userData);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 + 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req: UserDTO, res: any, next: any) {
    try {
      const { id } = req.body;
      const userData = await userServices.getUser(id);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: RequestWithCookie, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const logout = await userServices.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(logout);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: RequestWithCookie, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userServices.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 + 1000,
        httpOnly: true,
      });
      return res.json(userData.accessToken);
    } catch (e) {
      next(e);
    }
  }

  async check(req: UserInfoImg, res: any, next: any) {
    try {
      const user = await userServices.getUser(req.body.id);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async addAvatar(req: UserInfoImg, res: any, next: any) {
    try {
      const { img } = req.files;
      const id = req.body.id;
      let filename = uuid.v4() + '.jpeg';
      img.mv(path.resolve(__dirname, '../../../src', 'static', filename));
      const user = await userServices.addAvatar(id, filename);
      return res.json(user.avatarUserUrl);
    } catch (e) {
      next(e);
    }
  }
  async changeUser(req: UserInfoRequest, res: any, next: any) {
    try {
      const user = await userServices.changeUser(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async createPdf(req: any, res: any) {
   userServices.createPdf(req.body);
   return 1
  }
}

module.exports = new UserController();
