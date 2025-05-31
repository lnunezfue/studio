"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";
import { Edit3, Mail, Phone, MapPin, Save } from "lucide-react";
import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, login, loading } = useAuth(); // Using login to update user in context for demo
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono || '',
        ubicacion: user.ubicacion || '',
        fotoPerfil: user.fotoPerfil || '',
      });
    }
  }, [user]);

  if (loading) {
     return <MainLayout><div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div></MainLayout>;
  }

  if (!user) {
    // Should be redirected by MainLayout, but as a fallback:
    return <MainLayout><p>Please log in to view your profile.</p></MainLayout>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update user data
    const updatedUser: User = { ...user, ...formData };
    login(updatedUser, '/profile'); // Update mock user in context
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your information has been saved successfully." });
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  return (
    <MainLayout>
      <PageHeader 
        title="My Profile"
        description="View and manage your personal information."
        actions={!isEditing && (
          <Button onClick={() => setIsEditing(true)}><Edit3 className="w-4 h-4 mr-2" /> Edit Profile</Button>
        )}
      />
      <Card className="shadow-xl max-w-2xl mx-auto">
        <CardHeader className="items-center text-center pb-4">
          <div className="relative">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
              <AvatarImage src={formData.fotoPerfil || "https://placehold.co/200x200.png"} alt={formData.nombre || ''} data-ai-hint="user custom avatar" />
              <AvatarFallback>{formData.nombre ? getInitials(formData.nombre) : 'U'}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button size="icon" variant="outline" className="absolute bottom-4 right-0 rounded-full bg-background">
                <Edit3 className="w-4 h-4" />
                <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" disabled /> 
                {/* File input is for UI demo, actual upload needs backend */}
              </Button>
            )}
          </div>
          <CardTitle className="text-2xl font-headline">{formData.nombre}</CardTitle>
          <CardDescription className="text-muted-foreground">{user.rol}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="nombre" className="flex items-center text-muted-foreground"><Edit3 className="w-4 h-4 mr-2" /> Full Name</Label>
              {isEditing ? (
                <Input id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleInputChange} />
              ) : (
                <p className="text-lg text-foreground mt-1">{formData.nombre}</p>
              )}
            </div>
            <div>
              <Label htmlFor="correo" className="flex items-center text-muted-foreground"><Mail className="w-4 h-4 mr-2" /> Email</Label>
              {isEditing ? (
                <Input id="correo" name="correo" type="email" value={formData.correo || ''} onChange={handleInputChange} />
              ) : (
                <p className="text-lg text-foreground mt-1">{formData.correo}</p>
              )}
            </div>
            <div>
              <Label htmlFor="telefono" className="flex items-center text-muted-foreground"><Phone className="w-4 h-4 mr-2" /> Phone</Label>
              {isEditing ? (
                <Input id="telefono" name="telefono" type="tel" value={formData.telefono || ''} onChange={handleInputChange} placeholder="e.g., 555-123-4567" />
              ) : (
                <p className="text-lg text-foreground mt-1">{formData.telefono || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="ubicacion" className="flex items-center text-muted-foreground"><MapPin className="w-4 h-4 mr-2" /> Location</Label>
              {isEditing ? (
                <Input id="ubicacion" name="ubicacion" value={formData.ubicacion || ''} onChange={handleInputChange} placeholder="e.g., Rural Town, XYZ" />
              ) : (
                <p className="text-lg text-foreground mt-1">{formData.ubicacion || 'Not provided'}</p>
              )}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); if(user) setFormData(user);}}>Cancel</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </MainLayout>
  );
}
