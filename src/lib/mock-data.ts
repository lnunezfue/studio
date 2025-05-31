
import type { Hospital, Specialist, Appointment, TelemedicineSession, User, ActiveTreatment, MedicalRecord } from '@/types';

// Helper function to generate future ISO date-time strings
const getFutureSlot = (daysInFuture: number, hour: number, minute: number = 0): string => {
  const dt = new Date();
  dt.setDate(dt.getDate() + daysInFuture);
  dt.setHours(hour, minute, 0, 0);
  return dt.toISOString();
};

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
    horariosDisponibles: [
      getFutureSlot(1, 9, 0),   // Tomorrow 9:00 AM
      getFutureSlot(1, 10, 0),  // Tomorrow 10:00 AM
      getFutureSlot(1, 11, 30), // Tomorrow 11:30 AM
      getFutureSlot(2, 14, 0),  // Day after tomorrow 2:00 PM
      getFutureSlot(2, 15, 0),  // Day after tomorrow 3:00 PM
      getFutureSlot(3, 9, 0),   // In 3 days 9:00 AM
      getFutureSlot(3, 10, 30), // In 3 days 10:30 AM
      getFutureSlot(4, 16, 0),  // In 4 days 4:00 PM
    ],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Médica general con 5 años de experiencia en atención primaria.',
  },
  {
    id: 'specialist2',
    nombre: 'Dr. Carlos López',
    especialidad: 'Pediatría',
    hospitalID: 'hospital1',
    horariosDisponibles: [
      getFutureSlot(1, 11, 0),  // Tomorrow 11:00 AM
      getFutureSlot(1, 12, 0),  // Tomorrow 12:00 PM
      getFutureSlot(2, 9, 0),   // Day after tomorrow 9:00 AM
      getFutureSlot(2, 10, 0),  // Day after tomorrow 10:00 AM
      getFutureSlot(3, 14, 30), // In 3 days 2:30 PM
      getFutureSlot(4, 10, 0),  // In 4 days 10:00 AM
    ],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Pediatra dedicado al cuidado de la salud infantil.',
  },
  {
    id: 'specialist3',
    nombre: 'Dra. Laura Torres',
    especialidad: 'Ginecología',
    hospitalID: 'hospital2',
    horariosDisponibles: [
      getFutureSlot(1, 15, 0),  // Tomorrow 3:00 PM
      getFutureSlot(1, 16, 0),  // Tomorrow 4:00 PM
      getFutureSlot(2, 10, 30), // Day after tomorrow 10:30 AM
      getFutureSlot(2, 11, 30), // Day after tomorrow 11:30 AM
      getFutureSlot(3, 16, 0),  // In 3 days 4:00 PM
      getFutureSlot(4, 11, 0),  // In 4 days 11:00 AM
    ],
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
    fechaHora: getFutureSlot(2, 10, 0), // In 2 days, ensuring it's likely bookable
    estado: 'programada',
    recordatorioActivado: true,
    razonConsulta: 'Chequeo general anual.',
  },
  {
    id: 'apt2',
    pacienteID: 'user1',
    especialistaID: 'specialist2',
    hospitalID: 'hospital1',
    fechaHora: getFutureSlot(5, 11, 0), // In 5 days
    estado: 'programada',
    recordatorioActivado: false,
    razonConsulta: 'Vacunación infantil.',
  },
   {
    id: 'apt3',
    pacienteID: 'user1',
    especialistaID: 'specialist3',
    hospitalID: 'hospital2',
    fechaHora: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    estado: 'completada',
    recordatorioActivado: false,
    notas: "Consulta de rutina, todo en orden.",
    razonConsulta: 'Control ginecológico.',
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
    documentUrl: 'https://placehold.co/200x300.png?text=LabResults', 
    dataAiHint: 'lab results document' 
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

    