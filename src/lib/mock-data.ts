
import type { Hospital, Specialist, Appointment, TelemedicineSession, User, ActiveTreatment, MedicalRecord } from '@/types';

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
    serviciosOfrecidos: ["Emergencia 24h", "Radiología", "Laboratorio Clínico", "Consulta General"],
    insumosClave: ["Vacuna Antigripal", "Antibióticos Comunes", "Material de Curación"],
  },
  {
    id: 'hospital2',
    nombre: 'Clínica Esperanza',
    direccion: 'Avenida del Sol 45, Villa Serena',
    geolocalizacion: { lat: 19.4000, lng: -99.1000 },
    tipo: 'Clínica Rural',
    estadoConsultorios: [{ consultorioId: 'c1', ocupado: true }],
    imagenUrl: 'https://placehold.co/600x400.png',
    serviciosOfrecidos: ["Consulta Pediátrica", "Control Prenatal", "Vacunación"],
    insumosClave: ["Vacunas Pediátricas", "Suplementos Vitamínicos"],
  },
];

export const mockSpecialists: Specialist[] = [
  {
    id: 'specialist1',
    nombre: 'Dr. Ana García',
    especialidad: 'Medicina General',
    hospitalID: 'hospital1',
    horariosDisponibles: ['2024-08-01T09:00:00', '2024-08-01T10:00:00', '2024-08-02T14:00:00', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T10:00:00'],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Médica general con 5 años de experiencia en atención primaria.',
  },
  {
    id: 'specialist2',
    nombre: 'Dr. Carlos López',
    especialidad: 'Pediatría',
    hospitalID: 'hospital1',
    horariosDisponibles: ['2024-08-01T11:00:00', '2024-08-03T09:00:00', new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T11:00:00'],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Pediatra dedicado al cuidado de la salud infantil.',
  },
  {
    id: 'specialist3',
    nombre: 'Dra. Laura Torres',
    especialidad: 'Ginecología',
    hospitalID: 'hospital2',
    horariosDisponibles: ['2024-08-02T10:00:00', '2024-08-02T11:00:00', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T15:00:00'],
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
   {
    id: 'apt3',
    pacienteID: 'user1',
    especialistaID: 'specialist3',
    hospitalID: 'hospital2',
    fechaHora: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    estado: 'completada',
    recordatorioActivado: false,
    notas: "Consulta de rutina, todo en orden."
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

export const mockActiveTreatments: ActiveTreatment[] = [
  {
    id: 'treat1',
    name: 'Tratamiento para Hipertensión',
    description: 'Medicación diaria para controlar la presión arterial.',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    prescribingDoctor: 'Dr. Ana García',
    dosage: '1 pastilla (10mg)',
    frequency: 'Cada 24 horas',
  },
  {
    id: 'treat2',
    name: 'Suplemento Vitamínico',
    description: 'Complejo vitamínico para deficiencia leve.',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    prescribingDoctor: 'Dr. Carlos López',
    dosage: '1 cápsula',
    frequency: 'Con el desayuno',
  }
];

export const mockMedicalHistory: MedicalRecord[] = [
  {
    id: 'hist1',
    type: 'Diagnóstico',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Hipertensión Arterial Leve',
    summary: 'Paciente diagnosticado con hipertensión arterial leve, se inicia tratamiento y seguimiento.',
    doctorName: 'Dr. Ana García',
  },
  {
    id: 'hist2',
    type: 'Prescripción',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Lisinopril 10mg',
    summary: 'Prescripción de Lisinopril 10mg, 1 comprimido al día.',
    doctorName: 'Dr. Ana García',
    details: { medicamento: 'Lisinopril', dosis: '10mg', frecuencia: '1 vez al día' }
  },
  {
    id: 'hist3',
    type: 'Resultado de Laboratorio',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Perfil Lipídico',
    summary: 'Colesterol total: 190 mg/dL, LDL: 110 mg/dL, HDL: 50 mg/dL. Dentro de rangos aceptables.',
    doctorName: 'Laboratorio Central',
    documentUrl: 'https://placehold.co/200x300.png?text=LabResults', // Mock document
  },
  {
    id: 'hist4',
    type: 'Vacunación',
    date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Vacuna Antigripal 2023',
    summary: 'Administración de vacuna contra la influenza estacional.',
    doctorName: 'Enfermería Hospital Central',
  },
  {
    id: 'hist5',
    type: 'Nota de Progreso',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Seguimiento de resfriado común',
    summary: 'Paciente refiere mejoría de síntomas de resfriado. Continúa con reposo e hidratación.',
    doctorName: 'Dr. Ana García (Telemedicina)',
  }
];
