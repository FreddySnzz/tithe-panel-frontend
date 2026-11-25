import { api } from '@/lib/api';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.type';
import { unmaskPhone } from '../utils/formatPhone';

export const authService = {
  login(payload: LoginPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', {
      phone: unmaskPhone(payload.phone),
      password: payload.password,
    });
  },

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', {
      ...payload,
      phone: unmaskPhone(payload.phone),
      phoneSecondary: payload.phoneSecondary
        ? unmaskPhone(payload.phoneSecondary)
        : undefined,
    });
  },
};