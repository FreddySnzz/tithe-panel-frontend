'use client';

import { useState } from 'react';
import { Check, Hourglass, Loader2, Phone, X } from 'lucide-react';
import { toast } from 'sonner';
import { PendingReturnItem, PaymentMethod } from '@/data/types/return.type';
import { returnService } from '@/data/services/return.service';
import { formatCentsToBRL } from '@/data/utils/formatCurrency';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { formatDateTimeBR, MONTH_NAMES_PT } from '@/data/utils/formatDate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiError } from '@/lib/api';

interface PendingApprovalsViewProps {
  items: PendingReturnItem[];
  onReviewed: () => Promise<void>;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  CASH: 'Dinheiro',
  PAYMENT_TICKET: 'Boleto',
};

export function PendingApprovalsView({
  items,
  onReviewed,
}: PendingApprovalsViewProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleDecision(id: string, action: 'approve' | 'reject') {
    setProcessingId(id);
    try {
      const response =
        action === 'approve'
          ? await returnService.approveReturn(id)
          : await returnService.rejectReturn(id);

      toast.success(response.message);
      await onReviewed();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Erro ao processar aprovação.';
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-lg font-bold uppercase tracking-tight">
          Aprovações Pendentes
        </h1>
        <p className="text-xs text-muted-foreground">
          Confirme o recebimento das devoluções enviadas pelos dizimistas antes de contabilizá-las no relatório.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center space-y-2">
          <Hourglass className="h-8 w-8 text-muted-foreground/50 mx-auto" />
          <p className="text-sm font-medium">
            Nenhuma devolução aguardando aprovação
          </p>
          <p className="text-xs text-muted-foreground">
            Todas as solicitações enviadas pelos dizimistas já foram analisadas.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-border bg-background/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Dizimista</th>
                  <th className="px-4 py-3 font-semibold">Referência</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Forma</th>
                  <th className="px-4 py-3 font-semibold">Solicitado em</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const isBusy = processingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-background/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-foreground">
                          {item.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {formatPhoneMask(item.user.phone)}
                          {item.user.tither?.community &&
                            ` • ${item.user.tither.community}`}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 font-medium">
                        {MONTH_NAMES_PT[item.referenceMonth]}/{item.referenceYear}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-foreground">
                        {formatCentsToBRL(item.value)}
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="border-border">
                          {PAYMENT_LABELS[item.paymentMethod]}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {formatDateTimeBR(item.createdAt)}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => handleDecision(item.id, 'reject')}
                            className="border-destructive/40 text-destructive hover:bg-destructive/15 cursor-pointer gap-1 h-8"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                            Recusar
                          </Button>

                          <Button
                            size="sm"
                            disabled={isBusy}
                            onClick={() => handleDecision(item.id, 'approve')}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer gap-1 h-8"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            Aprovar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}