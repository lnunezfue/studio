"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockAppointments, mockSpecialists, mockHospitals } from "@/lib/mock-data";
import type { Appointment } from "@/types";
import { CalendarCheck, Hospital as HospitalIcon, Stethoscope, Info, CheckCircle, XCircle, History, Bell } from "lucide-react";
import React, { useState, useMemo } from "react";
import { format, parseISO, isFuture, isPast } from 'date-fns';

export default function AppointmentsPage() {
  // Use a local state for appointments to demonstrate updates like cancellation or reminder toggle
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
    toast({ title: "Appointment Canceled", description: "Your appointment has been successfully canceled."});
  };

  const toggleReminder = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const newReminderState = !apt.recordatorioActivado;
        toast({ 
          title: `Reminders ${newReminderState ? 'Enabled' : 'Disabled'}`, 
          description: `Notifications for this appointment are now ${newReminderState ? 'on' : 'off'}.`
        });
        return {...apt, recordatorioActivado: newReminderState };
      }
      return apt;
    }));
  };

  return (
    <MainLayout>
      <PageHeader 
        title="My Appointments"
        description="Manage your upcoming, past, and canceled medical appointments."
      />
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="upcoming" className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" />Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2"><History className="h-4 w-4" />Past ({pastAppointments.length})</TabsTrigger>
          <TabsTrigger value="canceled" className="flex items-center gap-2"><XCircle className="h-4 w-4" />Canceled ({canceledAppointments.length})</TabsTrigger>
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
    return <p className="text-center text-muted-foreground py-8">No {type} appointments found.</p>;
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
            {format(parseISO(appointment.fechaHora), "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </CardTitle>
          {type === 'upcoming' && (
             <div className="flex items-center space-x-2">
              <Bell className={`w-4 h-4 ${appointment.recordatorioActivado ? 'text-accent' : 'text-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">Reminders {appointment.recordatorioActivado ? 'On' : 'Off'}</span>
              <Switch 
                checked={appointment.recordatorioActivado} 
                onCheckedChange={() => onToggleReminder && onToggleReminder(appointment.id)}
                aria-label="Toggle appointment reminders"
              />
            </div>
          )}
           {type === 'past' && <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-4 h-4 mr-1" />Completed</Badge>}
           {type === 'canceled' && <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" />Canceled</Badge>}
        </div>
        {specialist && (
          <CardDescription className="flex items-center text-base">
            <Stethoscope className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> With {specialist.nombre} ({specialist.especialidad})
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {hospital && (
          <p className="text-sm text-muted-foreground flex items-center mb-1">
            <HospitalIcon className="w-4 h-4 mr-2 flex-shrink-0" /> At {hospital.nombre}
          </p>
        )}
        {appointment.notas && (
          <p className="text-sm text-muted-foreground flex items-start">
            <Info className="w-4 h-4 mr-2 mt-1 flex-shrink-0" /> Notes: {appointment.notas}
          </p>
        )}
      </CardContent>
      {type === 'upcoming' && onCancel && (
        <CardFooter className="border-t pt-4">
          <Button variant="destructive" size="sm" onClick={() => onCancel(appointment.id)}>
            Cancel Appointment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
