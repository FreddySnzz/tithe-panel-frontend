'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { titherService } from '@/data/services/tither.service';
import { TitherProfile } from '@/data/types/tither.type';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { formatDateOnlyBR, toDateInputValue } from '@/data/utils/formatDate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TitherFormFields,
  TitherFormValues,
} from '@/components/forms/TitherFormFields';
import { ApiError } from '@/lib/api';

const EMPTY_FORM: TitherFormValues = {
  name: '',
  birthDate: '',
  phone: '',
  phoneSecondary: '',
  civilStatus: 'SINGLE',
  spouseName: '',
  spouseBirthDate: '',
  marriageDate: '',
  community: '',
  ministry: '',
  address: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
};

export function TithersManagementView() {
  const [tithers, setTithers] = useState<TitherProfile[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTither, setEditingTither] = useState<TitherProfile | null>(null);
  const [formValues, setFormValues] = useState<TitherFormValues>(EMPTY_FORM);
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadTithers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await titherService.getAllParishTithers();
      setTithers(data);
    } catch {
      toast.error('Erro ao carregar lista de dizimistas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTithers();
  }, [loadTithers]);

  function openCreateDialog() {
    setEditingTither(null);
    setFormValues(EMPTY_FORM);
    setPassword('');
    setDialogOpen(true);
  }

  function openEditDialog(tither: TitherProfile) {
    setEditingTither(tither);
    setFormValues({
      name: tither.user.name,
      birthDate: toDateInputValue(tither.birthDate),
      phone: formatPhoneMask(tither.user.phone),
      phoneSecondary: tither.phoneSecondary
        ? formatPhoneMask(tither.phoneSecondary)
        : '',
      civilStatus: tither.civilStatus,
      spouseName: tither.spouseName ?? '',
      spouseBirthDate: toDateInputValue(tither.spouseBirthDate),
      marriageDate: toDateInputValue(tither.marriageDate),
      community: tither.community ?? '',
      ministry: tither.ministry ?? '',
      address: tither.address ?? '',
      neighborhood: tither.neighborhood ?? '',
      city: tither.city ?? '',
      state: tither.state ?? '',
      zipCode: tither.zipCode ?? '',
    });
    setDialogOpen(true);
  }

  function handleFieldChange<K extends keyof TitherFormValues>(
    field: K,
    value: TitherFormValues[K],
  ) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formValues.name,
      phone: formValues.phone,
      birthDate: formValues.birthDate,
      phoneSecondary: formValues.phoneSecondary || undefined,
      civilStatus: formValues.civilStatus,
      spouseName:
        formValues.civilStatus === 'MARRIED' ? formValues.spouseName : undefined,
      spouseBirthDate:
        formValues.civilStatus === 'MARRIED'
          ? formValues.spouseBirthDate
          : undefined,
      marriageDate:
        formValues.civilStatus === 'MARRIED'
          ? formValues.marriageDate
          : undefined,
      community: formValues.community || undefined,
      ministry: formValues.ministry || undefined,
      address: formValues.address || undefined,
      neighborhood: formValues.neighborhood || undefined,
      city: formValues.city || undefined,
      state: formValues.state || undefined,
      zipCode: formValues.zipCode || undefined,
    };

    try {
      if (editingTither) {
        await titherService.updateByAdmin(editingTither.id, payload);
        toast.success('Cadastro do dizimista atualizado!');
      } else {
        await titherService.createByAdmin({ ...payload, password });
        toast.success('Dizimista cadastrado com sucesso!');
      }
      setDialogOpen(false);
      await loadTithers();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Erro ao salvar ficha.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tithers;
    return tithers.filter(
      (t) =>
        t.user.name.toLowerCase().includes(term) ||
        t.user.phone.includes(term) ||
        (t.community?.toLowerCase().includes(term) ?? false),
    );
  }, [tithers, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-tight">
            Dizimistas da Paróquia
          </h1>
          <p className="text-xs text-muted-foreground">
            Consulte fichas cadastrais, atualize endereços ou realize cadastros presenciais.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Novo Dizimista
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar dizimista..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-none bg-background focus:outline-none"
            />
          </div>
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
                  <th className="px-4 py-3 font-semibold">Nome / Telefone</th>
                  <th className="px-4 py-3 font-semibold">Nascimento</th>
                  <th className="px-4 py-3 font-semibold">Comunidade / Pastoral</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-background/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{t.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPhoneMask(t.user.phone)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateOnlyBR(t.birthDate)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {[t.community, t.ministry].filter(Boolean).join(' • ') ||
                        '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(t)}
                        className="cursor-pointer gap-1.5 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar Ficha
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border font-space-grotesk sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg uppercase tracking-tight">
              {editingTither
                ? 'Editar Ficha do Dizimista'
                : 'Cadastro Presencial de Dizimista'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados cadastrais vinculados à paróquia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <TitherFormFields
              values={formValues}
              onChange={handleFieldChange}
              disabled={isSaving}
              extraAccessSlot={
                !editingTither ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-tither-pass">Senha Inicial *</Label>
                    <PasswordInput
                      id="admin-tither-pass"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      required
                      className="border-none bg-background focus:outline-none truncate"
                    />
                  </div>
                ) : undefined
              }
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingTither ? 'Salvar Alterações' : 'Cadastrar Dizimista'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}