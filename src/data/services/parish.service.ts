import { api } from '@/lib/api';
import { ParishDetails, PublicParishItem } from '../types/parish.type';

export interface UpdateParishPayload {
  name?: string;
  phone?: string;
  document?: string;
  priest?: string;
  themePrimaryColor?: string;
  themeSecondaryColor?: string;
}

export const parishService = {
  getPublicParishes(): Promise<PublicParishItem[]> {
    return api.get<PublicParishItem[]>('/parishes/public');
  },

  getById(id: string): Promise<ParishDetails> {
    return api.get<ParishDetails>(`/parishes/${id}`);
  },

  update(id: string, payload: UpdateParishPayload): Promise<ParishDetails> {
    return api.patch<ParishDetails>(`/parishes/${id}`, payload);
  },

  uploadLogo(id: string, file: File): Promise<ParishDetails> {
    const formData = new FormData();
    formData.append('file', file);
    return api.patch<ParishDetails>(`/parishes/${id}/logo`, formData);
  },
};