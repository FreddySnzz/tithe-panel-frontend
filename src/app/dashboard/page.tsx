'use client';

import { Loader2 } from 'lucide-react';
import { useAuth } from '@/data/contexts/AuthContext';
import { TitherDashboard } from '@/components/dashboard/tither/TitherDashboard';
import { ParishAdminDashboard } from '@/components/dashboard/admin/ParishAdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (user.role === 'PARISH_ADMIN') {
    return <ParishAdminDashboard />;
  }

  if (user.role === 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">
          Painel Super Admin (em construção)
        </p>
      </div>
    );
  }

  return <TitherDashboard />;
}