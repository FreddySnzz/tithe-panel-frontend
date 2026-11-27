'use client';

import { ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from '@/components/Header';

interface DashboardShellProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  badges?: Partial<Record<'pendingApprovals', number>>;
  headerTitle?: string;
  children: ReactNode;
}

export function DashboardShell({
  activeTab,
  onSelectTab,
  badges,
  headerTitle,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          badges={badges}
        />

        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-background">
          <Header title={headerTitle} />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}