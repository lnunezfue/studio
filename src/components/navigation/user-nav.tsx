
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { LogOut, Settings, UserCircle, LifeBuoy, Bell, Calendar, Syringe, Info } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { mockNotifications } from "@/lib/mock-data"; // Import mock notifications
import type { NotificationMessage } from "@/types";
import { format, parseISO } from 'date-fns';
import React, { useMemo, useEffect, useState } from "react";

const notificationIcons: Record<NotificationMessage["tipo"], React.ElementType> = {
  cita: Calendar,
  vacuna: Syringe,
  insumo: Info, 
  general: Info,
};

export function UserNav() {
  const { user, logout } = useAuth();
  // Local state to trigger re-render when mockNotifications changes
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    if (user) {
      // Filter and sort notifications for the current user
      // This effect will re-run if mockNotifications reference changes or user changes
      // For mock data, we might need a way to "refresh" this if mockNotifications is mutated elsewhere.
      // A simple solution for now is to re-filter from the global mockNotifications.
      const userNotifications = mockNotifications
        .filter(n => n.userID === user.id)
        .sort((a, b) => parseISO(b.fechaEnvio).getTime() - parseISO(a.fechaEnvio).getTime());
      setNotifications(userNotifications);
    }
  }, [user, mockNotifications.length]); // Depend on mockNotifications.length to crudely detect changes

  const unreadNotificationCount = useMemo(() => {
    if (!user) return 0;
    return notifications.filter(n => !n.leida).length;
  }, [notifications, user]);
  
  const recentUnreadNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter(n => !n.leida).slice(0, 3);
  }, [notifications, user]);


  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };
  
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
             <Bell className="h-5 w-5" />
             {unreadNotificationCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {unreadNotificationCount}
                </Badge>
             )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Notifications</p>
              <p className="text-xs leading-none text-muted-foreground">
                You have {unreadNotificationCount} unread notifications.
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {recentUnreadNotifications.length > 0 ? (
            recentUnreadNotifications.map(notification => {
              const Icon = notificationIcons[notification.tipo] || Info;
              return (
                <DropdownMenuItem key={notification.id} asChild className="cursor-pointer">
                  <Link href={notification.detailsUrl || '/notifications'} className="flex flex-col items-start w-full">
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="font-semibold truncate flex-grow">{notification.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6 truncate w-[calc(100%-1.5rem)]">{notification.mensaje}</p>
                    <p className="text-xs text-muted-foreground/70 ml-6 mt-0.5">{format(parseISO(notification.fechaEnvio), "MMM d, h:mm a")}</p>
                  </Link>
                </DropdownMenuItem>
              )
            })
          ) : (
            <DropdownMenuItem disabled className="text-center text-muted-foreground">No unread notifications.</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="w-full justify-center">View all notifications</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.fotoPerfil || `https://placehold.co/100x100.png`} alt={user.nombre} data-ai-hint="user avatar" />
              <AvatarFallback>{getInitials(user.nombre)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.nombre}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.correo}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
