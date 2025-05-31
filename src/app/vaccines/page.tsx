
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockVaccines, mockHospitals, mockUser, mockNotifications } from "@/lib/mock-data";
import type { Vaccine, Hospital, NotificationMessage } from "@/types";
import { Syringe, AlertTriangle, CheckCircle, Info, Users, CalendarClock, Package, Clock } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { format } from 'date-fns';

export default function VaccinesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vaccines, setVaccines] = useState<Vaccine[]>(mockVaccines);

  const handleJoinWaitlist = (vaccineId: string) => {
    if (!user) {
      toast({ title: "Error", description: "Debes iniciar sesión para unirte a la lista de espera.", variant: "destructive" });
      return;
    }

    setVaccines(prevVaccines => 
      prevVaccines.map(vac => {
        if (vac.id === vaccineId && !vac.listaEspera.includes(user.id)) {
          const updatedVaccine = { ...vac, listaEspera: [...vac.listaEspera, user.id] };
          
          // Simulate adding a notification
          const newNotification: NotificationMessage = {
            id: `notif-${Date.now()}`,
            userID: user.id,
            title: "Te has unido a la lista de espera",
            mensaje: `Te has unido a la lista de espera para la vacuna ${vac.nombre}. Te notificaremos cuando esté disponible.`,
            tipo: 'vacuna',
            fechaEnvio: new Date().toISOString(),
            leida: false,
            detailsUrl: `/vaccines#${vaccineId}`
          };
          mockNotifications.unshift(newNotification); // Add to global mock notifications

          toast({ title: "Lista de Espera", description: `Te has unido a la lista de espera para ${vac.nombre}.` });
          return updatedVaccine;
        }
        return vac;
      })
    );
  };

  const getHospitalName = (hospitalId: string) => {
    return mockHospitals.find(h => h.id === hospitalId)?.nombre || "Hospital Desconocido";
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Vacunas Disponibles y Listas de Espera"
        description="Consulta la disponibilidad de vacunas y únete a las listas de espera si es necesario."
      />
      
      {vaccines.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No hay información de vacunas disponible en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaccines.map(vaccine => {
            const isOnWaitlist = user ? vaccine.listaEspera.includes(user.id) : false;
            const hospital = mockHospitals.find(h => h.id === vaccine.hospitalID);
            return (
              <Card key={vaccine.id} id={vaccine.id} className="shadow-lg flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Syringe className="w-7 h-7 text-primary" />
                    <CardTitle className="text-xl font-headline">{vaccine.nombre}</CardTitle>
                  </div>
                  {vaccine.provider && <Badge variant="outline" className="mb-2 w-fit">{vaccine.provider}</Badge>}
                  <CardDescription className="text-sm line-clamp-3">{vaccine.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <Image 
                    src={vaccine.imageUrl || "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxDb3ZpZHxlbnwwfHx8fDE3NDg3MzI2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080"} 
                    alt={vaccine.nombre} 
                    width={600} 
                    height={200} 
                    className="w-full h-40 object-cover rounded-md"
                    data-ai-hint="vaccine vial"
                  />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center"><Package className="w-4 h-4 mr-2 text-primary"/> <strong>Stock:</strong> 
                      {vaccine.stockDisponible > 0 
                        ? <span className="text-green-600 ml-1">{vaccine.stockDisponible} dosis disponibles</span>
                        : <span className="text-red-600 ml-1">No disponible</span>
                      }
                    </p>
                    {hospital && <p className="flex items-center"><Info className="w-4 h-4 mr-2 text-primary"/> <strong>Ubicación:</strong> {hospital.nombre}</p>}
                    {vaccine.minAge !== undefined && <p className="flex items-center"><Users className="w-4 h-4 mr-2 text-primary"/> <strong>Edad:</strong> {vaccine.minAge}+ años {vaccine.maxAge ? `(hasta ${vaccine.maxAge})` : ''}</p>}
                    {vaccine.dosesRequired && <p className="flex items-center"><CalendarClock className="w-4 h-4 mr-2 text-primary"/> <strong>Dosis:</strong> {vaccine.dosesRequired}</p>}
                  </div>

                  {vaccine.stockDisponible <= 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-md text-amber-700 text-xs flex items-start">
                      <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"/>
                      <div>
                        Esta vacuna no está disponible actualmente. {isOnWaitlist ? "Ya estás en la lista de espera." : "Puedes unirte a la lista de espera."}
                        <br/>
                        <strong>Serás notificado cuando haya nuevas dosis disponibles.</strong>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {vaccine.stockDisponible > 0 ? (
                    <Button className="w-full" disabled>
                      <Syringe className="w-4 h-4 mr-2"/> Agendar Vacunación (Próximamente)
                    </Button>
                  ) : isOnWaitlist ? (
                    <Button variant="outline" className="w-full" disabled>
                      <CheckCircle className="w-4 h-4 mr-2"/> En Lista de Espera
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleJoinWaitlist(vaccine.id)}>
                      <Clock className="w-4 h-4 mr-2"/> Unirse a Lista de Espera
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}

