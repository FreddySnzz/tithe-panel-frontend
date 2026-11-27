'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Church, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/data/contexts/AuthContext';
import { useParish } from '@/data/contexts/ParishContext';
import { authService } from '@/data/services/auth.service';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { ApiError } from '@/lib/api';
import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ShatteredHeartIcon from '@/components/icons/ShatteredHeart';

export default function LoginPage() {
  const parish = useParish();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ phone, password });

      if (
        parish &&
        response.user.role !== 'SUPER_ADMIN' &&
        response.user.parishId !== parish.id
      ) {
        toast.error('Este usuário não pertence a esta paróquia.');
        return;
      }

      toast.success(`Bem-vindo(a), ${response.user.name}!`);
      login(response.access_token, response.user);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Falha ao realizar login.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <ShatteredHeartIcon size="3rem" className="text-muted-foreground" />
          </div>

          <h1 className="text-xl font-bold tracking-tight uppercase">
            {parish ? parish.name : 'Pastoral do Dízimo'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Entre com seu telefone e senha para acessar sua ficha e devoluções.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium">
              Telefone (WhatsApp)
            </Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="(86) 99999-9999" 
              value={phone}
              onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
              required 
              className={cn("border-none bg-background focus:outline-none truncate")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <PasswordInput 
              id="password" 
              autoComplete="current-password"
              value={password}
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              required 
              className={cn("border-zinc-900 bg-primary focus:outline-none")}
            />
            {/* <div className="relative">
            </div> */}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary text-primary-foreground 
              font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-50 
              flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ainda não é dizimista cadastrado?{' '}
          <Link href="/register" className="text-foreground underline hover:opacity-80">
            Preencher ficha de cadastro
          </Link>
        </p>
      </div>
    </main>
  );
}