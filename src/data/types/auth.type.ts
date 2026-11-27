import { User } from './user.type';
import { CivilStatus } from './tither.type';

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  parishId: string;
  birthDate: string;
  phoneSecondary?: string;
  civilStatus: CivilStatus;
  spouseName?: string;
  marriageDate?: string;
  ministry?: string;
  community?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface AuthResponse {
  message?: string;
  access_token: string;
  user: User;
}