/*
# SEVORA Schema — Tables Only

Creates all tables first. Policies added in a separate migration
so cross-table references (profiles → appointments) resolve correctly.
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'patient',
  avatar_color text DEFAULT '#2563eb',
  location text,
  age integer,
  date_of_birth text,
  gender text,
  blood_group text,
  address text,
  village text,
  district text,
  state text,
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_phone text,
  allergies text[] DEFAULT '{}',
  existing_conditions text[] DEFAULT '{}',
  current_medications text,
  medical_history text,
  qualification text,
  specialization text,
  years_experience integer,
  facility text,
  languages text[] DEFAULT '{}',
  available_days text[] DEFAULT '{}',
  available_times text,
  online_consultation boolean DEFAULT true,
  offline_consultation boolean DEFAULT true,
  license_no text,
  worker_type text,
  health_center text,
  experience text,
  registered_at text DEFAULT to_char(now(), 'YYYY-MM-DD')
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  doctor_name text NOT NULL,
  specialization text NOT NULL DEFAULT '',
  date text NOT NULL,
  time text NOT NULL,
  type text NOT NULL DEFAULT 'teleconsultation',
  status text NOT NULL DEFAULT 'pending',
  reason text NOT NULL DEFAULT '',
  meet_link text,
  meeting_id text,
  location text,
  meeting_status text,
  patient_joined_at timestamptz,
  doctor_joined_at timestamptz,
  meeting_started_at timestamptz,
  meeting_ended_at timestamptz,
  completed_by text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);

-- Health records
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date text NOT NULL,
  type text NOT NULL DEFAULT 'consultation',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  doctor_name text,
  doctor_id uuid,
  facility text,
  added_by text NOT NULL,
  added_by_role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_records_patient_id ON health_records(patient_id);

-- Consultations
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  doctor_name text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  duration integer DEFAULT 30,
  type text NOT NULL DEFAULT 'teleconsultation',
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  from_facility text NOT NULL,
  to_facility text NOT NULL,
  reason text NOT NULL DEFAULT '',
  date text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'routine',
  doctor_name text NOT NULL DEFAULT '',
  doctor_id uuid,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON referrals(patient_id);

-- Lab tests
CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  test_name text NOT NULL,
  lab_name text NOT NULL DEFAULT '',
  date text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  result text,
  report_url text,
  cost numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lab_tests_patient_id ON lab_tests(patient_id);
