"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockSpecialists, mockTelemedicineSessions, mockUser } from "@/lib/mock-data";
import type { Specialist, TelemedicineSession } from "@/types";
import { Video, Link as LinkIcon, CheckCircle, Clock, PlusCircle, Edit3, MessageCircle } from "lucide-react";
import React, { useState, FormEvent } from "react";
import { format, parseISO } from 'date-fns';
import Image from "next/image";

export default function TelemedicinePage() {
  const [sessions, setSessions] = useState<TelemedicineSession[]>(mockTelemedicineSessions);
  const [selectedSession, setSelectedSession] = useState<TelemedicineSession | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleStartConsultation = (specialist: Specialist) => {
    // Mock starting a new consultation
    const newSession: TelemedicineSession = {
      id: `tele-${Date.now()}`,
      pacienteID: mockUser.id,
      especialistaID: specialist.id,
      fechaHora: new Date().toISOString(),
      enlaceVideollamada: `https://meet.example.com/ruralhealthhub-${Date.now()}`,
      estado: 'programada', // Or 'en_curso' if started immediately
    };
    setSessions(prev => [newSession, ...prev]);
    toast({
      title: "Consultation Scheduled",
      description: `Telemedicine session with ${specialist.nombre} is ready.`,
    });
    // In a real app, would likely redirect to a waiting room or the call itself.
  };

  const handleOpenNotesDialog = (session: TelemedicineSession) => {
    setSelectedSession(session);
    setNotes(session.notasConsulta || "");
  };

  const handleSaveNotes = (e: FormEvent) => {
    e.preventDefault();
    if (selectedSession) {
      setSessions(prev => prev.map(s => s.id === selectedSession.id ? {...s, notasConsulta: notes} : s));
      toast({ title: "Notes Saved", description: "Consultation notes have been updated." });
      setSelectedSession(null); // Close dialog implicitly by resetting (or use DialogClose)
    }
  };

  const availableSpecialists = mockSpecialists.filter(s => s.especialidad === "Medicina General" || s.especialidad === "Pediatría"); // Mock filter

  return (
    <MainLayout>
      <PageHeader 
        title="Telemedicine Consultations"
        description="Connect with healthcare providers via video call for remote medical advice."
      />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 font-headline">Available Doctors for Teleconsultation</h2>
        {availableSpecialists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSpecialists.map(specialist => (
              <Card key={specialist.id} className="shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={specialist.fotoPerfilUrl || "https://placehold.co/100x100.png"} alt={specialist.nombre} data-ai-hint="doctor avatar" />
                    <AvatarFallback>{specialist.nombre.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-headline">{specialist.nombre}</CardTitle>
                    <CardDescription>{specialist.especialidad}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleStartConsultation(specialist)}>
                    <Video className="w-4 h-4 mr-2" /> Start Consultation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No doctors currently available for teleconsultation.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 font-headline">Your Telemedicine Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => {
              const specialist = mockSpecialists.find(s => s.id === session.especialistaID);
              return (
                <Card key={session.id} className="shadow-md">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                      <div>
                        <CardTitle className="text-lg font-headline">
                          Consultation with {specialist?.nombre || 'Unknown Doctor'}
                        </CardTitle>
                        <CardDescription>
                          {format(parseISO(session.fechaHora), "MMMM d, yyyy 'at' h:mm a")}
                        </CardDescription>
                      </div>
                      <span className={`mt-2 sm:mt-0 px-2 py-1 text-xs rounded-full capitalize ${
                        session.estado === 'finalizada' ? 'bg-green-100 text-green-700' : 
                        session.estado === 'programada' ? 'bg-blue-100 text-blue-700' :
                        session.estado === 'en_curso' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {session.estado.replace('_', ' ')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {session.enlaceVideollamada && (
                      <div className="mb-2">
                        <Button variant="link" asChild className="p-0 h-auto text-base">
                          <a href={session.enlaceVideollamada} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="w-4 h-4 mr-2" /> Join Video Call
                          </a>
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Notes: {session.notasConsulta || (session.estado === 'finalizada' ? 'No notes added.' : 'Notes can be added after the session.')}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                     <DialogTrigger asChild>
                       <Button variant="outline" size="sm" onClick={() => handleOpenNotesDialog(session)}>
                         <Edit3 className="w-4 h-4 mr-2" /> {session.notasConsulta ? 'Edit' : 'Add'} Notes
                       </Button>
                     </DialogTrigger>
                     {session.estado === 'programada' && (
                       <Button variant="ghost" size="sm" className="ml-auto text-destructive hover:text-destructive" disabled>
                         Cancel Session
                       </Button>
                     )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">You have no telemedicine sessions.</p>
        )}
      </section>

      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Consultation Notes</DialogTitle>
              <DialogDescription>
                Add or edit notes for your session on {format(parseISO(selectedSession.fechaHora), "MMMM d, yyyy")}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveNotes}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="session-notes">Notes</Label>
                  <Textarea 
                    id="session-notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Enter your notes here..."
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Notes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}
