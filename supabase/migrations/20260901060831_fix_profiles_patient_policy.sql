/*
# Fix: profiles patient select policy for doctors

The previous policy had a bug: it checked `appointments.patient_id = appointments.id`
(self-referential) instead of `appointments.patient_id = profiles.id`.
This fix drops and recreates the policy correctly so doctors can see
profiles of patients who have appointments with them.
*/

DROP POLICY IF EXISTS "select_patient_profiles_for_doctors" ON profiles;
CREATE POLICY "select_patient_profiles_for_doctors" ON profiles FOR SELECT
  TO authenticated USING (
    role = 'patient' AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.doctor_id = auth.uid() AND appointments.patient_id = profiles.id
    )
  );
