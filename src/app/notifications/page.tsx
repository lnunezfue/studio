
"use client";

import React, { useState, useMemo } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNotifications, mockUser } from "@/lib/mock-data";
import type { NotificationMessage } from "@/types";
import { Bell, Check, Eye, Calendar, Syringe, Info, Archive } from "lucide-react";
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const notificationIcons: Record<NotificationMessage["tipo"], React.ElementType> = {
  cita: Calendar,
  vacuna: Syringe,
  insumo: Info, // Placeholder, as insumo type is not fully implemented
  general: Info,
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  // Ensure mockNotifications is mutable for this page's state
  const [notifications, setNotifications] = useState<NotificationMessage[]>(
    () => mockNotifications.filter(n => n.userID === user?.id)
  );

  const unreadCount = useMemo(() => notifications.filter(n => !n.leida).length, [notifications]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, leida: true } : n)
    );
    // Update global mockNotifications as well for consistency across app (simulation)
    const globalNotifIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (globalNotifIndex !== -1) {
      mockNotifications[globalNotifIndex].leida = true;
    }
    toast({ title: "Notification marked as read." });
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
    mockNotifications.forEach(n => {
      if(n.userID === user?.id) n.leida = true;
    });
    toast({ title: "All notifications marked as read." });
  };

  if (!user) {
    return <MainLayout><p>Loading user data or please log in.</p></MainLayout>;
  }

  return (
    <MainLayout>
      <PageHeader 
        title="My Notifications"
        description={`You have ${unreadCount} unread notifications.`}
        actions={
          notifications.length > 0 && unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              <Check className="w-4 h-4 mr-2" /> Mark All as Read
            </Button>
          )
        }
      />

      {notifications.length === 0 ? (
        <Card className="shadow-lg text-center">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center">
              <Archive className="w-10 h-10 mr-3 text-muted-foreground" />
              No Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You don't have any notifications at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.sort((a,b) => parseISO(b.fechaEnvio).getTime() - parseISO(a.fechaEnvio).getTime()).map(notification => {
            const Icon = notificationIcons[notification.tipo] || Info;
            return (
              <Card key={notification.id} className={cn("shadow-md hover:shadow-lg transition-shadow", !notification.leida && "border-primary border-2")}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-6 h-6", notification.leida ? "text-muted-foreground" : "text-primary")} />
                      <div>
                        <CardTitle className={cn("text-lg font-headline", !notification.leida && "text-primary")}>{notification.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {format(parseISO(notification.fechaEnvio), "MMMM d, yyyy 'at' h:mm a")} - <Badge variant={notification.leida ? "secondary" : "default" } className="capitalize text-xs">{notification.tipo}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    {!notification.leida && (
                      <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} title="Mark as read">
                        <Eye className="w-4 h-4 mr-1" /> Mark Read
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={cn(notification.leida ? "text-muted-foreground" : "text-foreground")}>{notification.mensaje}</p>
                </CardContent>
                {notification.detailsUrl && (
                  <CardFooter className="border-t pt-3">
                    <Button variant="link" asChild className="p-0 h-auto text-sm">
                      <Link href={notification.detailsUrl}>View Details</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
