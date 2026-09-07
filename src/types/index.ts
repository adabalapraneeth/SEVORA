export type Role = 'patient' | 'doctor' | 'healthcare_worker' | 'admin';

export type Language = 'en' | 'hi' | 'es' | 'fr';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarColor: string;
  location?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  specialization?: string;
  facility?: string;
  licenseNo?: string;
  registeredAt: string;
  // Patient-specific
  dateOfBirth?: string;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  existingConditions?: string[];
  currentMedications?: string;
  medicalHistory?: string;
  // Doctor-specific
  qualification?: string;
  yearsExperience?: number;
  languages?: string[];
  availableDays?: string[];
  availableTimes?: string;
  onlineConsultation?: boolean;
  offlineConsultation?: boolean;
  // Healthcare worker-specific
  workerType?: string;
  healthCenter?: string;
  experience?: string;
}

export interface EmergencyContactInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  scheme: string;
  idNumber: string;
  coverage: string;
  validTill: string;
}

export interface MedicationInfo {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  prescribedBy: string;
}

export interface VaccinationInfo {
  name: string;
  date: string;
  nextDue?: string;
  administeredBy: string;
}

export interface SurgeryInfo {
  name: string;
  date: string;
  hospital: string;
  notes: string;
}

export interface MedicalHistoryEntry {
  condition: string;
  diagnosedDate: string;
  status: 'ongoing' | 'resolved' | 'managed';
  notes: string;
}

export interface PatientProfile {
  id: string;
  patientId: string;
  // Demographics
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  location: string;
  address: string;
  // Contact
  phone: string;
  email: string;
  // Emergency contact
  emergencyContact: EmergencyContactInfo;
  // Medical
  allergies: string[];
  chronicConditions: string[];
  currentMedications: MedicationInfo[];
  medicalHistory: MedicalHistoryEntry[];
  vaccinations: VaccinationInfo[];
  surgeries: SurgeryInfo[];
  // Insurance
  insurance: InsuranceInfo;
  // Lifestyle
  height?: string;
  weight?: string;
  bmi?: number;
  smokingStatus?: string;
  alcoholUse?: string;
  // Metadata
  registeredAt: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'diagnosis' | 'prescription' | 'test_result' | 'vaccination' | 'allergy' | 'consultation' | 'referral' | 'follow_up';
  title: string;
  description: string;
  doctorName?: string;
  doctorId?: string;
  facility?: string;
  attachments?: string[];
  addedBy: string;
  addedByRole: Role;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  facility: string;
  experience: number;
  rating: number;
  consultationFee: number;
  available: boolean;
  nextAvailable: string;
  languages: string[];
  about: string;
  avatarColor: string;
}

export type MeetingStatus =
  | 'scheduled'
  | 'meeting_soon'
  | 'waiting_for_patient'
  | 'waiting_for_doctor'
  | 'in_progress'
  | 'completed'
  | 'patient_did_not_join'
  | 'doctor_did_not_join'
  | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  type: 'in-person' | 'teleconsultation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  meetLink?: string;
  meetingId?: string;
  location?: string;
  meetingStatus?: MeetingStatus;
  patientJoinedAt?: string;
  doctorJoinedAt?: string;
  meetingStartedAt?: string;
  meetingEndedAt?: string;
  completedBy?: 'doctor' | 'patient' | 'system';
}

export interface Hospital {
  id: string;
  name: string;
  type: 'hospital' | 'phc' | 'clinic' | 'pharmacy' | 'lab';
  address: string;
  distance: number;
  phone: string;
  open24h: boolean;
  services: string[];
  lat: number;
  lng: number;
  rating: number;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  fromFacility: string;
  toFacility: string;
  reason: string;
  date: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  priority: 'routine' | 'urgent' | 'emergency';
  doctorName: string;
  notes: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  labName: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  result?: string;
  reportUrl?: string;
  cost: number;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  pharmacy: string;
  price: number;
  inStock: boolean;
}

export interface Reminder {
  id: string;
  patientId: string;
  title: string;
  type: 'follow_up' | 'medication' | 'test' | 'vaccination';
  date: string;
  time: string;
  done: boolean;
  doctorName?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available24h: boolean;
}

export interface UrgencyGuidance {
  symptom: string;
  level: 'self_care' | 'see_doctor' | 'urgent' | 'emergency';
  advice: string;
  recommendations: string[];
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: 'teleconsultation' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'referral' | 'reminder' | 'lab' | 'general';
  date: string;
  read: boolean;
}
