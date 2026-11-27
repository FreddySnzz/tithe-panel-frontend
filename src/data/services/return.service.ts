import { api } from '@/lib/api';
import {
  AnnualCalendarResponse,
  CheckoutReturnPayload,
  ParishMonthlyReportResponse,
  PendingReturnItem,
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

  getPendingReturns(): Promise<PendingReturnItem[]> {
    return api.get<PendingReturnItem[]>('/returns/pending');
  },

  approveReturn(id: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/returns/${id}/approve`);
  },

  rejectReturn(id: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/returns/${id}/reject`);
  },

  getParishMonthlyReport(
    month: number,
    year: number,
  ): Promise<ParishMonthlyReportResponse> {
    return api.get<ParishMonthlyReportResponse>(
      `/returns/report?month=${month}&year=${year}`,
    );
  },
};