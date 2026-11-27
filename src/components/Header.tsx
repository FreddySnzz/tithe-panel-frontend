'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/data/contexts/AuthContext';
import { useParish } from '@/data/contexts/ParishContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import ShatteredHeartIcon from '@/components/icons/ShatteredHeart';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const parish = useParish();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="cursor-pointer text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="h-5" />

          {parish?.logoUrl ? (
            <img
              src={parish.logoUrl}
              alt={parish.name}
              className="h-8 w-8 rounded-lg object-contain shrink-0 md:hidden"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 md:hidden">
              <ShatteredHeartIcon size="1.2rem" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-tight truncate">
              {title ?? parish?.name ?? 'Pastoral do Dízimo'}
            </p>
            {parish?.priest && (
              <p className="text-xs text-muted-foreground truncate hidden sm:block">
                Pároco: {parish.priest}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:inline text-xs text-muted-foreground">
              Paz e bem,{' '}
              <strong className="text-foreground">
                {user.name.split(' ')[0]}
              </strong>
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-foreground cursor-pointer gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}