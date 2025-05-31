"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockHospitals, mockSpecialists } from "@/lib/mock-data";
import type { Hospital, Specialist } from "@/types";
import { Hospital as HospitalIcon, Search, Stethoscope, MapPin, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState('all');

  const specialties = useMemo(() => 
    ['all', ...new Set(mockSpecialists.map(s => s.especialidad))]
  , []);

  const filteredHospitals = useMemo(() => 
    mockHospitals.filter(hospital => 
      hospital.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [searchTerm]);

  const filteredSpecialists = useMemo(() =>
    mockSpecialists.filter(specialist =>
      specialist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSpecialty === 'all' || specialist.especialidad === selectedSpecialty) &&
      (selectedHospitalFilter === 'all' || specialist.hospitalID === selectedHospitalFilter)
    )
  , [searchTerm, selectedSpecialty, selectedHospitalFilter]);

  return (
    <MainLayout>
      <PageHeader 
        title="Hospital & Specialist Directory"
        description="Find healthcare providers and facilities near you."
      />
      
      <div className="mb-6 p-4 border rounded-lg bg-card shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="search"
                placeholder="Search hospitals or specialists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="specialty" className="text-sm font-medium">Filter by Specialty (for specialists)</label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger id="specialty">
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec === 'all' ? 'All Specialties' : spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="hospital-filter" className="text-sm font-medium">Filter by Hospital (for specialists)</label>
            <Select value={selectedHospitalFilter} onValueChange={setSelectedHospitalFilter}>
              <SelectTrigger id="hospital-filter">
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hospitals</SelectItem>
                {mockHospitals.map(hospital => (
                  <SelectItem key={hospital.id} value={hospital.id}>{hospital.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="hospitals">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="hospitals">Hospitals ({filteredHospitals.length})</TabsTrigger>
          <TabsTrigger value="specialists">Specialists ({filteredSpecialists.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="hospitals" className="mt-6">
          {filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hospitals found matching your criteria.</p>
          )}
        </TabsContent>
        <TabsContent value="specialists" className="mt-6">
           {filteredSpecialists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecialists.map(specialist => (
                <SpecialistCard key={specialist.id} specialist={specialist} />
              ))}
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">No specialists found matching your criteria.</p>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <Image 
          src={hospital.imagenUrl || "https://placehold.co/600x400.png"} 
          alt={hospital.nombre} 
          width={600} 
          height={400} 
          className="w-full h-48 object-cover"
          data-ai-hint="hospital building"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">{hospital.nombre}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" /> {hospital.direccion}
        </CardDescription>
        <p className="text-sm text-foreground">Type: {hospital.tipo || 'N/A'}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="outline" size="sm" className="w-full" disabled>View Details</Button>
      </CardFooter>
    </Card>
  );
}

function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const hospital = mockHospitals.find(h => h.id === specialist.hospitalID);
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 p-4 bg-secondary/30">
        <Image 
          src={specialist.fotoPerfilUrl || "https://placehold.co/100x100.png"} 
          alt={specialist.nombre} 
          width={80} 
          height={80} 
          className="rounded-full border-2 border-primary"
          data-ai-hint="doctor avatar"
        />
        <div>
          <CardTitle className="text-lg font-headline">{specialist.nombre}</CardTitle>
          <CardDescription className="text-sm text-primary">{specialist.especialidad}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {hospital && (
          <p className="text-sm text-muted-foreground mb-2 flex items-center">
            <HospitalIcon className="w-4 h-4 mr-1.5 flex-shrink-0" /> {hospital.nombre}
          </p>
        )}
        <p className="text-sm text-foreground line-clamp-3">{specialist.descripcion || "No description available."}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild size="sm" className="w-full">
          <Link href={`/specialists/${specialist.id}`}>View Profile & Book</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

