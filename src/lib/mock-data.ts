import type { Hospital, Specialist, Appointment, TelemedicineSession, User } from '@/types';

export const mockUser: User = {
  id: 'user1',
  nombre: 'Juan Perez',
  rol: 'paciente',
  correo: 'juan.perez@example.com',
  fotoPerfil: 'https://placehold.co/100x100.png',
  telefono: '555-1234',
  ubicacion: 'Rural Town, XYZ',
};

export const mockHospitals: Hospital[] = [
  {
    id: 'hospital1',
    nombre: 'Hospital Central Rural',
    direccion: 'Calle Principal 123, Pueblo Lejano',
    geolocalizacion: { lat: 19.4326, lng: -99.1332 },
    tipo: 'General',
    estadoConsultorios: [{ consultorioId: 'c1', ocupado: false }, { consultorioId: 'c2', ocupado: true }],
    imagenUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'hospital2',
    nombre: 'Clínica Esperanza',
    direccion: 'Avenida del Sol 45, Villa Serena',
    geolocalizacion: { lat: 19.4000, lng: -99.1000 },
    tipo: 'Clínica Rural',
    estadoConsultorios: [{ consultorioId: 'c1', ocupado: true }],
    imagenUrl: 'https://placehold.co/600x400.png',
  },
];

export const mockSpecialists: Specialist[] = [
  {
    id: 'specialist1',
    nombre: 'Dr. Ana García',
    especialidad: 'Medicina General',
    hospitalID: 'hospital1',
    horariosDisponibles: ['2024-08-01T09:00:00', '2024-08-01T10:00:00', '2024-08-02T14:00:00'],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Médica general con 5 años de experiencia en atención primaria.',
  },
  {
    id: 'specialist2',
    nombre: 'Dr. Carlos López',
    especialidad: 'Pediatría',
    hospitalID: 'hospital1',
    horariosDisponibles: ['2024-08-01T11:00:00', '2024-08-03T09:00:00'],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Pediatra dedicado al cuidado de la salud infantil.',
  },
  {
    id: 'specialist3',
    nombre: 'Dra. Laura Torres',
    especialidad: 'Ginecología',
    hospitalID: 'hospital2',
    horariosDisponibles: ['2024-08-02T10:00:00', '2024-08-02T11:00:00'],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Especialista en salud femenina y obstetricia.',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    pacienteID: 'user1',
    especialistaID: 'specialist1',
    hospitalID: 'hospital1',
    fechaHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // In 2 days
    estado: 'programada',
    recordatorioActivado: true,
  },
  {
    id: 'apt2',
    pacienteID: 'user1',
    especialistaID: 'specialist2',
    hospitalID: 'hospital1',
    fechaHora: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // In 5 days
    estado: 'programada',
    recordatorioActivado: false,
  },
];

export const mockTelemedicineSessions: TelemedicineSession[] = [
  {
    id: 'tele1',
    pacienteID: 'user1',
    especialistaID: 'specialist1',
    fechaHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    enlaceVideollamada: 'https://meet.example.com/ruralhealthhub-session1',
    notasConsulta: 'El paciente reporta síntomas leves de resfriado. Se recomienda reposo e hidratación.',
    estado: 'finalizada',
  },
];
