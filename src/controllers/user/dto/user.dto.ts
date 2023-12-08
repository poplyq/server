import { Request } from 'express';

export interface UserDTO extends Request {
  email: string;
  password: string;
}
