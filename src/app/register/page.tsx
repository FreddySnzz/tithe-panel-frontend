'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/data/contexts/AuthContext';
import { useParish } from '@/data/contexts/ParishContext';
import { authService } from '@/data/services/auth.service';
import { parishService } from '@/data/services/parish.service';
import { CivilStatus } from '@/data/types/tither.type';
import { PublicParishItem } from '@/data/types/parish.type';
import { formatPhoneMask } from '@/data/utils/formatPhone';
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
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import ShatteredHeartIcon from '@/components/icons/ShatteredHeart';

const CIVIL_STATUS_OPTIONS: { value: CivilStatus; label: string }[] = [
  { value: 'SINGLE', label: 'Solteiro(a)' },
  { value: 'MARRIED', label: 'Casado(a)' },
  { value: 'WIDOWED', label: 'Viúvo(a)' },
  { value: 'OTHER', label: 'Outros' },
];

export default function RegisterPage() {
  const parish = useParish();
  const { login } = useAuth();

  const [publicParishes, setPublicParishes] = useState<PublicParishItem[]>([]);
  const [selectedParishId, setSelectedParishId] = useState(parish?.id ?? '');

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [password, setPassword] = useState('');
  const [civilStatus, setCivilStatus] = useState<CivilStatus>('SINGLE');
  const [spouseName, setSpouseName] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [ministry, setMinistry] = useState('');
  const [community, setCommunity] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

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
        name,
        birthDate,
        phone,
        phoneSecondary: phoneSecondary || undefined,
        password,
        civilStatus,
        spouseName: civilStatus === 'MARRIED' && spouseName ? spouseName : undefined,
        marriageDate: civilStatus === 'MARRIED' && marriageDate ? marriageDate : undefined,
        ministry: ministry || undefined,
        community: community || undefined,
        street: street || undefined,
        neighborhood: neighborhood || undefined,
        city: city || undefined,
        state: state || undefined,
      });

      toast.success(response.message ?? 'Ficha cadastrada com sucesso!');
      login(response.access_token, response.user);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erro ao concluir cadastro.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10 font-space-grotesk">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ShatteredHeartIcon size="3rem" className="text-muted-foreground/50" />
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
                    <SelectItem 
                      value={"Selecione uma paróquia..."} 
                      className="cursor-pointer focus:bg-primary focus:text-secondary"
                    >
                      Selecione uma paróquia...
                    </SelectItem>
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

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider 
              text-muted-foreground border-b border-border pb-2"
            >
              Dados Pessoais e Acesso
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome Completo *
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Ex: Maria de Fátima Silva Barbosa" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="birthDate" className="text-sm font-medium">
                  Nascimento *
                </Label>
                <Input 
                  id="birthDate" 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required 
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefone 1 (Login) *
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
                <Label htmlFor="phoneSecondary" className="text-sm font-medium">
                  Telefone 2 <span className="text-xs text-muted-foreground/40">(opcional)</span>
                </Label>
                <Input 
                  id="phoneSecondary" 
                  type="tel" 
                  placeholder="(86) 98888-8888" 
                  value={phoneSecondary}
                  onChange={(e) => setPhoneSecondary(formatPhoneMask(e.target.value))}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha de Acesso *
                </Label>
                <PasswordInput 
                  id="password" 
                  autoComplete="current-password"
                  value={password}
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider 
              text-muted-foreground border-b border-border pb-2"
            >
              Estado Civil e Comunidade
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="civilStatus" className="text-sm font-medium">
                  Estado Civil *
                </Label>
                <Select 
                  value={civilStatus}
                  onValueChange={(value) => setCivilStatus(value as CivilStatus)}
                  disabled={isLoading}
                >
                  <SelectTrigger 
                    title="Estado civil"
                    aria-label="Estado civil"
                    className={cn("border border-muted-foreground/20 w-full cursor-pointer",
                      "text-muted-foreground border-none transition-all",
                      "bg-background hover:bg-black/20 font-space-grotesk",
                    )}
                  >
                    <SelectValue placeholder="Estado civil" className="text-sm font-semibold" />
                  </SelectTrigger>
                  <SelectContent className="transition-all font-space-grotesk bg-background
                    text-muted-foreground border border-muted-foreground/20"
                  >
                    <SelectGroup>
                      {CIVIL_STATUS_OPTIONS.map((opt) => (
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

              <div className="space-y-1.5">
                <Label htmlFor="community" className="text-sm font-medium">
                  Comunidade / Capela
                </Label>
                <Input 
                  id="community" 
                  type="text" 
                  placeholder="Ex: Matriz / Capela São José" 
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ministry" className="text-sm font-medium">
                  Participa de Pastoral?
                </Label>
                <Input 
                  id="ministry" 
                  type="text" 
                  placeholder="Ex: Liturgia, Catequese" 
                  value={ministry}
                  onChange={(e) => setMinistry(e.target.value)}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>
            </div>

            {civilStatus === 'MARRIED' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="spouseName" className="text-sm font-medium">
                    Nome do Cônjuge
                  </Label>
                  <Input 
                    id="spouseName" 
                    type="text" 
                    placeholder="Nome completo do cônjuge" 
                    value={spouseName}
                    onChange={(e) => setSpouseName(e.target.value)}
                    required 
                    className={cn("border-none bg-background focus:outline-none truncate")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="marriageDate" className="text-sm font-medium">
                    Data do Casamento
                  </Label>
                  <Input 
                    id="marriageDate" 
                    type="date" 
                    value={marriageDate}
                    onChange={(e) => setMarriageDate(e.target.value)}
                    required 
                    className={cn("border-none bg-background focus:outline-none truncate")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider 
              text-muted-foreground border-b border-border pb-2"
            >
              Endereço
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="street" className="text-sm font-medium">
                  Endereço (Rua / Número)
                </Label>
                <Input 
                  id="street" 
                  type="text" 
                  placeholder="Ex: Av. Marechal Castelo Branco, S/N" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="neighborhood" className="text-sm font-medium">
                  Bairro
                </Label>
                <Input 
                  id="neighborhood" 
                  type="text" 
                  placeholder="Ex: Centro" 
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="city" className="text-sm font-medium">
                  Cidade
                </Label>
                <Input 
                  id="city" 
                  type="text" 
                  placeholder="Ex: São Gonçalo do Piauí" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-sm font-medium">
                  Estado (UF)
                </Label>
                <Input 
                  id="state" 
                  type="text" 
                  maxLength={2}
                  placeholder="Ex: PI" 
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  className={cn("border-none bg-background focus:outline-none truncate")}
                />
              </div>
            </div>
          </div>

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