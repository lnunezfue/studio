
export interface User {
  id: string;
  nombre: string;
  rol: 'paciente' | 'medico' | 'administrador';
  correo: string;
  telefono?: string;
  ubicacion?: string;
  fotoPerfil?: string; // URL to image
}

export interface Hospital {
  id: string;
  nombre: string;
  direccion: string;
  geolocalizacion?: { lat: number; lng: number };
  tipo?: string; // e.g., General, Rural Clinic
  estadoConsultorios?: { consultorioId: string; ocupado: boolean }[]; // Simplified
  imagenUrl?: string; // URL to image
  serviciosOfrecidos?: string[]; // New: e.g., ["Radiología", "Laboratorio", "Emergencia 24h"]
  insumosClave?: string[]; // New: e.g., ["Vacuna Antigripal", "Antibióticos Comunes"]
}

export interface Specialist {
  id: string;
  nombre: string;
  especialidad: string;
  hospitalID: string; // fk to Hospital
  horariosDisponibles?: string[]; // e.g., ["2024-07-15T09:00:00", "2024-07-15T10:00:00"]
  fotoPerfilUrl?: string; // URL to image
  descripcion?: string;
}

export interface Appointment {
  id: string;
  pacienteID: string; // fk to User
  especialistaID: string; // fk to Specialist
  hospitalID: string; // fk to Hospital
  fechaHora: string; // ISO string
  estado: 'programada' | 'cancelada' | 'completada';
  notas?: string;
  recordatorioActivado?: boolean;
  razonConsulta?: string; // New field for reason for consultation
}

export interface Vaccine {
  id: string;
  nombre: string;
  descripcion: string;
  stockDisponible: number;
  hospitalID: string; // fk to Hospital
  cantidadMinima?: number;
  listaEspera: string[]; // array of pacienteID
  minAge?: number; 
  maxAge?: number; 
  dosesRequired?: number;
  provider?: string; // e.g., Pfizer, Moderna
  imageUrl?: string; 
}

export interface MedicalSupply {
  id: string;
  nombre: string;
  cantidadDisponible: number;
  hospitalID: string; // fk to Hospital
  umbralCritico?: number;
}

export interface TelemedicineSession {
  id: string;
  pacienteID: string; // fk to User
  especialistaID: string; // fk to Specialist
  fechaHora: string; // ISO string
  enlaceVideollamada?: string;
  notasConsulta?: string;
  estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
}

export interface NotificationMessage {
  id: string;
  userID: string; // fk to User
  title: string;
  mensaje: string;
  tipo: 'cita' | 'vacuna' | 'insumo' | 'general';
  fechaEnvio: string; // ISO string
  leida: boolean;
  detailsUrl?: string; 
}

export interface AffluenceData {
  hospitalID: string; // fk to Hospital
  fechaHora: string; // ISO string
  cantidadPacientes: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ActiveTreatment {
  id: string;
  name: string;
  description: string;
  startDate: string; // ISO date string
  prescribingDoctor: string;
  dosage?: string;
  frequency?: string;
}

export interface MedicalRecord {
  id: string;
  type: 'Diagnóstico' | 'Prescripción' | 'Resultado de Laboratorio' | 'Nota de Progreso' | 'Vacunación';
  date: string; // ISO date string
  title: string;
  summary: string;
  doctorName?: string;
  documentUrl?: string; // Optional link to a mock document/image
  details?: Record<string, any>; // For specific fields like lab values
}

