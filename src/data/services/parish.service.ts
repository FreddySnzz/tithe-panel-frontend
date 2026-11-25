import { api } from '@/lib/api';
import { PublicParishItem } from '../types/parish.type';

export const parishService = {
  getPublicParishes(): Promise<PublicParishItem[]> {
    return api.get<PublicParishItem[]>('/parishes/public');
  },
};