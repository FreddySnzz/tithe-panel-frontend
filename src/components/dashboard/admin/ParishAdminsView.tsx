'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Loader2, ShieldPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/data/contexts/AuthContext';
import { userService } from '@/data/services/user.service';
import { UserListItem } from '@/data/types/user.type';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError } from '@/lib/api';

export function ParishAdminsView() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await userService.getUsers();
      setAdmins(users.filter((u) => u.role === 'PARISH_ADMIN'));
    } catch {
      toast.error('Erro ao carregar administradores.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  async function handleCreateAdmin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.parishId) return;

    setIsSaving(true);
    try {
      await userService.createParishAdmin({
        name,
        phone,
        password,
        parishId: user.parishId,
      });
      toast.success('Administrador da paróquia cadastrado!');
      setOpenCreate(false);
      setName('');
      setPhone('');
      setPassword('');
      await loadAdmins();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Erro ao criar administrador.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive(targetId: string) {
    try {
      await userService.toggleActive(targetId);
      toast.success('Status de acesso atualizado.');
      await loadAdmins();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Erro ao alterar status.';
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-tight">
            Administradores e Agentes
          </h1>
          <p className="text-xs text-muted-foreground">
            Gerencie quem pode aprovar devoluções e administrar os cadastros da paróquia.
          </p>
        </div>

        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer gap-2"
        >
          <ShieldPlus className="h-4 w-4" />
          Novo Administrador
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-border bg-background/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Telefone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-background/40">
                    <td className="px-4 py-3 font-medium">{admin.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPhoneMask(admin.phone)}
                    </td>
                    <td className="px-4 py-3">
                      {admin.active ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inativo
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {admin.id !== user?.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(admin.id)}
                          className="cursor-pointer text-xs"
                        >
                          {admin.active ? 'Desativar' : 'Reativar'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="bg-card border-border font-space-grotesk sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg uppercase tracking-tight">
              Novo Administrador Paroquial
            </DialogTitle>
            <DialogDescription>
              Este usuário terá acesso à aprovação de dízimos e cadastros desta paróquia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-name">Nome Completo *</Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-none bg-background focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-phone">Telefone (Login) *</Label>
              <Input
                id="admin-phone"
                type="tel"
                placeholder="(86) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
                required
                className="border-none bg-background focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-pass">Senha *</Label>
              <PasswordInput
                id="admin-pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-none bg-background focus:outline-none"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenCreate(false)}
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
                Criar Acesso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}