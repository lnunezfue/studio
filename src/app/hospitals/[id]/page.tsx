
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHospitals, mockSpecialists } from "@/lib/mock-data";
import type { Hospital, Specialist } from "@/types";
import { Hospital as HospitalIcon, MapPin, ListChecks, Package, ChevronRight, Users, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = params.id as string;

  const [hospital, setHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const foundHospital = mockHospitals.find(h => h.id === hospitalId);
    if (foundHospital) {
      setHospital(foundHospital);
    } else {
      router.push('/directory'); 
    }
  }, [hospitalId, router]);

  const specialistsAtHospital = useMemo(() => {
    if (!hospital) return [];
    return mockSpecialists.filter(s => s.hospitalID === hospital.id);
  }, [hospital]);

  if (!hospital) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader 
        title={hospital.nombre}
        description={`Details for ${hospital.tipo || 'Healthcare Facility'}`}
      />
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
            <Card className="shadow-lg">
                <CardHeader className="p-0">
                    <Image 
                        src={hospital.imagenUrl || "https://placehold.co/600x400.png"} 
                        alt={hospital.nombre} 
                        width={600} 
                        height={400} 
                        className="w-full h-56 object-cover rounded-t-lg"
                        data-ai-hint="hospital exterior"
                    />
                </CardHeader>
                <CardContent className="p-4">
                    <CardTitle className="text-xl font-headline mb-2">{hospital.nombre}</CardTitle>
                    {hospital.tipo && <Badge variant="outline" className="mb-2">{hospital.tipo}</Badge>}
                    <p className="text-sm text-muted-foreground flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary" /> {hospital.direccion}
                    </p>
                </CardContent>
            </Card>

            {hospital.geolocalizacion && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center"><MapPin className="w-5 h-5 mr-2 text-primary"/>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Latitude: {hospital.geolocalizacion.lat} <br/>
                            Longitude: {hospital.geolocalizacion.lng}
                        </p>
                        <div className="mt-2 h-40 bg-muted rounded-md flex items-center justify-center">
                             <p className="text-sm text-muted-foreground italic">(Map Placeholder)</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

        <div className="md:col-span-2 space-y-6">
            {hospital.serviciosOfrecidos && hospital.serviciosOfrecidos.length > 0 && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center"><ListChecks className="w-5 h-5 mr-2 text-primary"/> Services Offered</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {hospital.serviciosOfrecidos.map(service => (
                            <Badge key={service} variant="secondary" className="text-sm py-1 px-2">{service}</Badge>
                        ))}
                    </CardContent>
                </Card>
            )}

            {hospital.insumosClave && hospital.insumosClave.length > 0 && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center"><Package className="w-5 h-5 mr-2 text-primary"/> Key Supplies</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {hospital.insumosClave.map(insumo => (
                            <Badge key={insumo} variant="outline" className="text-sm py-1 px-2 bg-secondary/50">{insumo}</Badge>
                        ))}
                    </CardContent>
                </Card>
            )}
            
            {hospital.estadoConsultorios && hospital.estadoConsultorios.length > 0 && (
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center"><Building className="w-5 h-5 mr-2 text-primary"/> Consultorio Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                        {hospital.estadoConsultorios.map(consultorio => (
                            <li key={consultorio.consultorioId}>
                            Consultorio {consultorio.consultorioId}: {consultorio.ocupado ? 'Ocupado' : 'Disponible'}
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {specialistsAtHospital.length > 0 && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center"><Users className="w-5 h-5 mr-2 text-primary"/> Specialists at this Hospital</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {specialistsAtHospital.map(specialist => (
                            <Link key={specialist.id} href={`/specialists/${specialist.id}`} className="block hover:bg-secondary/50 p-3 rounded-md transition-colors border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={specialist.fotoPerfilUrl || "https://placehold.co/100x100.png"} alt={specialist.nombre} data-ai-hint="doctor avatar" />
                                            <AvatarFallback>{specialist.nombre.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold">{specialist.nombre}</h4>
                                            <p className="text-sm text-muted-foreground">{specialist.especialidad}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </MainLayout>
  );
}
