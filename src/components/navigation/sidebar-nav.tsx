"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ListChecks,
  CalendarCheck,
  Bot,
  Video,
  UserCircle,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/directory', label: 'Directory', icon: ListChecks },
  { href: '/appointments', label: 'My Appointments', icon: CalendarCheck },
  { href: '/ai-guidance', label: 'AI Guidance', icon: Bot },
  { href: '/telemedicine', label: 'Telemedicine', icon: Video },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'justify-start'
              )}
              tooltip={{children: item.label, className: "bg-popover text-popover-foreground border border-border shadow-md"}}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
