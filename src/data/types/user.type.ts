export type Role = 'SUPER_ADMIN' | 'PARISH_ADMIN' | 'TITHER';

export interface User {
  id: string;
  name: string;
  role: Role;
  parishId: string | null;
}

export interface UserListItem {
  id: string;
  name: string;
  phone: string;
  role: Role;
  active: boolean;
  createdAt: string;
  tither?: {
    parishId: string;
    parish: {
      name: string;
    };
  } | null;
}