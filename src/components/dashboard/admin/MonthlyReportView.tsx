'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  HandCoins,
  Loader2,
  Search,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { returnService } from '@/data/services/return.service';
import {
  PaymentMethod,
  ParishMonthlyReportResponse,
} from '@/data/types/return.type';
import { formatCentsToBRL } from '@/data/utils/formatCurrency';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { formatDateTimeBR, MONTH_NAMES_PT } from '@/data/utils/formatDate';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  CASH: 'Dinheiro',
  PAYMENT_TICKET: 'Boleto',
};

export function MonthlyReportView() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [reportData, setReportData] = useState<ParishMonthlyReportResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const yearOptions = useMemo(
    () => [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1],
    [now],
  );

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await returnService.getParishMonthlyReport(month, year);
      setReportData(data);
    } catch {
      toast.error('Erro ao carregar o relatório mensal.');
    } finally {
      setIsLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const filteredItems = useMemo(() => {
    if (!reportData) return [];
    const term = search.trim().toLowerCase();

    return reportData.report.filter((item) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PAID' && item.hasReturned) ||
        (statusFilter === 'PENDING' && !item.hasReturned);

      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.phone.includes(term) ||
        (item.community?.toLowerCase().includes(term) ?? false);

      return matchesStatus && matchesSearch;
    });
  }, [reportData, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-tight">
            Relatório Mensal de Adimplência
          </h1>
          <p className="text-xs text-muted-foreground">
            Acompanhe a arrecadação confirmada, dizimistas adimplentes e pendentes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-36 cursor-pointer border-border bg-card font-space-grotesk">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-space-grotesk bg-card border-border">
              <SelectGroup>
                {Object.entries(MONTH_NAMES_PT).map(([num, label]) => (
                  <SelectItem
                    key={num}
                    value={num}
                    className="cursor-pointer focus:bg-primary focus:text-secondary"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-28 cursor-pointer border-border bg-card font-space-grotesk">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-space-grotesk bg-card border-border">
              <SelectGroup>
                {yearOptions.map((yr) => (
                  <SelectItem
                    key={yr}
                    value={String(yr)}
                    className="cursor-pointer focus:bg-primary focus:text-secondary"
                  >
                    {yr}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Arrecadação Confirmada"
          value={formatCentsToBRL(reportData?.totalCollected ?? 0)}
          description={`${MONTH_NAMES_PT[month]}/${year}`}
          icon={HandCoins}
        />
        <StatCard
          label="Total de Dizimistas"
          value={reportData?.totalTithers ?? 0}
          description="Cadastrados na paróquia"
          icon={Users}
        />
        <StatCard
          label="Adimplentes no Mês"
          value={reportData?.totalPaid ?? 0}
          description="Devolução aprovada"
          icon={CheckCircle2}
        />
        <StatCard
          label="Pendentes no Mês"
          value={reportData?.pendingCount ?? 0}
          description="Sem devolução confirmada"
          icon={AlertCircle}
        />
      </section>

      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nome, telefone ou comunidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-none bg-background focus:outline-none"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as 'ALL' | 'PAID' | 'PENDING')
            }
          >
            <SelectTrigger className="w-full sm:w-44 cursor-pointer border-none bg-background font-space-grotesk">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-space-grotesk bg-background border-border">
              <SelectGroup>
                <SelectItem
                  value="ALL"
                  className="cursor-pointer focus:bg-primary focus:text-secondary"
                >
                  Todos ({reportData?.totalTithers ?? 0})
                </SelectItem>
                <SelectItem
                  value="PAID"
                  className="cursor-pointer focus:bg-primary focus:text-secondary"
                >
                  Devolvidos ({reportData?.totalPaid ?? 0})
                </SelectItem>
                <SelectItem
                  value="PENDING"
                  className="cursor-pointer focus:bg-primary focus:text-secondary"
                >
                  Pendentes ({reportData?.pendingCount ?? 0})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-border bg-background/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Dizimista</th>
                  <th className="px-4 py-3 font-semibold">Comunidade</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Forma / Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((row) => (
                  <tr
                    key={row.titherId}
                    className="hover:bg-background/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPhoneMask(row.phone)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.community || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.hasReturned ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                          Devolvido
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground border-border"
                        >
                          Pendente
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {row.hasReturned ? formatCentsToBRL(row.value) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {row.hasReturned && row.paymentMethod
                        ? `${PAYMENT_LABELS[row.paymentMethod]} • ${formatDateTimeBR(row.paidAt)}`
                        : '—'}
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-xs text-muted-foreground"
                    >
                      Nenhum dizimista encontrado para os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}