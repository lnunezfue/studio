// TODO: Firebase Initialization
// This file is a placeholder for your Firebase initialization code.
// You will need to install the Firebase SDK (`npm install firebase`) and configure it with your project's credentials.

// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getFunctions } from "firebase/functions";
// import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
// let app;
// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApp();
// }

// const db = getFirestore(app);
// const auth = getAuth(app);
// const storage = getStorage(app);
// const functions = getFunctions(app); // Optional: specify region
// const messaging = typeof window !== 'undefined' ? getMessaging(app) : null; // Initialize only on client

// export { db, auth, storage, functions, messaging, app };

// --- Firestore Collection Definitions (as per proposal) ---
// `usuarios`: nombre, rol, correo, teléfono, ubicación, fotoPerfil
// `hospitales`: nombre, dirección, geolocalización, tipo, estadoConsultorios (array)
// `especialistas`: nombre, especialidad, hospitalID, horariosDisponibles
// `citas`: pacienteID, especialistaID, hospitalID, fechaHora, estado
// `vacunas`: nombre, stockDisponible, hospitalID, cantidadMinima, listaEspera (array de pacienteID)
// `insumos`: nombre, cantidadDisponible, hospitalID, umbralCritico
// `telemedicina`: pacienteID, especialistaID, fechaHora, enlaceVideollamada, notasConsulta
// `notificaciones`: userID, mensaje, tipo, fechaEnvio
// `afluencia`: hospitalID, fechaHora, cantidadPacientes

// --- Cloud Functions (conceptual names from proposal) ---
// - notifyVaccineAvailability
// - sendAppointmentReminders
// - updateHospitalAffluence
// - alertLowMedicalSupplies

// --- Firebase Security Rules ---
// Rules would need to be defined in firebase.json or through the Firebase console,
// tailored to patient, medico, and admin roles. Example concepts:
// - Patients can read their own data, appointments, and public hospital/specialist info.
// - Patients can create their own appointments.
// - Medicos can read/write appointments assigned to them, read patient data relevant to appointments.
// - Admins have broader read/write access for management.

console.warn(
  "Firebase is not fully configured. Please complete the setup in src/lib/firebase.ts " +
  "and ensure your environment variables are set for Firebase credentials. " +
  "This app currently uses mock data and client-side auth simulation."
);

// Export mock/placeholder objects if needed for the app to run without full Firebase
export const db = {}; // Placeholder
export const auth = {}; // Placeholder
export const storage = {}; // Placeholder
export const functions = {}; // Placeholder
export const messaging = null; // Placeholder
