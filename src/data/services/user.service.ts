import { api } from '@/lib/api';
import { UserListItem } from '../types/user.type';
import { unmaskPhone } from '../utils/formatPhone';

export interface CreateParishAdminPayload {
  name: string;
  phone: string;
  password: string;
  parishId: string;
}

export const userService = {
  getUsers(): Promise<UserListItem[]> {
    return api.get<UserListItem[]>('/users');
  },

  createParishAdmin(payload: CreateParishAdminPayload): Promise<UserListItem> {
    return api.post<UserListItem>('/users', {
      ...payload,
      phone: unmaskPhone(payload.phone),
      role: 'PARISH_ADMIN',
    });
  },

  toggleActive(userId: string): Promise<UserListItem> {
    return api.patch<UserListItem>(`/users/${userId}/toggle-active`);
  },
};