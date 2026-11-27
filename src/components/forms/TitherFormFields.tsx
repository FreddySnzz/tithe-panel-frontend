'use client';

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
import { CivilStatus } from '@/data/types/tither.type';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { cn } from '@/lib/utils';

export const CIVIL_STATUS_OPTIONS: { value: CivilStatus; label: string }[] = [
  { value: 'SINGLE', label: 'Solteiro(a)' },
  { value: 'MARRIED', label: 'Casado(a)' },
  { value: 'WIDOWED', label: 'Viúvo(a)' },
  { value: 'OTHER', label: 'Outros' },
];

export interface TitherFormValues {
  name: string;
  birthDate: string;
  phone: string;
  phoneSecondary: string;
  civilStatus: CivilStatus;
  spouseName: string;
  spouseBirthDate: string;
  marriageDate: string;
  community: string;
  ministry: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface TitherFormFieldsProps {
  values: TitherFormValues;
  onChange: <K extends keyof TitherFormValues>(
    field: K,
    value: TitherFormValues[K],
  ) => void;
  disabled?: boolean;
  extraAccessSlot?: React.ReactNode;
}

export function TitherFormFields({
  values,
  onChange,
  disabled,
  extraAccessSlot,
}: TitherFormFieldsProps) {
  const inputClass = cn(
    'border-none bg-background focus:outline-none truncate',
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
          Dados Pessoais e Contato
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="tither-name">Nome Completo *</Label>
            <Input
              id="tither-name"
              type="text"
              placeholder="Ex: Maria de Fátima dos Santos"
              value={values.name}
              onChange={(e) => onChange('name', e.target.value)}
              disabled={disabled}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tither-birthDate">Nascimento *</Label>
            <Input
              id="tither-birthDate"
              type="date"
              value={values.birthDate}
              onChange={(e) => onChange('birthDate', e.target.value)}
              disabled={disabled}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tither-phone">Telefone 1 (Login) *</Label>
            <Input
              id="tither-phone"
              type="tel"
              placeholder="(86) 99999-9999"
              value={values.phone}
              onChange={(e) =>
                onChange('phone', formatPhoneMask(e.target.value))
              }
              disabled={disabled}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tither-phone2">
              Telefone 2{' '}
              <span className="text-xs text-muted-foreground/50">(opcional)</span>
            </Label>
            <Input
              id="tither-phone2"
              type="tel"
              placeholder="(86) 98888-8888"
              value={values.phoneSecondary}
              onChange={(e) =>
                onChange('phoneSecondary', formatPhoneMask(e.target.value))
              }
              disabled={disabled}
              className={inputClass}
            />
          </div>

          {extraAccessSlot}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
          Estado Civil e Comunidade
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tither-civilStatus">Estado Civil *</Label>
            <Select
              value={values.civilStatus}
              onValueChange={(val) =>
                onChange('civilStatus', val as CivilStatus)
              }
              disabled={disabled}
            >
              <SelectTrigger
                id="tither-civilStatus"
                className="w-full cursor-pointer text-muted-foreground border-none bg-background hover:bg-black/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background text-muted-foreground border border-muted-foreground/20">
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
            <Label htmlFor="tither-community">
              Comunidade / Capela
              <span className="block sm:hidden text-xs text-muted-foreground/50">(opcional)</span>
            </Label>
            <Input
              id="tither-community"
              type="text"
              placeholder="Ex: Matriz / Capela São José"
              value={values.community}
              onChange={(e) => onChange('community', e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tither-ministry">
              Pastoral / Movimento
              <span className="block sm:hidden text-xs text-muted-foreground/50">(opcional)</span>
            </Label>
            <Input
              id="tither-ministry"
              type="text"
              placeholder="Ex: Liturgia, Catequese"
              value={values.ministry}
              onChange={(e) => onChange('ministry', e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          </div>
        </div>

        {values.civilStatus === 'MARRIED' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="tither-spouseName">Nome do Cônjuge *</Label>
              <Input
                id="tither-spouseName"
                type="text"
                placeholder="Nome completo do cônjuge"
                value={values.spouseName}
                onChange={(e) => onChange('spouseName', e.target.value)}
                disabled={disabled}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tither-spouseBirthDate">Nascimento do Cônjuge</Label>
              <Input
                id="tither-spouseBirthDate"
                type="date"
                value={values.spouseBirthDate}
                onChange={(e) => onChange('spouseBirthDate', e.target.value)}
                disabled={disabled}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tither-marriageDate">Data do Casamento *</Label>
              <Input
                id="tither-marriageDate"
                type="date"
                value={values.marriageDate}
                onChange={(e) => onChange('marriageDate', e.target.value)}
                disabled={disabled}
                required
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
          Endereço
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="tither-address">Endereço (Rua / Número)</Label>
            <Input
              id="tither-address"
              type="text"
              placeholder="Ex: Av. Marechal Castelo Branco, S/N"
              value={values.address}
              onChange={(e) => onChange('address', e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tither-neighborhood">Bairro</Label>
            <Input
              id="tither-neighborhood"
              type="text"
              placeholder="Ex: Centro"
              value={values.neighborhood}
              onChange={(e) => onChange('neighborhood', e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tither-city">Cidade</Label>
            <Input
              id="tither-city"
              type="text"
              placeholder="Ex: São Gonçalo do Piauí"
              value={values.city}
              onChange={(e) => onChange('city', e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tither-state">Estado (UF)</Label>
            <Input
              id="tither-state"
              type="text"
              maxLength={2}
              placeholder="Ex: PI"
              value={values.state}
              onChange={(e) => onChange('state', e.target.value.toUpperCase())}
              disabled={disabled}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tither-zipcode">
              CEP
              <span className="block sm:hidden text-xs text-muted-foreground/50">(opcional)</span>
            </Label>
            <Input
              id="tither-zipcode"
              type="number"
              placeholder="Ex: 64000-000"
              value={values.zipCode}
              onChange={(e) => onChange('zipCode', e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}