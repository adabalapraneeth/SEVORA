import { createClient } from '@supabase/supabase-js';
import type { User, Appointment, HealthRecord, Consultation, Referral, LabTest } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// === Type mappers: DB row → App type ===

type ProfileRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar_color: string;
  location: string | null;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  address: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  allergies: string[] | null;
  existing_conditions: string[] | null;
  current_medications: string | null;
  medical_history: string | null;
  qualification: string | null;
  specialization: string | null;
  years_experience: number | null;
  facility: string | null;
  languages: string[] | null;
  available_days: string[] | null;
  available_times: string | null;
  online_consultation: boolean | null;
  offline_consultation: boolean | null;
  license_no: string | null;
  worker_type: string | null;
  health_center: string | null;
  experience: string | null;
  registered_at: string | null;
};

export function mapProfileToUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role as User['role'],
    avatarColor: row.avatar_color,
    location: row.location ?? undefined,
    age: row.age ?? undefined,
    dateOfBirth: row.date_of_birth ?? undefined,
    gender: row.gender ?? undefined,
    bloodGroup: row.blood_group ?? undefined,
    address: row.address ?? undefined,
    village: row.village ?? undefined,
    district: row.district ?? undefined,
    state: row.state ?? undefined,
    emergencyContactName: row.emergency_contact_name ?? undefined,
    emergencyContactRelationship: row.emergency_contact_relationship ?? undefined,
    emergencyContactPhone: row.emergency_contact_phone ?? undefined,
    allergies: row.allergies ?? [],
    existingConditions: row.existing_conditions ?? [],
    currentMedications: row.current_medications ?? undefined,
    medicalHistory: row.medical_history ?? undefined,
    qualification: row.qualification ?? undefined,
    specialization: row.specialization ?? undefined,
    yearsExperience: row.years_experience ?? undefined,
    facility: row.facility ?? undefined,
    languages: row.languages ?? [],
    availableDays: row.available_days ?? [],
    availableTimes: row.available_times ?? undefined,
    onlineConsultation: row.online_consultation ?? undefined,
    offlineConsultation: row.offline_consultation ?? undefined,
    licenseNo: row.license_no ?? undefined,
    workerType: row.worker_type ?? undefined,
    healthCenter: row.health_center ?? undefined,
    experience: row.experience ?? undefined,
    registeredAt: row.registered_at ?? new Date().toISOString().split('T')[0],
  };
}

type AppointmentRow = {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  doctor_name: string;
  specialization: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reason: string;
  meet_link: string | null;
  meeting_id: string | null;
  location: string | null;
  meeting_status: string | null;
  patient_joined_at: string | null;
  doctor_joined_at: string | null;
  meeting_started_at: string | null;
  meeting_ended_at: string | null;
  completed_by: string | null;
};

export function mapAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    patientName: row.patient_name,
    doctorName: row.doctor_name,
    specialization: row.specialization,
    date: row.date,
    time: row.time,
    type: row.type as Appointment['type'],
    status: row.status as Appointment['status'],
    reason: row.reason,
    meetLink: row.meet_link ?? undefined,
    meetingId: row.meeting_id ?? undefined,
    location: row.location ?? undefined,
    meetingStatus: row.meeting_status as Appointment['meetingStatus'],
    patientJoinedAt: row.patient_joined_at ?? undefined,
    doctorJoinedAt: row.doctor_joined_at ?? undefined,
    meetingStartedAt: row.meeting_started_at ?? undefined,
    meetingEndedAt: row.meeting_ended_at ?? undefined,
    completedBy: row.completed_by as Appointment['completedBy'],
  };
}

type HealthRecordRow = {
  id: string;
  patient_id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  doctor_name: string | null;
  doctor_id: string | null;
  facility: string | null;
  added_by: string;
  added_by_role: string;
};

export function mapHealthRecord(row: HealthRecordRow): HealthRecord {
  return {
    id: row.id,
    patientId: row.patient_id,
    date: row.date,
    type: row.type as HealthRecord['type'],
    title: row.title,
    description: row.description,
    doctorName: row.doctor_name ?? undefined,
    doctorId: row.doctor_id ?? undefined,
    facility: row.facility ?? undefined,
    addedBy: row.added_by,
    addedByRole: row.added_by_role as HealthRecord['addedByRole'],
  };
}

type ConsultationRow = {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  doctor_name: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  notes: string | null;
};

export function mapConsultation(row: ConsultationRow): Consultation {
  return {
    id: row.id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    patientName: row.patient_name,
    doctorName: row.doctor_name,
    date: row.date,
    time: row.time,
    duration: row.duration,
    type: row.type as Consultation['type'],
    status: row.status as Consultation['status'],
    notes: row.notes ?? undefined,
  };
}

type ReferralRow = {
  id: string;
  patient_id: string;
  patient_name: string;
  from_facility: string;
  to_facility: string;
  reason: string;
  date: string;
  status: string;
  priority: string;
  doctor_name: string;
  doctor_id: string | null;
  notes: string;
};

export function mapReferral(row: ReferralRow): Referral {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    fromFacility: row.from_facility,
    toFacility: row.to_facility,
    reason: row.reason,
    date: row.date,
    status: row.status as Referral['status'],
    priority: row.priority as Referral['priority'],
    doctorName: row.doctor_name,
    notes: row.notes,
  };
}

type LabTestRow = {
  id: string;
  patient_id: string;
  patient_name: string;
  test_name: string;
  lab_name: string;
  date: string;
  status: string;
  result: string | null;
  report_url: string | null;
  cost: number;
};

export function mapLabTest(row: LabTestRow): LabTest {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    testName: row.test_name,
    labName: row.lab_name,
    date: row.date,
    status: row.status as LabTest['status'],
    result: row.result ?? undefined,
    reportUrl: row.report_url ?? undefined,
    cost: row.cost,
  };
}

// === Query helpers ===

export async function fetchDoctors(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'doctor')
    .order('name');
  if (error) throw error;
  return (data as ProfileRow[]).map(mapProfileToUser);
}

export async function fetchUserAppointments(userId: string, role: string): Promise<Appointment[]> {
  const col = role === 'doctor' ? 'doctor_id' : 'patient_id';
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq(col, userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as AppointmentRow[]).map(mapAppointment);
}

export async function fetchHealthRecords(patientId: string): Promise<HealthRecord[]> {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as HealthRecordRow[]).map(mapHealthRecord);
}

export async function fetchConsultations(doctorId: string): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as ConsultationRow[]).map(mapConsultation);
}

export async function fetchReferrals(patientId: string, doctorId?: string): Promise<Referral[]> {
  let query = supabase.from('referrals').select('*');
  if (doctorId) {
    query = query.or(`patient_id.eq.${patientId},doctor_id.eq.${doctorId}`);
  } else {
    query = query.eq('patient_id', patientId);
  }
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  return (data as ReferralRow[]).map(mapReferral);
}

export async function fetchLabTests(patientId: string): Promise<LabTest[]> {
  const { data, error } = await supabase
    .from('lab_tests')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as LabTestRow[]).map(mapLabTest);
}

export async function fetchPatientProfile(patientId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', patientId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapProfileToUser(data as ProfileRow);
}

export async function insertAppointment(
  patientId: string,
  patientName: string,
  doctorId: string,
  doctorName: string,
  specialization: string,
  date: string,
  time: string,
  type: 'in-person' | 'teleconsultation',
  reason: string,
  meetingId?: string,
  location?: string,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: patientId,
      patient_name: patientName,
      doctor_id: doctorId,
      doctor_name: doctorName,
      specialization,
      date,
      time,
      type,
      status: 'pending',
      reason,
      meeting_id: meetingId,
      location,
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapAppointment(data as AppointmentRow);
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status'],
): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function insertHealthRecord(record: {
  patient_id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  doctor_name?: string;
  doctor_id?: string;
  facility?: string;
  added_by: string;
  added_by_role: string;
}): Promise<HealthRecord> {
  const { data, error } = await supabase
    .from('health_records')
    .insert(record)
    .select('*')
    .single();
  if (error) throw error;
  return mapHealthRecord(data as HealthRecordRow);
}
