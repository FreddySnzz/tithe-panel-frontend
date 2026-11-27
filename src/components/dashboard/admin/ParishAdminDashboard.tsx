'use client';

import { useCallback, useEffect, useState } from 'react';
import { returnService } from '@/data/services/return.service';
import { PendingReturnItem } from '@/data/types/return.type';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MonthlyReportView } from './MonthlyReportView';
import { PendingApprovalsView } from './PendingApprovalsView';
import { TithersManagementView } from './TithersManagementView';
import { ParishAdminsView } from './ParishAdminsView';
import { ParishSettingsView } from './ParishSettingsView';

export function ParishAdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [pendingReturns, setPendingReturns] = useState<PendingReturnItem[]>([]);

  const refreshPendingReturns = useCallback(async () => {
    try {
      const data = await returnService.getPendingReturns();
      setPendingReturns(data);
    } catch {}
  }, []);

  useEffect(() => {
    refreshPendingReturns();
  }, [refreshPendingReturns]);

  return (
    <DashboardShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      badges={{ pendingApprovals: pendingReturns.length }}
    >
      {activeTab === 'overview' && <MonthlyReportView />}

      {activeTab === 'approvals' && (
        <PendingApprovalsView
          items={pendingReturns}
          onReviewed={refreshPendingReturns}
        />
      )}

      {activeTab === 'tithers' && <TithersManagementView />}

      {activeTab === 'users' && <ParishAdminsView />}

      {activeTab === 'parish-settings' && <ParishSettingsView />}
    </DashboardShell>
  );
}