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
}

export interface Vaccine {
  id: string;
  nombre: string;
  stockDisponible: number;
  hospitalID: string; // fk to Hospital
  cantidadMinima?: number;
  listaEspera?: string[]; // array of pacienteID
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
  mensaje: string;
  tipo: 'cita' | 'vacuna' | 'insumo' | 'general';
  fechaEnvio: string; // ISO string
  leida: boolean;
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
