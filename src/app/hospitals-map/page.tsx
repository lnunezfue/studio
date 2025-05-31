
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHospitals } from "@/lib/mock-data";
import type { Hospital } from "@/types";
import { Hospital as HospitalIcon, MapPin, Building2, Info } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import the InteractiveMap component
const InteractiveMap = dynamic(() => 
  import('@/components/map/interactive-map').then(mod => mod.InteractiveMap),
  { ssr: false, loading: () => <div style={{ height: '400px', background: '#f0f0f0' }} className="flex items-center justify-center rounded-lg shadow-md mx-auto"><p>Loading map...</p></div> }
);


export default function HospitalsMapPage() {
  const getConsultorioAvailability = (hospital: Hospital) => {
    if (!hospital.estadoConsultorios || hospital.estadoConsultorios.length === 0) {
      return { text: "No data", available: 0, total: 0, variant: "outline" as const };
    }
    const available = hospital.estadoConsultorios.filter(c => !c.ocupado).length;
    const total = hospital.estadoConsultorios.length;
    const percentage = total > 0 ? (available / total) * 100 : 0;

    if (percentage > 50) return { text: `${available}/${total} available`, available, total, variant: "default" as const, className: "bg-green-500/20 text-green-700 border-green-500/30" };
    if (percentage > 0) return { text: `${available}/${total} available`, available, total, variant: "secondary" as const, className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" };
    return { text: `${available}/${total} available`, available, total, variant: "destructive" as const, className: "bg-red-500/20 text-red-700 border-red-500/30"};
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Hospital Map Overview (Tacna)"
        description="Find hospital locations and basic availability."
      />

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Tacna Area Map</CardTitle>
          <CardDescription>Interactive map showing hospital locations.</CardDescription>
        </CardHeader>
        <CardContent>
          <InteractiveMap hospitals={mockHospitals} className="rounded-lg shadow-md mx-auto" />
        </CardContent>
      </Card>

      <div className="mb-6 p-4 border rounded-lg bg-card shadow flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="w-5 h-5 text-primary" />
        <span>
          Proximity-based sorting and real-time availability would require live map integration and location services. 
          The list below is based on mock data.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHospitals.map(hospital => {
          const availability = getConsultorioAvailability(hospital);
          return (
            <Card key={hospital.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <HospitalIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-headline leading-tight">{hospital.nombre}</CardTitle>
                    <CardDescription className="text-xs">{hospital.tipo || 'Healthcare Facility'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground flex items-start mb-3">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> {hospital.direccion}
                </p>
                <div className="flex items-center gap-2">
                   <Building2 className="w-4 h-4 text-muted-foreground" />
                   <span className="text-sm font-medium">Consultorios:</span>
                   <Badge variant={availability.variant} className={availability.className + " font-semibold"}>{availability.text}</Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/hospitals/${hospital.id}`}>View Full Details</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
