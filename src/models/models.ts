const sequlize = require('../db');
import { DataTypes } from 'sequelize';
import { User } from '../types/user';

const User = sequlize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  avatarUserUrl: { type: DataTypes.STRING },
  pdf: { type: DataTypes.BLOB },
});

module.exports = {
  User,
};
