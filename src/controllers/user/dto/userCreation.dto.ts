import { Request } from 'express';

export interface UserCreationDTO extends Request {
  email: string;
  firstName: string;
  lastName:string;
  password: string;
}
