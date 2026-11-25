import { Role } from './user.type';

export type CivilStatus = 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'OTHER';

export interface TitherProfile {
  id: string;
  userId: string;
  parishId: string;
  phoneSecondary: string | null;
  birthDate: string;
  ministry: string | null;
  civilStatus: CivilStatus;
  spouseName: string | null;
  marriageDate: string | null;
  community: string | null;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  user: {
    id: string;
    name: string;
    phone: string;
    role: Role;
    active: boolean;
  };
  parish: {
    id: string;
    name: string;
    phone: string;
    priest: string | null;
    logoUrl: string | null;
    themePrimaryColor: string | null;
    themeSecondaryColor: string | null;
  };
}