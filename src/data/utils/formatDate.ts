export const formatDate = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

export const formatDateShowingOnlyMonth = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

export const formatDateShowingOnlyYear = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

export const formatDateWithTime = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

export const formatShortDateWithTime = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatDateByFirebase = (dateVal: any) => {
  if (!dateVal) return '';

  let dateObj: Date;

  if (dateVal instanceof Date) {
    dateObj = dateVal;
  } else if (typeof dateVal.toDate === 'function') {
    dateObj = dateVal.toDate();
  } else if (dateVal.seconds !== undefined) {
    dateObj = new Date(dateVal.seconds * 1000);
  } else {
    dateObj = new Date(dateVal);
  }

  if (isNaN(dateObj.getTime())) return '';

  const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
  const localDate = new Date(dateObj.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
};

export const MONTH_NAMES_PT: Record<number, string> = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro',
};

export function formatDateOnlyBR(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  const [year, month, day] = isoString.slice(0, 10).split('-');
  if (!year || !month || !day) return '—';
  return `${day}/${month}/${year}`;
}

export function toDateInputValue(isoString: string | null | undefined): string {
  if (!isoString) return '';
  return isoString.slice(0, 10);
}

export function formatDateTimeBR(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoString));
}