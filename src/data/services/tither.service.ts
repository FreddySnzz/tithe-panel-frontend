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
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const titherService = {
  getAllParishTithers(): Promise<TitherProfile[]> {
    return api.get<TitherProfile[]>('/tither');
  },

  getMyProfile(): Promise<TitherProfile> {
    return api.get<TitherProfile>('/tither/me');
  },

  createByAdmin(
    payload: UpdateTitherProfilePayload & { password: string },
  ): Promise<TitherProfile> {
    return api.post<TitherProfile>('/tither', {
      ...payload,
      ...(payload.phone && { phone: unmaskPhone(payload.phone) }),
      ...(payload.phoneSecondary && {
        phoneSecondary: unmaskPhone(payload.phoneSecondary),
      }),
    });
  },

  updateByAdmin(
    titherId: string,
    payload: UpdateTitherProfilePayload,
  ): Promise<TitherProfile> {
    return api.patch<TitherProfile>(`/tither/${titherId}`, {
      ...payload,
      ...(payload.phone && { phone: unmaskPhone(payload.phone) }),
      ...(payload.phoneSecondary !== undefined && {
        phoneSecondary: payload.phoneSecondary
          ? unmaskPhone(payload.phoneSecondary)
          : undefined,
      }),
    });
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