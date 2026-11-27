import {
  CalendarCheck2,
  CheckSquare,
  Church,
  FileSpreadsheet,
  LayoutDashboard,
  LucideIcon,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import { Role } from '@/data/types/user.type';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: 'pendingApprovals';
}

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  TITHER: [
    { id: 'overview', label: 'Minhas Devoluções', icon: CalendarCheck2 },
    { id: 'profile', label: 'Minha Ficha Cadastral', icon: UserCog },
  ],
  PARISH_ADMIN: [
    { id: 'overview', label: 'Visão Geral e Relatório', icon: LayoutDashboard },
    {
      id: 'approvals',
      label: 'Aprovações Pendentes',
      icon: CheckSquare,
      badgeKey: 'pendingApprovals',
    },
    { id: 'tithers', label: 'Dizimistas', icon: Users },
    { id: 'users', label: 'Administradores', icon: ShieldCheck },
    { id: 'parish-settings', label: 'Dados da Paróquia', icon: Church },
  ],
  SUPER_ADMIN: [
    { id: 'parishes', label: 'Paróquias', icon: Church },
    { id: 'reports', label: 'Consolidado', icon: FileSpreadsheet },
  ],
};