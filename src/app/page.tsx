import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CalendarHeart, MessageSquareHeart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="container mx-auto py-6 px-4 md:px-6 flex justify-between items-center">
        <Logo />
        <nav className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-12 md:py-24 px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 text-primary">
            Welcome to Rural Health Hub
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Connecting rural communities with accessible and quality healthcare. Schedule appointments, consult with specialists via telemedicine, and manage your health with ease.
          </p>
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/signup">Get Started Today</Link>
          </Button>
          <div className="mt-16">
            <Image 
              src="https://placehold.co/800x400.png" 
              alt="Rural healthcare illustration" 
              width={800} 
              height={400} 
              className="rounded-lg shadow-xl mx-auto"
              data-ai-hint="healthcare community"
            />
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              Our Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<CalendarHeart className="w-10 h-10 text-primary" />}
                title="Easy Appointment Scheduling"
                description="Find and book appointments with local doctors and specialists in just a few clicks. View real-time availability."
              />
              <FeatureCard
                icon={<Users className="w-10 h-10 text-primary" />}
                title="Hospital & Specialist Directory"
                description="Access a comprehensive directory of healthcare facilities and medical professionals in your area."
              />
              <FeatureCard
                icon={<MessageSquareHeart className="w-10 h-10 text-primary" />}
                title="Telemedicine Consultations"
                description="Connect with healthcare providers remotely for consultations, advice, and basic medical guidance via chat or video."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto py-8 px-4 md:px-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Rural Health Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
