
import type { Hospital, Specialist, Appointment, TelemedicineSession, User, ActiveTreatment, MedicalRecord, Vaccine, NotificationMessage } from '@/types';

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
  fotoPerfil: 'https://images.unsplash.com/photo-1564091521058-3ec9215286b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxMdWlzfGVufDB8fHx8MTc0ODczMjMzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  telefono: '555-1234',
  ubicacion: 'Tacna, Tacna',
};

export const mockHospitals: Hospital[] = [
  {
    id: 'hosp-unanue-tacna',
    nombre: 'Hospital Hipólito Unanue de Tacna',
    direccion: 'Av. Hipólito Unanue 1350, Tacna 23002, Perú',
    geolocalizacion: { lat: -18.0038, lng: -70.2442 },
    tipo: 'Hospital Regional',
    estadoConsultorios: [
        { consultorioId: 'c101', ocupado: false }, 
        { consultorioId: 'c102', ocupado: true },
        { consultorioId: 'c103', ocupado: false },
    ],
    imagenUrl: 'https://www.defensoria.gob.pe/wp-content/uploads/2020/07/Hospital-del-Ni%C3%B1o-Lima.jpg',
    serviciosOfrecidos: ["Emergencia 24h", "UCI", "Cirugía General", "Pediatría", "Ginecología", "Laboratorio Clínico", "Radiología"],
    insumosClave: ["Oxígeno Medicinal", "Antibióticos de Amplio Espectro", "Equipos de Protección Personal"],
  },
  {
    id: 'hosp-essalud-tacna',
    nombre: 'Hospital III Daniel Alcides Carrión - EsSalud Tacna',
    direccion: 'Prolongación Pizarro S/N, Tacna 23001, Perú',
    geolocalizacion: { lat: -18.0095, lng: -70.2490 },
    tipo: 'Hospital de EsSalud',
    estadoConsultorios: [
        { consultorioId: 'e201', ocupado: true }, 
        { consultorioId: 'e202', ocupado: false }
    ],
    imagenUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Letrero_del_Hospital_de_Medina_del_Campo.JPG/500px-Letrero_del_Hospital_de_Medina_del_Campo.JPG',
    serviciosOfrecidos: ["Consulta Externa", "Medicina Interna", "Traumatología", "Farmacia", "Rehabilitación"],
    insumosClave: ["Medicamentos Crónicos", "Material Ortopédico", "Vacunas"],
  },
  {
    id: 'clin-promedic-tacna',
    nombre: 'Clínica Promedic Tacna',
    direccion: 'Av. Bolognesi 1002, Tacna 23001, Perú',
    geolocalizacion: { lat: -18.0103, lng: -70.2521 },
    tipo: 'Clínica Privada',
    estadoConsultorios: [
        { consultorioId: 'p301', ocupado: false },
        { consultorioId: 'p302', ocupado: false },
    ],
    imagenUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Mater_dei.JPG/500px-Mater_dei.JPG',
    serviciosOfrecidos: ["Especialidades Médicas", "Chequeos Preventivos", "Ecografías", "Odontología"],
    insumosClave: ["Insumos Dentales", "Material de Diagnóstico Rápido"],
  },
];

export const mockSpecialists: Specialist[] = [
  {
    id: 'specialist1',
    nombre: 'Dr. Ana García Pérez',
    especialidad: 'Medicina General',
    hospitalID: 'hosp-unanue-tacna',
    horariosDisponibles: [
      getFutureSlot(1, 9, 0), getFutureSlot(1, 10, 0), getFutureSlot(1, 11, 30),
      getFutureSlot(2, 14, 0), getFutureSlot(2, 15, 0), getFutureSlot(3, 9, 0),
      getFutureSlot(3, 10, 30), getFutureSlot(4, 16, 0),
    ],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Médica general con 5 años de experiencia en atención primaria en Tacna.',
  },
  {
    id: 'specialist2',
    nombre: 'Dr. Carlos López Mendoza',
    especialidad: 'Pediatría',
    hospitalID: 'hosp-essalud-tacna',
    horariosDisponibles: [
      getFutureSlot(1, 11, 0), getFutureSlot(1, 12, 0), getFutureSlot(2, 9, 0),
      getFutureSlot(2, 10, 0), getFutureSlot(3, 14, 30), getFutureSlot(4, 10, 0),
    ],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Pediatra dedicado al cuidado de la salud infantil en EsSalud.',
  },
  {
    id: 'specialist3',
    nombre: 'Dra. Laura Torres Quispe',
    especialidad: 'Ginecología',
    hospitalID: 'clin-promedic-tacna',
    horariosDisponibles: [
      getFutureSlot(1, 15, 0), getFutureSlot(1, 16, 0), getFutureSlot(2, 10, 30),
      getFutureSlot(2, 11, 30), getFutureSlot(3, 16, 0), getFutureSlot(4, 11, 0),
    ],
    fotoPerfilUrl: 'https://placehold.co/100x100.png',
    descripcion: 'Especialista en salud femenina y obstetricia en Clínica Promedic.',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    pacienteID: 'user1',
    especialistaID: 'specialist1',
    hospitalID: 'hosp-unanue-tacna',
    fechaHora: getFutureSlot(2, 10, 0), 
    estado: 'programada',
    recordatorioActivado: true,
    razonConsulta: 'Chequeo general anual.',
  },
  {
    id: 'apt2',
    pacienteID: 'user1',
    especialistaID: 'specialist2',
    hospitalID: 'hosp-essalud-tacna',
    fechaHora: getFutureSlot(5, 11, 0),
    estado: 'programada',
    recordatorioActivado: false,
    razonConsulta: 'Vacunación infantil.',
  },
   {
    id: 'apt3',
    pacienteID: 'user1',
    especialistaID: 'specialist3',
    hospitalID: 'clin-promedic-tacna',
    fechaHora: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
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
    fechaHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
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
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
    prescribingDoctor: 'Dr. Ana García Pérez',
    dosage: '1 pastilla (10mg)',
    frequency: 'Cada 24 horas',
  },
  {
    id: 'treat2',
    name: 'Suplemento Vitamínico',
    description: 'Complejo vitamínico para deficiencia leve.',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
    prescribingDoctor: 'Dr. Carlos López Mendoza',
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
    doctorName: 'Dr. Ana García Pérez',
  },
  {
    id: 'hist2',
    type: 'Prescripción',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Lisinopril 10mg',
    summary: 'Prescripción de Lisinopril 10mg, 1 comprimido al día.',
    doctorName: 'Dr. Ana García Pérez',
    details: { medicamento: 'Lisinopril', dosis: '10mg', frecuencia: '1 vez al día' }
  },
  {
    id: 'hist3',
    type: 'Resultado de Laboratorio',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Perfil Lipídico',
    summary: 'Colesterol total: 190 mg/dL, LDL: 110 mg/dL, HDL: 50 mg/dL. Dentro de rangos aceptables.',
    doctorName: 'Laboratorio Hospital Unanue',
    documentUrl: 'https://placehold.co/200x300.png?text=LabResults', 
  },
  {
    id: 'hist4',
    type: 'Vacunación',
    date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Vacuna Antigripal 2023',
    summary: 'Administración de vacuna contra la influenza estacional.',
    doctorName: 'Enfermería EsSalud Tacna',
  },
  {
    id: 'hist5',
    type: 'Nota de Progreso',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Seguimiento de resfriado común',
    summary: 'Paciente refiere mejoría de síntomas de resfriado. Continúa con reposo e hidratación.',
    doctorName: 'Dr. Ana García Pérez (Telemedicina)',
  }
];

const vaccineUnsplashUrl = "https://images.unsplash.com/photo-1674049406313-abb5511e0111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxncmlwZXxlbnwwfHx8fDE3NDg3MzI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080";

export const mockVaccines: Vaccine[] = [
  {
    id: 'vac-flu-2024',
    nombre: 'Vacuna Antigripal Estacional 2024',
    descripcion: 'Protección contra las cepas de influenza más comunes para la temporada actual.',
    stockDisponible: 50,
    hospitalID: 'hosp-unanue-tacna',
    listaEspera: [],
    minAge: 0.5, // 6 meses
    dosesRequired: 1,
    provider: 'MINSA',
    imageUrl: vaccineUnsplashUrl,
  },
  {
    id: 'vac-covid-bivalente',
    nombre: 'Vacuna COVID-19 Bivalente Refuerzo',
    descripcion: 'Refuerzo actualizado para protección contra variantes de COVID-19.',
    stockDisponible: 0,
    hospitalID: 'hosp-essalud-tacna',
    listaEspera: ['user1'], // mockUser is on this waitlist
    minAge: 12,
    dosesRequired: 1,
    provider: 'EsSalud / Pfizer',
    imageUrl: vaccineUnsplashUrl,
  },
  {
    id: 'vac-vph',
    nombre: 'Vacuna VPH (Virus del Papiloma Humano)',
    descripcion: 'Prevención contra tipos de VPH que pueden causar cáncer.',
    stockDisponible: 20,
    hospitalID: 'clin-promedic-tacna',
    listaEspera: [],
    minAge: 9,
    maxAge: 26,
    dosesRequired: 2, // o 3 según edad
    provider: 'Clínica Privada / Gardasil 9',
    imageUrl: vaccineUnsplashUrl,
  },
  {
    id: 'vac-neumococo',
    nombre: 'Vacuna Neumococo Polisacárida',
    descripcion: 'Protección contra infecciones por neumococo para adultos mayores o con condiciones de riesgo.',
    stockDisponible: 0,
    hospitalID: 'hosp-unanue-tacna',
    listaEspera: [],
    minAge: 65,
    dosesRequired: 1,
    provider: 'MINSA',
    imageUrl: vaccineUnsplashUrl,
  }
];

export let mockNotifications: NotificationMessage[] = [
  {
    id: 'notif1',
    userID: 'user1',
    title: 'Recordatorio de Cita',
    mensaje: 'Tu cita con Dr. Ana García Pérez es mañana a las 10:00 AM.',
    tipo: 'cita',
    fechaEnvio: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    leida: false,
    detailsUrl: '/appointments'
  },
  {
    id: 'notif2',
    userID: 'user1',
    title: 'Vacuna COVID-19 Disponible',
    mensaje: '¡Buenas noticias! La vacuna COVID-19 Bivalente por la que estabas en lista de espera ya está disponible en Hospital EsSalud Tacna. Agenda tu dosis.',
    tipo: 'vacuna',
    fechaEnvio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    leida: true,
    detailsUrl: '/vaccines#vac-covid-bivalente'
  },
  {
    id: 'notif3',
    userID: 'user1',
    title: 'Resultados de Laboratorio Listos',
    mensaje: 'Tus resultados del perfil lipídico están listos para ser vistos.',
    tipo: 'general',
    fechaEnvio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    leida: false,
    detailsUrl: '/medical-history'
  }
];


    
