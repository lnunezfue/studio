
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAppointments, mockUser, mockActiveTreatments } from "@/lib/mock-data";
import { ArrowRight, Bot, CalendarCheck, ListChecks, Video, Activity, FileText, Pill } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';

export default function DashboardPage() {
  const upcomingAppointments = mockAppointments.filter(apt => new Date(apt.fechaHora) > new Date() && apt.estado === 'programada');
  
  return (
    <MainLayout>
      <PageHeader 
        title={`Welcome back, ${mockUser.nombre}!`}
        description="Here's an overview of your health activities."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              You have {upcomingAppointments.length} appointments scheduled.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/appointments">View Appointments <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActiveTreatments.length}</div>
            {mockActiveTreatments.length > 0 ? (
              <p className="text-xs text-muted-foreground truncate">
                e.g., {mockActiveTreatments[0].name}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No active treatments.</p>
            )}
          </CardContent>
           <CardFooter>
            {mockActiveTreatments.length > 0 ? (
               <Link href="/medical-history?tab=prescriptions" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View Treatments <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" className="w-full" disabled>
                View Treatments <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Medical Guidance</CardTitle>
            <Bot className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Chat Now</div>
            <p className="text-xs text-muted-foreground">
              Get preliminary medical advice from our AI assistant.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/ai-guidance">Start Chat <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {mockActiveTreatments.length > 0 && (
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Pill className="w-5 h-5 mr-2 text-primary" /> Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActiveTreatments.slice(0,2).map(treatment => (
                <div key={treatment.id} className="p-3 border rounded-md bg-secondary/30">
                  <h4 className="font-semibold">{treatment.name}</h4>
                  <p className="text-sm text-muted-foreground">{treatment.dosage} - {treatment.frequency}</p>
                  <p className="text-xs text-muted-foreground">Prescribed by: {treatment.prescribingDoctor}</p>
                  <p className="text-xs text-muted-foreground">Started: {format(parseISO(treatment.startDate), "MMMM d, yyyy")}</p>
                </div>
              ))}
               {mockActiveTreatments.length > 2 && (
                 <Button asChild variant="link" size="sm" className="p-0 h-auto">
                    <Link href="/medical-history?tab=prescriptions">View all {mockActiveTreatments.length} treatments...</Link>
                 </Button>
               )}
            </CardContent>
          </Card>
        </div>
      )}


      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="Find Hospitals & Specialists"
              description="Explore our directory of healthcare providers."
              href="/directory"
              icon={<ListChecks className="h-8 w-8 text-primary" />}
            />
            <QuickActionCard
              title="Book New Appointment"
              description="Schedule your next visit with a specialist."
              href="/directory" 
              icon={<CalendarCheck className="h-8 w-8 text-primary" />}
            />
            <QuickActionCard
              title="View Medical History"
              description="Access your diagnoses, prescriptions, and lab results."
              href="/medical-history"
              icon={<FileText className="h-8 w-8 text-primary" />}
            />
             <QuickActionCard
                title="Telemedicine Consultations"
                description="Connect with a doctor via video call."
                href="/telemedicine"
                icon={<Video className="h-8 w-8 text-primary" />}
            />
             <div className="relative group overflow-hidden rounded-lg col-span-1 sm:col-span-2 lg:col-span-1">
              <Image 
                src="https://placehold.co/400x250.png" 
                alt="Health awareness" 
                width={400} 
                height={250} 
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="health wellness" 
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Stay Informed</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">Read our latest health tips and news.</p>
                <Button variant="secondary" size="sm" disabled>Read Articles</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function QuickActionCard({ title, description, href, icon }: QuickActionCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:border-primary">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
