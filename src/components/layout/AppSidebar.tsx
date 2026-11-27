'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/data/contexts/AuthContext';
import { useParish } from '@/data/contexts/ParishContext';
import { ROLE_NAVIGATION } from '@/config/navigation';
import ShatteredHeartIcon from '@/components/icons/ShatteredHeart';

interface AppSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  badges?: Partial<Record<'pendingApprovals', number>>;
}

export function AppSidebar({
  activeTab,
  onSelectTab,
  badges,
}: AppSidebarProps) {
  const { user } = useAuth();
  const parish = useParish();

  const navItems = user ? ROLE_NAVIGATION[user.role] : [];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-16 border-b border-border flex justify-center px-3">
        <div className="flex items-center gap-3 overflow-hidden">
          {parish?.logoUrl ? (
            <img
              src={parish.logoUrl}
              alt={parish.name}
              className="h-8 w-8 rounded-lg object-contain shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <ShatteredHeartIcon size="1.25rem" />
            </div>
          )}
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-bold uppercase tracking-tight truncate">
              {parish?.name ?? 'Pastoral do Dízimo'}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user?.role === 'PARISH_ADMIN'
                ? 'Secretaria Paroquial'
                : user?.role === 'SUPER_ADMIN'
                  ? 'Administração Geral'
                  : 'Portal do Dizimista'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const badgeCount = item.badgeKey ? badges?.[item.badgeKey] : undefined;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      tooltip={item.label}
                      onClick={() => onSelectTab(item.id)}
                      className="cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>

                    {badgeCount !== undefined && badgeCount > 0 && (
                      <SidebarMenuBadge className="bg-primary text-primary-foreground text-[11px] font-semibold">
                        {badgeCount}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 group-data-[collapsible=icon]:hidden">
        <div className="text-end text-[0.65rem] text-muted-foreground">
          <p>“A generosidade alarga o nosso coração.”</p>
          <p> — Papa Francisco</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}