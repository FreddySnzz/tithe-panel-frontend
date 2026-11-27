'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/data/contexts/AuthContext';
import { useParish } from '@/data/contexts/ParishContext';
import { authService } from '@/data/services/auth.service';
import { parishService } from '@/data/services/parish.service';
import { PublicParishItem } from '@/data/types/parish.type';
import { ApiError } from '@/lib/api';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { TitherFormFields, TitherFormValues } from '@/components/forms/TitherFormFields';
import ShatteredHeartIcon from '@/components/icons/ShatteredHeart';

export default function RegisterPage() {
  const parish = useParish();
  const { login } = useAuth();

  const [publicParishes, setPublicParishes] = useState<PublicParishItem[]>([]);
  const [selectedParishId, setSelectedParishId] = useState(parish?.id ?? '');

  const [password, setPassword] = useState('');
  const [formValues, setFormValues] = useState<TitherFormValues>({
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
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (parish?.id) {
      setSelectedParishId(parish.id);
      return;
    }

    parishService
      .getPublicParishes()
      .then(setPublicParishes)
      .catch(() => toast.error('Não foi possível carregar a lista de paróquias.'));
  }, [parish?.id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedParishId) {
      toast.error('Selecione a sua paróquia.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        parishId: selectedParishId,
        name: formValues.name,
        birthDate: formValues.birthDate,
        phone: formValues.phone,
        phoneSecondary: formValues.phoneSecondary || undefined,
        password,
        civilStatus: formValues.civilStatus,
        spouseName: formValues.civilStatus === 'MARRIED' && formValues.spouseName ? formValues.spouseName : undefined,
        marriageDate: formValues.civilStatus === 'MARRIED' && formValues.marriageDate ? formValues.marriageDate : undefined,
        ministry: formValues.ministry || undefined,
        community: formValues.community || undefined,
        street: formValues.street || undefined,
        neighborhood: formValues.neighborhood || undefined,
        city: formValues.city || undefined,
        state: formValues.state || undefined,
      });

      toast.success(response.message ?? 'Ficha cadastrada com sucesso!');
      login(response.access_token, response.user);
    } catch (err) {
      console.log(err)
      const message = err instanceof ApiError ? err.message : 'Erro ao concluir cadastro.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFieldChange<K extends keyof TitherFormValues>(
    field: K,
    value: TitherFormValues[K],
  ) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10 font-space-grotesk">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ShatteredHeartIcon size="3rem" className="text-muted-foreground" />
          </div>

          <h1 className="text-xl font-bold tracking-tight uppercase">
            Ficha de Cadastro de Dizimista
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {parish
              ? parish.name
              : 'Preencha seus dados para participar da Pastoral do Dízimo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!parish && (
            <div className="space-y-1.5">
              <Label htmlFor="parish" className="text-sm font-medium">
                Paróquia *
              </Label>
              <Select 
                value={selectedParishId}
                onValueChange={(value) => setSelectedParishId(value as string)}
                disabled={isLoading}
              >
                <SelectTrigger 
                  title="Selecione uma paróquia..."
                  aria-label="Selecione uma paróquia..."
                  className={cn("border border-muted-foreground/20 w-full cursor-pointer",
                    "text-muted-foreground border-none transition-all",
                    "bg-background hover:bg-black/20 font-space-grotesk",
                  )}
                >
                  <SelectValue placeholder="Selecione uma paróquia..." className="text-sm font-semibold" />
                </SelectTrigger>
                <SelectContent className="transition-all font-space-grotesk bg-background 
                  text-muted-foreground border border-muted-foreground/20"
                >
                  <SelectGroup>
                    {publicParishes.map((item) => (
                      <SelectItem 
                        key={item.id} 
                        value={item.id} 
                        className="cursor-pointer focus:bg-primary focus:text-secondary"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <TitherFormFields
            values={formValues}
            onChange={handleFieldChange}
            disabled={isLoading}
            extraAccessSlot={
              <div className="space-y-0.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha de Acesso *
                </Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-none bg-background focus:outline-none truncate"
                />
              </div>
            }
          />

          <Button 
            type="submit" 
            className="w-full rounded-lg bg-primary text-primary-foreground 
              font-medium py-2.5 text-sm hover:opacity-90 transition 
              disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Concluir Cadastro
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Já possui cadastro?{' '}
          <Link href="/login" className="text-foreground underline hover:opacity-80">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}