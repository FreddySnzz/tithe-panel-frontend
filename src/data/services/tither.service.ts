import { api } from '@/lib/api';
import { CivilStatus, TitherProfile } from '../types/tither.type';
import { unmaskPhone } from '../utils/formatPhone';

export interface UpdateTitherProfilePayload {
  name?: string;
  phone?: string;
  birthDate?: string;
  phoneSecondary?: string;
  civilStatus?: CivilStatus;
  spouseName?: string;
  spouseBirthDate?: string;
  marriageDate?: string;
  ministry?: string;
  community?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const titherService = {
  getMyProfile(): Promise<TitherProfile> {
    return api.get<TitherProfile>('/tither/me');
  },

  updateMyProfile(payload: UpdateTitherProfilePayload): Promise<TitherProfile> {
    return api.patch<TitherProfile>('/tither/me', {
      ...payload,
      ...(payload.phone && { phone: unmaskPhone(payload.phone) }),
      ...(payload.phoneSecondary !== undefined && {
        phoneSecondary: payload.phoneSecondary
          ? unmaskPhone(payload.phoneSecondary)
          : undefined,
      }),
    });
  },
};