/*
# SEVORA Schema — RLS Policies

Enables RLS on all tables and creates ownership-based policies.
- Patients see only their own data.
- Doctors see data for appointments where they are the doctor.
- Doctor profiles are readable by all authenticated users (for Find Doctors).
- Doctors/HCW/admin can insert health records and lab tests (role checked via profiles table).
*/

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;

-- === profiles ===
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "select_doctor_profiles" ON profiles;
CREATE POLICY "select_doctor_profiles" ON profiles FOR SELECT
  TO authenticated USING (role = 'doctor');

DROP POLICY IF EXISTS "select_patient_profiles_for_doctors" ON profiles;
CREATE POLICY "select_patient_profiles_for_doctors" ON profiles FOR SELECT
  TO authenticated USING (
    role = 'patient' AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.doctor_id = auth.uid() AND appointments.patient_id = id
    )
  );

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- === appointments ===
DROP POLICY IF EXISTS "select_own_appointments_patient" ON appointments;
CREATE POLICY "select_own_appointments_patient" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "select_own_appointments_doctor" ON appointments;
CREATE POLICY "select_own_appointments_doctor" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "insert_own_appointments_patient" ON appointments;
CREATE POLICY "insert_own_appointments_patient" ON appointments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "insert_own_appointments_doctor" ON appointments;
CREATE POLICY "insert_own_appointments_doctor" ON appointments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "update_own_appointments_patient" ON appointments;
CREATE POLICY "update_own_appointments_patient" ON appointments FOR UPDATE
  TO authenticated USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "update_own_appointments_doctor" ON appointments;
CREATE POLICY "update_own_appointments_doctor" ON appointments FOR UPDATE
  TO authenticated USING (auth.uid() = doctor_id) WITH CHECK (auth.uid() = doctor_id);

-- === health_records ===
DROP POLICY IF EXISTS "select_own_health_records" ON health_records;
CREATE POLICY "select_own_health_records" ON health_records FOR SELECT
  TO authenticated USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "select_health_records_for_doctors" ON health_records;
CREATE POLICY "select_health_records_for_doctors" ON health_records FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.doctor_id = auth.uid() AND appointments.patient_id = health_records.patient_id
    )
  );

DROP POLICY IF EXISTS "insert_health_records_provider" ON health_records;
CREATE POLICY "insert_health_records_provider" ON health_records FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'healthcare_worker', 'admin')
    )
  );

-- === consultations ===
DROP POLICY IF EXISTS "select_own_consultations_patient" ON consultations;
CREATE POLICY "select_own_consultations_patient" ON consultations FOR SELECT
  TO authenticated USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "select_own_consultations_doctor" ON consultations;
CREATE POLICY "select_own_consultations_doctor" ON consultations FOR SELECT
  TO authenticated USING (auth.uid() = doctor_id);

-- === referrals ===
DROP POLICY IF EXISTS "select_own_referrals_patient" ON referrals;
CREATE POLICY "select_own_referrals_patient" ON referrals FOR SELECT
  TO authenticated USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "select_referrals_for_doctors" ON referrals;
CREATE POLICY "select_referrals_for_doctors" ON referrals FOR SELECT
  TO authenticated USING (
    doctor_id = auth.uid() OR EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.doctor_id = auth.uid() AND appointments.patient_id = referrals.patient_id
    )
  );

-- === lab_tests ===
DROP POLICY IF EXISTS "select_own_lab_tests" ON lab_tests;
CREATE POLICY "select_own_lab_tests" ON lab_tests FOR SELECT
  TO authenticated USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "select_lab_tests_for_doctors" ON lab_tests;
CREATE POLICY "select_lab_tests_for_doctors" ON lab_tests FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.doctor_id = auth.uid() AND appointments.patient_id = lab_tests.patient_id
    )
  );

DROP POLICY IF EXISTS "insert_lab_tests_provider" ON lab_tests;
CREATE POLICY "insert_lab_tests_provider" ON lab_tests FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'healthcare_worker', 'admin')
    )
  );
