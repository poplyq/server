import { UserInfo } from '../../types/userInfo';

const { User } = require('../../models/models');
const ApiError = require('../../error/api-error');
const PdfService = require('../pdf/pdf.service');
const bcrypt = require('bcrypt');
const TokenServices = require('../token/token.service');

class UserService {
  async registration(email: string, password: string) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest('пользователь уже существует');
    }
    const saltRounds = 5;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    await User.create({
      email: email,
      password: hashPassword,
    });
    const tokens = TokenServices.generateToken({ email });
    return {
      ...tokens,
      user: { email },
    };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('Пользователь не был найден');
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest('Неверный пароль');
    }
    const token = TokenServices.generateToken({id: user.id ,email:user.email});
    return {
      ...token,
      user,
    };
  }
  async getUser(id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw ApiError.BadRequest('Пользователь не был найден');
    }

    return user;
  }

  async logout(refreshToken: string) {
    const token = await TokenServices.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnautorizedError();
    }
    const userData = TokenServices.validateRefreshToken(refreshToken);
    if (!userData) {
      throw ApiError.UnautorizedError;
    }
    const id = userData.user.id;
    const user = await User.findOne({ where: { id } });
    const token = TokenServices.generateToken({ user });
    return {
      ...token,
    };
  }
  async addAvatar(id: number, filename: string) {
    if (!id) {
      throw ApiError.UnautorizedError();
    }
    const userData = await User.findOne({ where: { id } });
    userData.avatarUserUrl = filename;
    userData.save();
    return userData;
  }
  async changeUser(body: UserInfo) {
    const { id, firstName, lastName } = body;
    if (!id) {
      throw ApiError.UnautorizedError();
    }
    const userData = await User.findOne({ where: { id } });
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.save();
    return userData;
  }
  async createPdf(body: UserInfo) {
    const user = await User.findByPk(body.id);
    const doc = await PdfService.create(
      user.firstName,
      user.lastName,
      user.avatarUserUrl
    );
    console.log(doc);
    user.pdf = doc;
   await user.save();
    return 1;
  }

}

module.exports = new UserService();
