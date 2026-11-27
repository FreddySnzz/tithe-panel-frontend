'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  HandCoins,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { titherService } from '@/data/services/tither.service';
import { returnService } from '@/data/services/return.service';
import { CivilStatus, TitherProfile } from '@/data/types/tither.type';
import {
  AnnualCalendarResponse,
  CalendarMonthItem,
  PaymentMethod,
} from '@/data/types/return.type';
import { formatCentsToBRL } from '@/data/utils/formatCurrency';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import {
  formatDateOnlyBR,
  formatDateTimeBR,
  MONTH_NAMES_PT,
} from '@/data/utils/formatDate';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { ReturnStatusBadge } from '@/components/dashboard/shared/ReturnStatusBadge';
import { CheckoutReturnDialog } from './CheckoutReturnDialog';
import { EditTitherProfileDialog } from './EditTitherProfileDialog';
import { cn } from '@/lib/utils';

const CIVIL_STATUS_LABELS: Record<CivilStatus, string> = {
  SINGLE: 'Solteiro(a)',
  MARRIED: 'Casado(a)',
  WIDOWED: 'Viúvo(a)',
  OTHER: 'Outros',
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  CASH: 'Dinheiro',
  PAYMENT_TICKET: 'Boleto',
};

export function TitherDashboard() {
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [profile, setProfile] = useState<TitherProfile | null>(null);
  const [calendarData, setCalendarData] = useState<AnnualCalendarResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const [checkoutMonth, setCheckoutMonth] = useState<number | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const yearOptions = useMemo(
    () => [currentYear - 1, currentYear, currentYear + 1],
    [currentYear],
  );

  const loadDashboardData = useCallback(async (year: number) => {
    setIsLoading(true);
    try {
      const [profileRes, calendarRes] = await Promise.all([
        titherService.getMyProfile(),
        returnService.getMyCalendar(year),
      ]);
      setProfile(profileRes);
      setCalendarData(calendarRes);
    } catch {
      toast.error('Erro ao carregar os dados do dizimista.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(selectedYear);
  }, [selectedYear, loadDashboardData]);

  const { paidMonthsCount, awaitingCount } = useMemo(() => {
    if (!calendarData) return { paidMonthsCount: 0, awaitingCount: 0 };
    return {
      paidMonthsCount: calendarData.calendar.filter((i) => i.status === 'PAID')
        .length,
      awaitingCount: calendarData.calendar.filter(
        (i) => i.status === 'PENDING' && Boolean(i.returnId),
      ).length,
    };
  }, [calendarData]);

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Carregando o dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Devolvido"
              value={formatCentsToBRL(calendarData?.totalReturned ?? 0)}
              description={`Contribuições confirmadas em ${selectedYear}`}
            />

            <StatCard
              label={`Fidelidade Mensal - ${selectedYear}`}
              value={
                <>
                  {paidMonthsCount}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    / 12 meses
                  </span>
                </>
              }
              description={
                awaitingCount > 0
                  ? `${awaitingCount} devolução(ões) aguardando confirmação`
                  : `${12 - paidMonthsCount} mês(es) pendente(s)`
              }
            />

            <StatCard
              label="Secretaria Paroquial"
              value={<span className="text-base">Atendimento</span>}
              description={
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {profile?.parish.phone
                    ? formatPhoneMask(profile.parish.phone)
                    : 'Não informado'}
                </span>
              }
            />
          </section>

          <section className="space-y-4">
            <div className="flex flex-row sm:items-center justify-between gap-3 ">
              <div>
                <h1 className="text-lg font-bold uppercase tracking-tight">
                  Minhas Devoluções
                </h1>
                <p className="text-xs text-muted-foreground">
                  Acompanhe seu calendário de dizimista ou solicite uma devolução.
                </p>
              </div>

              <div className="w-36">
                <Select
                  value={String(selectedYear)}
                  onValueChange={(val) => setSelectedYear(Number(val))}
                >
                  <SelectTrigger className="w-full cursor-pointer text-foreground border border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectGroup>
                      {yearOptions.map((yr) => (
                        <SelectItem
                          key={yr}
                          value={String(yr)}
                          className="cursor-pointer focus:bg-primary focus:text-secondary"
                        >
                          Ano {yr}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {calendarData?.calendar.map((item: CalendarMonthItem) => {
                const isPaid = item.status === 'PAID';
                const isAwaitingApproval =
                  item.status === 'PENDING' && Boolean(item.returnId);

                return (
                  <div
                    key={item.month}
                    className={cn(
                      'rounded-xl border p-5 flex flex-col justify-between transition-all',
                      isPaid
                        ? 'border-primary/40 bg-card'
                        : isAwaitingApproval
                          ? 'border-amber-500/40 bg-card'
                          : 'border-border bg-card/60 hover:border-muted-foreground/40',
                    )}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-base">
                          {MONTH_NAMES_PT[item.month]}
                        </span>
                        <ReturnStatusBadge
                          status={item.status}
                          hasSubmission={Boolean(item.returnId)}
                        />
                      </div>

                      {isPaid || isAwaitingApproval ? (
                        <div className="space-y-1 pt-1">
                          <p className="text-xl font-bold text-foreground">
                            {formatCentsToBRL(item.value)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Via{' '}
                            {item.paymentMethod
                              ? PAYMENT_METHOD_LABELS[item.paymentMethod]
                              : '—'}
                            {isPaid && item.paidAt
                              ? ` • ${formatDateTimeBR(item.paidAt)}`
                              : ''}
                          </p>
                          {/* <p className="text-[0.6rem] text-muted-foreground">
                            às ` • ${formatDateTimeBR(item.)}`
                          </p> */}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground pt-1">
                          {item.status === 'CANCELLED'
                            ? 'Solicitação anterior recusada. Você pode reenviar.'
                            : 'Nenhuma devolução registrada para este mês.'}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/60">
                      {isPaid ? (
                        <span className="text-xs text-emerald-400/90 font-medium block text-center py-1">
                          Contribuição confirmada
                        </span>
                      ) : isAwaitingApproval ? (
                        <span className="text-xs text-amber-400/90 font-medium block text-center py-1">
                          Aguardando aprovação da secretaria
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setCheckoutMonth(item.month)}
                          className="w-full bg-primary text-primary-foreground hover:opacity-90 cursor-pointer text-xs font-medium"
                        >
                          Devolver Dízimo
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {activeTab === 'profile' && profile && (
        <section className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div>
                <h2 className="text-base font-bold uppercase tracking-tight">
                  Minha Ficha Cadastral
                </h2>
                <p className="text-xs text-muted-foreground">
                  Dados registrados na Pastoral do Dízimo
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(true)}
              className="cursor-pointer gap-1.5 border-border bg-background hover:bg-black/20"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar Cadastro
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Nome Completo</p>
              <p className="font-medium mt-0.5">{profile.user.name}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Telefone Principal</p>
              <p className="font-medium mt-0.5">
                {formatPhoneMask(profile.user.phone)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Telefone Secundário</p>
              <p className="font-medium mt-0.5">
                {formatPhoneMask(profile.phoneSecondary || '—')}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium mt-0.5">
                {formatDateOnlyBR(profile.birthDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Estado Civil</p>
              <p className="font-medium mt-0.5">
                {CIVIL_STATUS_LABELS[profile.civilStatus]}
              </p>
            </div>

            {profile.civilStatus === 'MARRIED' && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Cônjuge</p>
                  <p className="font-medium mt-0.5">
                    {profile.spouseName || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Data do Casamento
                  </p>
                  <p className="font-medium mt-0.5">
                    {formatDateOnlyBR(profile.marriageDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Data de Nasc. Cônjuge
                  </p>
                  <p className="font-medium mt-0.5">
                    {formatDateOnlyBR(profile.spouseBirthDate || '—')}
                  </p>
                </div>
              </>
            )}

            <div>
              <p className="text-xs text-muted-foreground">
                Comunidade / Capela
              </p>
              <p className="font-medium mt-0.5">{profile.community || '—'}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Pastoral / Movimento
              </p>
              <p className="font-medium mt-0.5">{profile.ministry || '—'}</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 pt-2 border-t border-border/60 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Endereço</p>
                <p className="font-medium mt-0.5">
                  {[
                    profile.address,
                    profile.neighborhood,
                    profile.zipCode,
                    profile.city && profile.state
                      ? `${profile.city} - ${profile.state}`
                      : profile.city || profile.state,
                  ]
                    .filter(Boolean)
                    .join(', ') || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <CheckoutReturnDialog
        open={checkoutMonth !== null}
        onOpenChange={(open) => {
          if (!open) setCheckoutMonth(null);
        }}
        month={checkoutMonth}
        year={selectedYear}
        onSuccess={() => loadDashboardData(selectedYear)}
      />

      {profile && (
        <EditTitherProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          profile={profile}
          onUpdated={(updated) => setProfile(updated)}
        />
      )}
    </DashboardShell>
  );
}