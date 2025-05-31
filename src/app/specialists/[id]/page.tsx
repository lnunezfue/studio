
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockSpecialists, mockHospitals, mockUser } from "@/lib/mock-data";
import type { Specialist, Appointment } from "@/types";
import { CalendarDays, Clock, Hospital as HospitalIcon, MessageSquareText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function SpecialistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const specialistId = params.id as string;

  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [razonConsulta, setRazonConsulta] = useState<string>("");

  useEffect(() => {
    const foundSpecialist = mockSpecialists.find(s => s.id === specialistId);
    if (foundSpecialist) {
      setSpecialist(foundSpecialist);
    } else {
      router.push('/directory'); 
    }
  }, [specialistId, router]);

  if (!specialist) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  const hospital = mockHospitals.find(h => h.id === specialist.hospitalID);

  const availableTimesForSelectedDate = specialist.horariosDisponibles
    ?.filter(datetimeStr => {
      const datePart = datetimeStr.split('T')[0];
      const selectedDateStr = selectedDate?.toISOString().split('T')[0];
      return datePart === selectedDateStr;
    })
    .map(datetimeStr => new Date(datetimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })) || [];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Error de Reserva", description: "Por favor, selecciona una fecha y hora.", variant: "destructive" });
      return;
    }
    if (!razonConsulta.trim()) {
      toast({ title: "Error de Reserva", description: "Por favor, ingresa el motivo de tu consulta.", variant: "destructive" });
      return;
    }

    const dateTime = new Date(selectedDate);
    const [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0; // Midnight case
    dateTime.setHours(hours, minutes, 0, 0);
    
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      pacienteID: mockUser.id, 
      especialistaID: specialist.id,
      hospitalID: specialist.hospitalID,
      fechaHora: dateTime.toISOString(),
      estado: 'programada',
      recordatorioActivado: true,
      razonConsulta: razonConsulta,
    };

    console.log("Booking appointment:", newAppointment);
    // In a real app, you would save this to your mockAppointments array or a backend
    // For now, we'll just show a success toast and redirect.
    // Consider adding 'newAppointment' to 'mockAppointments' in mock-data.ts or managing state globally for persistence in demo.
    toast({
      title: "¡Cita Agendada!",
      description: `Tu cita con ${specialist.nombre} el ${selectedDate.toLocaleDateString()} a las ${selectedTime} ha sido programada.`,
    });
    router.push('/appointments');
  };
  
  return (
    <MainLayout>
      <PageHeader title={specialist.nombre} description={`Perfil y disponibilidad de ${specialist.especialidad}`} />
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
              <AvatarImage src={specialist.fotoPerfilUrl || "https://placehold.co/200x200.png"} alt={specialist.nombre} data-ai-hint="doctor portrait" />
              <AvatarFallback>{specialist.nombre.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline">{specialist.nombre}</CardTitle>
            <CardDescription className="text-primary">{specialist.especialidad}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {hospital && (
              <p className="flex items-center mb-2 text-muted-foreground">
                <HospitalIcon className="w-4 h-4 mr-2 flex-shrink-0" /> Trabaja en {hospital.nombre}
              </p>
            )}
            <p className="text-foreground">{specialist.descripcion || "Información detallada sobre la experiencia y cualificaciones del especialista."}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CalendarDays className="w-6 h-6 mr-2 text-primary" /> Agendar una Cita</CardTitle>
            <CardDescription>Selecciona una fecha, hora e ingresa el motivo de tu consulta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Seleccionar Fecha</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(undefined); 
                  }}
                  className="rounded-md border p-0"
                  fromDate={new Date()} 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Horas Disponibles para {selectedDate?.toLocaleDateString()}</h3>
                {availableTimesForSelectedDate.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableTimesForSelectedDate.map(time => (
                      <Button 
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" /> {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No hay horas disponibles para esta fecha. Por favor, selecciona otra fecha.</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="razonConsulta" className="text-lg font-semibold mb-2 flex items-center">
                <MessageSquareText className="w-5 h-5 mr-2 text-primary" /> Motivo de la Consulta
              </Label>
              <Textarea
                id="razonConsulta"
                value={razonConsulta}
                onChange={(e) => setRazonConsulta(e.target.value)}
                placeholder="Describe brevemente tus síntomas o el motivo de tu visita..."
                rows={4}
                className="mt-1"
              />
            </div>
              
            {selectedDate && selectedTime && (
              <Button onClick={handleBookAppointment} className="w-full" disabled={!razonConsulta.trim()}>
                Agendar para el {selectedDate.toLocaleDateString()} a las {selectedTime}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
