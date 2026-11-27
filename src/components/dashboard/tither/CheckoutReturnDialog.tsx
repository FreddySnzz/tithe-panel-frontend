'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2, HandCoins } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaymentMethod } from '@/data/types/return.type';
import { returnService } from '@/data/services/return.service';
import {
  formatCurrencyMask,
  parseCurrencyMaskToCents,
} from '@/data/utils/formatCurrency';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { MONTH_NAMES_PT } from '@/data/utils/formatDate';

interface CheckoutReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: number | null;
  year: number;
  onSuccess: () => void;
}

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'PIX' },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito - Em Breve' },
  { value: 'CASH', label: 'Dinheiro (Secretaria / Coleta)' },
  { value: 'PAYMENT_TICKET', label: 'Boleto Bancário - Em Breve' },
];

export function CheckoutReturnDialog({
  open,
  onOpenChange,
  month,
  year,
  onSuccess,
}: CheckoutReturnDialogProps) {
  const [maskedValue, setMaskedValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMaskedValue('');
      setPaymentMethod('PIX');
    }
  }, [open, month]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!month) return;

    const valueInCents = parseCurrencyMaskToCents(maskedValue);
    if (valueInCents <= 0) {
      toast.error('Informe um valor válido maior que R$ 0,00.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await returnService.checkout({
        referenceMonth: month,
        referenceYear: year,
        value: valueInCents,
        paymentMethod,
      });

      toast.success(response.message);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Não foi possível registrar a devolução.';
        
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const monthLabel = month ? MONTH_NAMES_PT[month] : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border font-space-grotesk sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg uppercase tracking-tight">
            Faça sua Devolução do Dízimo
          </DialogTitle>
          <DialogDescription>
            Referência:{' '}
            <span className="font-semibold text-foreground">
              {monthLabel} de {year}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="tithe-value" className="text-sm font-medium">
              Valor da Devolução (R$) *
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                R$
              </span>
              <Input
                id="tithe-value"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={maskedValue}
                onChange={(e) => setMaskedValue(formatCurrencyMask(e.target.value))}
                required
                className={cn(
                  'pl-10 border-none bg-background focus:outline-none text-base font-semibold',
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-method" className="text-sm font-medium">
              Forma de Devolução *
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="payment-method"
                className={cn(
                  'w-full cursor-pointer text-muted-foreground border-none transition-all',
                  'bg-background hover:bg-black/20 font-space-grotesk',
                )}
              >
                <SelectValue placeholder="Selecione a forma..." />
              </SelectTrigger>
              <SelectContent className="font-space-grotesk bg-background text-muted-foreground border border-muted-foreground/20">
                <SelectGroup>
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="cursor-pointer focus:bg-primary focus:text-secondary"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar Devolução
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}