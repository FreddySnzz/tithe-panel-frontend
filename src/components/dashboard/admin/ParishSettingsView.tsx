'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ImagePlus, Loader2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/data/contexts/AuthContext';
import { parishService } from '@/data/services/parish.service';
import { ParishDetails } from '@/data/types/parish.type';
import { formatPhoneMask } from '@/data/utils/formatPhone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';

const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ParishSettingsView() {
  const { user } = useAuth();
  const [parish, setParish] = useState<ParishDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [priest, setPriest] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#18181b');
  const [secondaryColor, setSecondaryColor] = useState('#f4f4f5');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (!user?.parishId) return;

    parishService
      .getById(user.parishId)
      .then((data) => {
        setParish(data);
        setName(data.name);
        setPriest(data.priest ?? '');
        setPhone(formatPhoneMask(data.phone));
        if (data.themePrimaryColor) setPrimaryColor(data.themePrimaryColor);
        if (data.themeSecondaryColor) setSecondaryColor(data.themeSecondaryColor);
        setPreviewUrl(data.logoUrl);
      })
      .catch(() => toast.error('Erro ao carregar dados da paróquia.'))
      .finally(() => setIsLoading(false));
  }, [user?.parishId]);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error('Formato inválido. Envie PNG, JPG ou WebP.');
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      toast.error('A imagem excede o limite de 2 MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUploadLogo() {
    if (!parish || !selectedFile) return;

    setIsUploadingLogo(true);
    try {
      const updated = await parishService.uploadLogo(parish.id, selectedFile);
      setParish(updated);
      setPreviewUrl(updated.logoUrl);
      setSelectedFile(null);
      toast.success('Brasão atualizado com sucesso!');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Falha ao enviar logo.';
      toast.error(message);
    } finally {
      setIsUploadingLogo(false);
    }
  }

  async function handleSaveDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!parish) return;

    setIsSavingDetails(true);
    try {
      const updated = await parishService.update(parish.id, {
        name,
        priest: priest || undefined,
        phone,
        themePrimaryColor: primaryColor,
        themeSecondaryColor: secondaryColor,
      });

      setParish(updated);
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--secondary', secondaryColor);
      toast.success('Configurações da paróquia salvas!');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Erro ao salvar configurações.';
      toast.error(message);
    } finally {
      setIsSavingDetails(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold uppercase tracking-tight">
          Dados e Identidade Visual da Paróquia
        </h1>
        <p className="text-xs text-muted-foreground">
          Personalize o brasão, informações de contato e as cores aplicadas ao portal dos dizimistas.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Brasão da paróquia"
                  className="h-full w-full object-contain p-1.5"
                />
              ) : (
                <ImagePlus className="h-7 w-7 text-muted-foreground/50" />
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-tight">
                Brasão / Logo da Paróquia
              </h2>
              <p className="text-xs text-muted-foreground">
                PNG, JPG ou WebP com até 2 MB. Exibido no login, cadastro e cabeçalho.
              </p>
              <div className="pt-1">
                <Label
                  htmlFor="parish-logo-input"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-background hover:bg-black/20 cursor-pointer"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Selecionar Imagem
                </Label>
                <Input
                  id="parish-logo-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {selectedFile && (
            <Button
              type="button"
              onClick={handleUploadLogo}
              disabled={isUploadingLogo}
              className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer gap-2 shrink-0"
            >
              {isUploadingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Enviar Logo
            </Button>
          )}
        </div>
      </section>

      <form
        onSubmit={handleSaveDetails}
        className="rounded-xl border border-border bg-card p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="parish-name">Nome da Paróquia *</Label>
            <Input
              id="parish-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-none bg-background focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="parish-priest">Pároco Responsável</Label>
            <Input
              id="parish-priest"
              placeholder="Pe. João Batista"
              value={priest}
              onChange={(e) => setPriest(e.target.value)}
              className="border-none bg-background focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="parish-phone">Telefone da Secretaria *</Label>
            <Input
              id="parish-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
              required
              className="border-none bg-background focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="parish-primary">Cor Primária (Botões/Destaques)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="parish-primary"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-12 p-1 border-none bg-background cursor-pointer"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="border-none bg-background font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="parish-secondary">Cor Secundária</Label>
            <div className="flex items-center gap-2">
              <Input
                id="parish-secondary"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-9 w-12 p-1 border-none bg-background cursor-pointer"
              />
              <Input
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="border-none bg-background font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSavingDetails}
            className="bg-primary text-primary-foreground hover:opacity-90 cursor-pointer gap-2"
          >
            {isSavingDetails ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}