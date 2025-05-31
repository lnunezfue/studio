
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockAppointments, mockSpecialists, mockHospitals } from "@/lib/mock-data";
import type { Appointment } from "@/types";
import { CalendarCheck, Hospital as HospitalIcon, Stethoscope, Info, CheckCircle, XCircle, History, Bell, MessageSquareText } from "lucide-react";
import React, { useState, useMemo } from "react";
import { format, parseISO, isFuture, isPast } from 'date-fns';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const { toast } = useToast();

  const upcomingAppointments = useMemo(() => 
    appointments.filter(apt => apt.estado === 'programada' && isFuture(parseISO(apt.fechaHora)))
    .sort((a,b) => parseISO(a.fechaHora).getTime() - parseISO(b.fechaHora).getTime()), 
  [appointments]);
  
  const pastAppointments = useMemo(() => 
    appointments.filter(apt => apt.estado === 'completada' || (apt.estado === 'programada' && isPast(parseISO(apt.fechaHora))))
    .sort((a,b) => parseISO(b.fechaHora).getTime() - parseISO(a.fechaHora).getTime()), 
  [appointments]);
  
  const canceledAppointments = useMemo(() => 
    appointments.filter(apt => apt.estado === 'cancelada')
    .sort((a,b) => parseISO(b.fechaHora).getTime() - parseISO(a.fechaHora).getTime()), 
  [appointments]);

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => apt.id === appointmentId ? {...apt, estado: 'cancelada'} : apt));
    toast({ title: "Cita Cancelada", description: "Tu cita ha sido cancelada exitosamente."});
  };

  const toggleReminder = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const newReminderState = !apt.recordatorioActivado;
        toast({ 
          title: `Recordatorios ${newReminderState ? 'Activados' : 'Desactivados'}`, 
          description: `Las notificaciones para esta cita ahora están ${newReminderState ? 'activadas' : 'desactivadas'}.`
        });
        return {...apt, recordatorioActivado: newReminderState };
      }
      return apt;
    }));
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Mis Citas"
        description="Administra tus citas médicas programadas, pasadas y canceladas."
      />
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="upcoming" className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" />Programadas ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2"><History className="h-4 w-4" />Pasadas ({pastAppointments.length})</TabsTrigger>
          <TabsTrigger value="canceled" className="flex items-center gap-2"><XCircle className="h-4 w-4" />Canceladas ({canceledAppointments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <AppointmentList appointments={upcomingAppointments} onCancel={handleCancelAppointment} onToggleReminder={toggleReminder} type="upcoming" />
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          <AppointmentList appointments={pastAppointments} type="past" />
        </TabsContent>
        <TabsContent value="canceled" className="mt-6">
          <AppointmentList appointments={canceledAppointments} type="canceled" />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

interface AppointmentListProps {
  appointments: Appointment[];
  onCancel?: (id: string) => void;
  onToggleReminder?: (id: string) => void;
  type: 'upcoming' | 'past' | 'canceled';
}

function AppointmentList({ appointments, onCancel, onToggleReminder, type }: AppointmentListProps) {
  if (appointments.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No se encontraron citas {type}.</p>;
  }
  return (
    <div className="space-y-4">
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} onCancel={onCancel} onToggleReminder={onToggleReminder} type={type} />
      ))}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onToggleReminder?: (id: string) => void;
  type: 'upcoming' | 'past' | 'canceled';
}

function AppointmentCard({ appointment, onCancel, onToggleReminder, type }: AppointmentCardProps) {
  const specialist = mockSpecialists.find(s => s.id === appointment.especialistaID);
  const hospital = mockHospitals.find(h => h.id === appointment.hospitalID);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <CardTitle className="text-lg font-headline mb-2 sm:mb-0">
            {format(parseISO(appointment.fechaHora), "EEEE, d 'de' MMMM, yyyy 'a las' h:mm a")}
          </CardTitle>
          {type === 'upcoming' && (
             <div className="flex items-center space-x-2">
              <Bell className={`w-4 h-4 ${appointment.recordatorioActivado ? 'text-accent' : 'text-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">Recordatorios {appointment.recordatorioActivado ? 'Act.' : 'Desact.'}</span>
              <Switch 
                checked={appointment.recordatorioActivado} 
                onCheckedChange={() => onToggleReminder && onToggleReminder(appointment.id)}
                aria-label="Alternar recordatorios de cita"
              />
            </div>
          )}
           {type === 'past' && <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-4 h-4 mr-1" />Completada</Badge>}
           {type === 'canceled' && <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" />Cancelada</Badge>}
        </div>
        {specialist && (
          <CardDescription className="flex items-center text-base mt-1">
            <Stethoscope className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> Con {specialist.nombre} ({specialist.especialidad})
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {hospital && (
          <p className="text-sm text-muted-foreground flex items-center">
            <HospitalIcon className="w-4 h-4 mr-2 flex-shrink-0" /> En {hospital.nombre}
          </p>
        )}
        {appointment.razonConsulta && (
          <p className="text-sm text-muted-foreground flex items-start">
            <MessageSquareText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary" /> Motivo: {appointment.razonConsulta}
          </p>
        )}
        {appointment.notas && (
          <p className="text-sm text-muted-foreground flex items-start">
            <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> Notas: {appointment.notas}
          </p>
        )}
      </CardContent>
      {type === 'upcoming' && onCancel && (
        <CardFooter className="border-t pt-4">
          <Button variant="destructive" size="sm" onClick={() => onCancel(appointment.id)}>
            Cancelar Cita
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
