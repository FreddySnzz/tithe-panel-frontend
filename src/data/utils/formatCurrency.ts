export function formatCentsToBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function formatCurrencyMask(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, '');
  if (!digits) return '';

  const numericValue = Number(digits) / 100;
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyMaskToCents(maskedValue: string): number {
  const digits = maskedValue.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}