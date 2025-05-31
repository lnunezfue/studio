"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockSpecialists, mockHospitals, mockUser } from "@/lib/mock-data";
import type { Specialist, Appointment } from "@/types";
import { CalendarDays, Clock, Hospital as HospitalIcon, Stethoscope } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function SpecialistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const specialistId = params.id as string;

  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    const foundSpecialist = mockSpecialists.find(s => s.id === specialistId);
    if (foundSpecialist) {
      setSpecialist(foundSpecialist);
    } else {
      // Handle not found, perhaps redirect or show error
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

  // Filter available times for the selected date
  const availableTimesForSelectedDate = specialist.horariosDisponibles
    ?.filter(datetimeStr => {
      const datePart = datetimeStr.split('T')[0];
      const selectedDateStr = selectedDate?.toISOString().split('T')[0];
      return datePart === selectedDateStr;
    })
    .map(datetimeStr => new Date(datetimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })) || [];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Booking Error", description: "Please select a date and time.", variant: "destructive" });
      return;
    }

    const dateTime = new Date(selectedDate);
    const [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    dateTime.setHours(hours, minutes, 0, 0);
    
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      pacienteID: mockUser.id, // Assuming mockUser is the logged-in user
      especialistaID: specialist.id,
      hospitalID: specialist.hospitalID,
      fechaHora: dateTime.toISOString(),
      estado: 'programada',
      recordatorioActivado: true,
    };

    // In a real app, this would be an API call
    // For demo, add to mockAppointments (not done here to avoid state complexity in mock)
    console.log("Booking appointment:", newAppointment);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${specialist.nombre} on ${selectedDate.toLocaleDateString()} at ${selectedTime} has been scheduled.`,
    });
    router.push('/appointments');
  };
  
  return (
    <MainLayout>
      <PageHeader title={specialist.nombre} description={`Profile and availability for ${specialist.especialidad}`} />
      
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
                <HospitalIcon className="w-4 h-4 mr-2 flex-shrink-0" /> Works at {hospital.nombre}
              </p>
            )}
            <p className="text-foreground">{specialist.descripcion || "Detailed information about the specialist's experience and qualifications."}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CalendarDays className="w-6 h-6 mr-2 text-primary" /> Book an Appointment</CardTitle>
            <CardDescription>Select a date and time for your consultation.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(undefined); // Reset time when date changes
                }}
                className="rounded-md border p-0"
                fromDate={new Date()} // Disable past dates
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Available Times for {selectedDate?.toLocaleDateString()}</h3>
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
                <p className="text-muted-foreground italic">No available times for this date. Please select another date.</p>
              )}
              
              {selectedDate && selectedTime && (
                <Button onClick={handleBookAppointment} className="w-full mt-6">
                  Book for {selectedDate.toLocaleDateString()} at {selectedTime}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
