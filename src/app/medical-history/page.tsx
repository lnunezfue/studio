
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { mockMedicalHistory, mockUser } from "@/lib/mock-data";
import type { MedicalRecord } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Pill, FlaskConical, FilePenLine, ShieldCheck, Download, Info } from "lucide-react";
import React, { useMemo } from "react";
import { format, parseISO } from 'date-fns';
import Image from "next/image";
import { useSearchParams } from 'next/navigation';

const recordTypeIcons: Record<MedicalRecord["type"], React.ElementType> = {
  Diagnóstico: Stethoscope,
  Prescripción: Pill,
  "Resultado de Laboratorio": FlaskConical,
  "Nota de Progreso": FilePenLine,
  Vacunación: ShieldCheck,
};

export default function MedicalHistoryPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const recordTypes: MedicalRecord["type"][] = ["Diagnóstico", "Prescripción", "Resultado de Laboratorio", "Nota de Progreso", "Vacunación"];

  const recordsByType = useMemo(() => {
    const grouped: Record<string, MedicalRecord[]> = { all: [...mockMedicalHistory].sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()) };
    recordTypes.forEach(type => {
      grouped[type] = mockMedicalHistory.filter(record => record.type === type).sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    });
    // Remap prescriptions tab to 'Prescripción' for filtering
    if (grouped['Prescripción']) {
        grouped['prescriptions'] = grouped['Prescripción'];
    }
    return grouped;
  }, []);
  
  const defaultTabValue = recordTypes.includes(initialTab as MedicalRecord["type"]) || initialTab === "all" || initialTab === "prescriptions" ? initialTab : "all";


  return (
    <MainLayout>
      <PageHeader
        title="My Medical History"
        description={`View your health records, ${mockUser.nombre}.`}
      />
      <Tabs defaultValue={defaultTabValue} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mb-6">
          <TabsTrigger value="all">All ({recordsByType.all.length})</TabsTrigger>
          {recordTypes.map(type => (
            <TabsTrigger key={type} value={type === 'Prescripción' ? 'prescriptions' : type}>
              {type} ({recordsByType[type]?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <RecordList records={recordsByType.all} />
        </TabsContent>
        {recordTypes.map(type => (
          <TabsContent key={type} value={type === 'Prescripción' ? 'prescriptions' : type}>
            <RecordList records={recordsByType[type] || []} />
          </TabsContent>
        ))}
      </Tabs>
    </MainLayout>
  );
}

interface RecordListProps {
  records: MedicalRecord[];
}

function RecordList({ records }: RecordListProps) {
  if (records.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No records found for this category.</p>;
  }
  return (
    <div className="space-y-6">
      {records.map(record => (
        <MedicalRecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  const Icon = recordTypeIcons[record.type] || Info;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
          <div className="flex items-center gap-3">
            <Icon className="w-7 h-7 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-xl font-headline">{record.title}</CardTitle>
              <CardDescription>
                {format(parseISO(record.date), "MMMM d, yyyy")}
                {record.doctorName && ` - Dr. ${record.doctorName}`}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="mt-2 sm:mt-0 self-start sm:self-center">{record.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mb-3">{record.summary}</p>
        {record.type === 'Prescripción' && record.details && (
          <div className="text-sm space-y-1 bg-secondary/30 p-3 rounded-md">
            <p><strong>Medication:</strong> {record.details.medicamento}</p>
            <p><strong>Dosage:</strong> {record.details.dosis}</p>
            <p><strong>Frequency:</strong> {record.details.frecuencia}</p>
          </div>
        )}
        {record.type === 'Resultado de Laboratorio' && record.documentUrl && (
           <div className="mt-3">
             <Image 
                src={record.documentUrl} 
                alt={`Document for ${record.title}`} 
                width={150} 
                height={200} 
                className="rounded-md border object-cover"
                data-ai-hint="medical document"
              />
           </div>
        )}
      </CardContent>
      {record.documentUrl && (
        <CardFooter className="border-t pt-4">
          <Button variant="outline" size="sm" asChild>
            <a href={record.documentUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" /> Download/View Document
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
