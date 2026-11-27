'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { CivilStatus, TitherProfile } from '@/data/types/tither.type';
import { titherService } from '@/data/services/tither.service';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toDateInputValue } from '@/data/utils/formatDate';
import { TitherFormFields, TitherFormValues } from '@/components/forms/TitherFormFields';

interface EditTitherProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: TitherProfile;
  onUpdated: (updated: TitherProfile) => void;
}

const CIVIL_STATUS_OPTIONS: { value: CivilStatus; label: string }[] = [
  { value: 'SINGLE', label: 'Solteiro(a)' },
  { value: 'MARRIED', label: 'Casado(a)' },
  { value: 'WIDOWED', label: 'Viúvo(a)' },
  { value: 'OTHER', label: 'Outros' },
];

export function EditTitherProfileDialog({
  open,
  onOpenChange,
  profile,
  onUpdated,
}: EditTitherProfileDialogProps) {
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
  const [isSaving, setIsSaving] = useState(false);

  function handleFieldChange<K extends keyof TitherFormValues>(
    field: K,
    value: TitherFormValues[K],
  ) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (open && profile) {
      handleFieldChange('name', profile.user.name);
      handleFieldChange('phone', profile.user.phone);
      handleFieldChange('phoneSecondary', profile.phoneSecondary ? formatPhoneMask(profile.phoneSecondary) : '');
      handleFieldChange('birthDate', toDateInputValue(profile.birthDate));
      handleFieldChange('civilStatus', profile.civilStatus);
      handleFieldChange('spouseName', profile.spouseName ?? '');
      handleFieldChange('spouseBirthDate', toDateInputValue(profile.spouseBirthDate));
      handleFieldChange('marriageDate', toDateInputValue(profile.marriageDate));
      handleFieldChange('community', profile.community ?? '');
      handleFieldChange('ministry', profile.ministry ?? '');
      handleFieldChange('street', profile.street ?? '');
      handleFieldChange('neighborhood', profile.neighborhood ?? '');
      handleFieldChange('city', profile.city ?? '');
      handleFieldChange('state', profile.state ?? '');
      handleFieldChange('zipCode', profile.zipCode ?? '');
    }
  }, [open, profile]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await titherService.updateMyProfile({
        name: formValues.name,
        phone: formValues.phone,
        birthDate: formValues.birthDate,
        phoneSecondary: formValues.phoneSecondary,
        civilStatus: formValues.civilStatus,
        spouseName: formValues.civilStatus === 'MARRIED' ? formValues.spouseName : undefined,
        marriageDate: formValues.civilStatus === 'MARRIED' ? formValues.marriageDate : undefined,
        community: formValues.community || undefined,
        ministry: formValues.ministry || undefined,
        street: formValues.street || undefined,
        neighborhood: formValues.neighborhood || undefined,
        city: formValues.city || undefined,
        state: formValues.state || undefined,
      });

      toast.success('Dados cadastrais atualizados com sucesso!');
      onUpdated({ ...profile, ...updated });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao atualizar cadastro.';
        
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border font-space-grotesk sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg uppercase tracking-tight">
            Atualizar Ficha Cadastral
          </DialogTitle>
          <DialogDescription>
            Mantenha seus dados pessoais, pastorais e de endereço atualizados junto à secretaria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <TitherFormFields
            values={formValues}
            onChange={handleFieldChange}
            disabled={isSaving}
          />

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}