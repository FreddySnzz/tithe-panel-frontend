import { api } from '@/lib/api';
import {
  AnnualCalendarResponse,
  CheckoutReturnPayload,
} from '../types/return.type';

export interface CheckoutReturnResponse {
  message: string;
  id: string;
  status: string;
  value: number;
  paidAt: string;
}

export const returnService = {
  getMyCalendar(year: number): Promise<AnnualCalendarResponse> {
    return api.get<AnnualCalendarResponse>(`/returns/my-calendar?year=${year}`);
  },

  checkout(payload: CheckoutReturnPayload): Promise<CheckoutReturnResponse> {
    return api.post<CheckoutReturnResponse>('/returns/checkout', payload);
  },
};