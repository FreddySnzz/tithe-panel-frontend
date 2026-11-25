export type ReturnStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'CASH' | 'PAYMENT_TICKET';

export interface CalendarMonthItem {
  month: number;
  year: number;
  status: ReturnStatus;
  value: number;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
  returnId: string | null;
}

export interface AnnualCalendarResponse {
  year: number;
  totalReturned: number;
  calendar: CalendarMonthItem[];
}

export interface CheckoutReturnPayload {
  referenceMonth: number;
  referenceYear: number;
  value: number;
  paymentMethod: PaymentMethod;
}

export interface ParishMonthlyReportItem {
  titherId: string;
  userId: string;
  name: string;
  phone: string;
  community: string | null;
  hasReturned: boolean;
  value: number;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
}

export interface ParishMonthlyReportResponse {
  year: number;
  month: number;
  totalTithers: number;
  totalPaid: number;
  pendingCount: number;
  totalCollected: number;
  report: ParishMonthlyReportItem[];
}