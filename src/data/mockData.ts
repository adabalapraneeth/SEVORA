import type {
  User, Doctor, Appointment, Hospital, Referral, LabTest,
  Medicine, Reminder, EmergencyContact, UrgencyGuidance,
  HealthRecord, Consultation, Notification, PatientProfile,
} from '@/types';

export const mockUsers: User[] = [
  {
    id: 'u1', name: 'Ramesh Kumar', email: 'ramesh@sevora.health', phone: '+91 98765 43210',
    role: 'patient', avatarColor: '#2563eb', location: 'Rampur, UP', age: 45, gender: 'Male', bloodGroup: 'B+',
    registeredAt: '2025-01-15',
  },
  {
    id: 'u2', name: 'Dr. Anita Sharma', email: 'anita@sevora.health', phone: '+91 98123 45678',
    role: 'doctor', avatarColor: '#0891b2', specialization: 'General Physician', facility: 'Rampur PHC',
    licenseNo: 'MCI-2015-45678', registeredAt: '2025-01-10',
  },
  {
    id: 'u3', name: 'Sunita Devi', email: 'sunita@sevora.health', phone: '+91 98000 11122',
    role: 'healthcare_worker', avatarColor: '#059669', facility: 'Rampur PHC', registeredAt: '2025-01-12',
  },
  {
    id: 'u4', name: 'Admin Rajesh', email: 'admin@sevora.health', phone: '+91 99000 55544',
    role: 'admin', avatarColor: '#7c3aed', location: 'District HQ', registeredAt: '2025-01-01',
  },
];

export const demoCredentials = [
  { role: 'patient', email: 'ramesh@sevora.health', password: 'demo123' },
  { role: 'doctor', email: 'anita@sevora.health', password: 'demo123' },
  { role: 'healthcare_worker', email: 'sunita@sevora.health', password: 'demo123' },
  { role: 'admin', email: 'admin@sevora.health', password: 'demo123' },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'd1', name: 'Dr. Anita Sharma', specialization: 'General Physician', facility: 'Rampur PHC',
    experience: 12, rating: 4.8, consultationFee: 200, available: true, nextAvailable: 'Today, 2:00 PM',
    languages: ['Hindi', 'English'], about: 'Experienced general physician specializing in rural healthcare and preventive medicine.',
    avatarColor: '#0891b2',
  },
  {
    id: 'd2', name: 'Dr. Vikram Singh', specialization: 'Pediatrician', facility: 'District Hospital',
    experience: 15, rating: 4.9, consultationFee: 350, available: true, nextAvailable: 'Today, 4:00 PM',
    languages: ['Hindi', 'English'], about: 'Pediatric specialist focused on child health, immunization, and nutrition.',
    avatarColor: '#2563eb',
  },
  {
    id: 'd3', name: 'Dr. Priya Reddy', specialization: 'Gynecologist', facility: 'City Medical Center',
    experience: 10, rating: 4.7, consultationFee: 400, available: false, nextAvailable: 'Tomorrow, 10:00 AM',
    languages: ['Hindi', 'English', 'Telugu'], about: 'Women\'s health specialist with expertise in maternal care.',
    avatarColor: '#db2777',
  },
  {
    id: 'd4', name: 'Dr. Mohan Das', specialization: 'Cardiologist', facility: 'Heart Care Institute',
    experience: 20, rating: 4.9, consultationFee: 800, available: true, nextAvailable: 'Today, 6:00 PM',
    languages: ['Hindi', 'English'], about: 'Senior cardiologist with 20 years of experience in heart disease management.',
    avatarColor: '#dc2626',
  },
  {
    id: 'd5', name: 'Dr. Fatima Begum', specialization: 'Dermatologist', facility: 'Skin Care Clinic',
    experience: 8, rating: 4.6, consultationFee: 300, available: true, nextAvailable: 'Tomorrow, 11:00 AM',
    languages: ['Hindi', 'Urdu', 'English'], about: 'Dermatologist treating skin conditions common in rural areas.',
    avatarColor: '#ea580c',
  },
  {
    id: 'd6', name: 'Dr. Arjun Nair', specialization: 'Orthopedic', facility: 'District Hospital',
    experience: 14, rating: 4.7, consultationFee: 500, available: false, nextAvailable: 'Aug 2, 9:00 AM',
    languages: ['Hindi', 'English', 'Malayalam'], about: 'Orthopedic surgeon specializing in bone and joint health.',
    avatarColor: '#4f46e5',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1', patientId: 'u1', patientName: 'Ramesh Kumar', doctorId: 'd1', doctorName: 'Dr. Anita Sharma',
    specialization: 'General Physician', date: '2026-08-31', time: '14:00', type: 'teleconsultation',
    status: 'confirmed', reason: 'Fever and body ache',
    meetingId: 'SEV-MTG-A1X29', meetingStatus: 'scheduled',
  },
  {
    id: 'a2', patientId: 'u1', patientName: 'Ramesh Kumar', doctorId: 'd4', doctorName: 'Dr. Mohan Das',
    specialization: 'Cardiologist', date: '2026-09-02', time: '18:00', type: 'in-person',
    status: 'pending', reason: 'Chest pain follow-up', location: 'Heart Care Institute, MG Road, Rampur',
  },
  {
    id: 'a3', patientId: 'u1', patientName: 'Ramesh Kumar', doctorId: 'd2', doctorName: 'Dr. Vikram Singh',
    specialization: 'Pediatrician', date: '2026-08-20', time: '16:00', type: 'in-person',
    status: 'completed', reason: 'Child vaccination', location: 'District Hospital, Hospital Road, Rampur',
  },
  {
    id: 'a4', patientId: 'p2', patientName: 'Kamala Devi', doctorId: 'd1', doctorName: 'Dr. Anita Sharma',
    specialization: 'General Physician', date: '2026-08-31', time: '15:00', type: 'in-person',
    status: 'confirmed', reason: 'Diabetes check-up', location: 'Rampur PHC, Main Road, Rampur',
  },
  {
    id: 'a5', patientId: 'p3', patientName: 'Mohan Lal', doctorId: 'd1', doctorName: 'Dr. Anita Sharma',
    specialization: 'General Physician', date: '2026-08-31', time: '16:30', type: 'teleconsultation',
    status: 'confirmed', reason: 'Skin rash',
    meetingId: 'SEV-MTG-A5K47', meetingStatus: 'scheduled',
  },
  {
    id: 'a6', patientId: 'u1', patientName: 'Ramesh Kumar', doctorId: 'd4', doctorName: 'Dr. Mohan Das',
    specialization: 'Cardiologist', date: '2026-08-31', time: '12:00', type: 'teleconsultation',
    status: 'confirmed', reason: 'ECG follow-up discussion',
    meetingId: 'SEV-MTG-A6D12', meetingStatus: 'completed',
    patientJoinedAt: '2026-08-31T12:00:00', doctorJoinedAt: '2026-08-31T12:01:00',
    meetingStartedAt: '2026-08-31T12:01:00', meetingEndedAt: '2026-08-31T12:22:00',
    completedBy: 'doctor',
  },
  {
    id: 'a7', patientId: 'p4', patientName: 'Geeta Rani', doctorId: 'd3', doctorName: 'Dr. Priya Reddy',
    specialization: 'Gynecologist', date: '2026-08-28', time: '11:00', type: 'teleconsultation',
    status: 'confirmed', reason: 'Pregnancy check-up',
    meetingId: 'SEV-MTG-A7G88', meetingStatus: 'patient_did_not_join',
    doctorJoinedAt: '2026-08-28T11:00:00', completedBy: 'system',
  },
];

export const mockHospitals: Hospital[] = [
  {
    id: 'h1', name: 'Rampur Primary Health Centre', type: 'phc', address: 'Main Road, Rampur, UP',
    distance: 2.5, phone: '+91 98765 43210', open24h: false,
    services: ['OPD', 'Vaccination', 'Maternal Care', 'First Aid'], lat: 28.75, lng: 79.05, rating: 4.2,
  },
  {
    id: 'h2', name: 'District Hospital Rampur', type: 'hospital', address: 'Hospital Road, Rampur, UP',
    distance: 8.0, phone: '+91 98111 22334', open24h: true,
    services: ['Emergency', 'Surgery', 'ICU', 'Maternal Care', 'Pediatrics', 'Lab'], lat: 28.76, lng: 79.04, rating: 4.5,
  },
  {
    id: 'h3', name: 'Sharma Medical Store', type: 'pharmacy', address: 'Market Chowk, Rampur, UP',
    distance: 1.5, phone: '+91 98222 33445', open24h: false,
    services: ['Medicines', 'First Aid Supplies'], lat: 28.749, lng: 79.051, rating: 4.0,
  },
  {
    id: 'h4', name: 'City Diagnostic Lab', type: 'lab', address: 'Civil Lines, Rampur, UP',
    distance: 5.0, phone: '+91 98333 44556', open24h: false,
    services: ['Blood Test', 'X-Ray', 'ECG', 'Urine Test'], lat: 28.755, lng: 79.048, rating: 4.3,
  },
  {
    id: 'h5', name: 'Rural Health Clinic', type: 'clinic', address: 'Village Panchayat, Rampur, UP',
    distance: 3.0, phone: '+91 98444 55667', open24h: false,
    services: ['OPD', 'First Aid', 'Vaccination'], lat: 28.748, lng: 79.052, rating: 3.9,
  },
  {
    id: 'h6', name: 'Heart Care Institute', type: 'hospital', address: 'MG Road, Rampur, UP',
    distance: 10.0, phone: '+91 98555 66778', open24h: true,
    services: ['Cardiology', 'Emergency', 'ICU', 'Surgery'], lat: 28.762, lng: 79.042, rating: 4.7,
  },
];

export const mockReferrals: Referral[] = [
  {
    id: 'r1', patientId: 'u1', patientName: 'Ramesh Kumar', fromFacility: 'Rampur PHC', toFacility: 'District Hospital',
    reason: 'Suspected cardiac issue - needs ECG', date: '2026-08-28', status: 'accepted',
    priority: 'urgent', doctorName: 'Dr. Anita Sharma', notes: 'Patient reports chest pain. ECG recommended.',
  },
  {
    id: 'r2', patientId: 'p2', patientName: 'Kamala Devi', fromFacility: 'Rampur PHC', toFacility: 'City Medical Center',
    reason: 'High blood sugar - needs endocrinologist', date: '2026-08-25', status: 'completed',
    priority: 'routine', doctorName: 'Dr. Anita Sharma', notes: 'Diabetes management plan needed.',
  },
  {
    id: 'r3', patientId: 'p3', patientName: 'Mohan Lal', fromFacility: 'Rampur PHC', toFacility: 'Skin Care Clinic',
    reason: 'Persistent skin condition', date: '2026-08-29', status: 'pending',
    priority: 'routine', doctorName: 'Dr. Anita Sharma', notes: 'Dermatology consultation required.',
  },
  {
    id: 'r4', patientId: 'p4', patientName: 'Geeta Rani', fromFacility: 'Rampur PHC', toFacility: 'District Hospital',
    reason: 'Pregnancy complication', date: '2026-08-30', status: 'pending',
    priority: 'emergency', doctorName: 'Dr. Anita Sharma', notes: 'Immediate obstetric evaluation required.',
  },
];

export const mockLabTests: LabTest[] = [
  {
    id: 'l1', patientId: 'u1', patientName: 'Ramesh Kumar', testName: 'Complete Blood Count (CBC)',
    labName: 'City Diagnostic Lab', date: '2026-08-26', status: 'completed',
    result: 'Hemoglobin: 13.2 g/dL (Normal). WBC: 6,800 (Normal). Platelets: 2.5 lakh (Normal).',
    reportUrl: '#', cost: 250,
  },
  {
    id: 'l2', patientId: 'u1', patientName: 'Ramesh Kumar', testName: 'Lipid Profile',
    labName: 'City Diagnostic Lab', date: '2026-09-01', status: 'pending', cost: 400,
  },
  {
    id: 'l3', patientId: 'p2', patientName: 'Kamala Devi', testName: 'HbA1c (Blood Sugar)',
    labName: 'City Diagnostic Lab', date: '2026-08-28', status: 'in_progress', cost: 350,
  },
  {
    id: 'l4', patientId: 'p3', patientName: 'Mohan Lal', testName: 'Skin Allergy Test',
    labName: 'City Diagnostic Lab', date: '2026-09-03', status: 'pending', cost: 500,
  },
];

export const mockMedicines: Medicine[] = [
  { id: 'm1', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 450, unit: 'tablets', pharmacy: 'Sharma Medical Store', price: 5, inStock: true },
  { id: 'm2', name: 'Metformin 500mg', category: 'Diabetes', stock: 120, unit: 'tablets', pharmacy: 'Sharma Medical Store', price: 12, inStock: true },
  { id: 'm3', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 0, unit: 'capsules', pharmacy: 'Sharma Medical Store', price: 18, inStock: false },
  { id: 'm4', name: 'Insulin (Human)', category: 'Diabetes', stock: 25, unit: 'vials', pharmacy: 'District Hospital Pharmacy', price: 350, inStock: true },
  { id: 'm5', name: 'Iron + Folic Acid', category: 'Supplement', stock: 300, unit: 'tablets', pharmacy: 'Rampur PHC', price: 8, inStock: true },
  { id: 'm6', name: 'ORS Sachets', category: 'First Aid', stock: 800, unit: 'sachets', pharmacy: 'Rampur PHC', price: 4, inStock: true },
  { id: 'm7', name: 'Cough Syrup', category: 'Cold & Cough', stock: 60, unit: 'bottles', pharmacy: 'Sharma Medical Store', price: 45, inStock: true },
  { id: 'm8', name: 'Aspirin 75mg', category: 'Cardiac', stock: 0, unit: 'tablets', pharmacy: 'Sharma Medical Store', price: 3, inStock: false },
  { id: 'm9', name: 'Tetanus Vaccine', category: 'Vaccination', stock: 50, unit: 'doses', pharmacy: 'Rampur PHC', price: 25, inStock: true },
  { id: 'm10', name: 'Pregnancy Test Kit', category: 'Diagnostic', stock: 100, unit: 'kits', pharmacy: 'Sharma Medical Store', price: 50, inStock: true },
];

export const mockReminders: Reminder[] = [
  { id: 'rm1', patientId: 'u1', title: 'Follow-up with Dr. Mohan Das (Cardiologist)', type: 'follow_up', date: '2026-09-02', time: '18:00', done: false, doctorName: 'Dr. Mohan Das' },
  { id: 'rm2', patientId: 'u1', title: 'Take Metformin (morning dose)', type: 'medication', date: '2026-08-30', time: '08:00', done: false },
  { id: 'rm3', patientId: 'u1', title: 'Lipid Profile test at City Diagnostic Lab', type: 'test', date: '2026-09-01', time: '09:00', done: false },
  { id: 'rm4', patientId: 'u1', title: 'Blood pressure check', type: 'follow_up', date: '2026-08-31', time: '10:00', done: true },
  { id: 'rm5', patientId: 'p2', title: 'Kamala Devi - Diabetes follow-up', type: 'follow_up', date: '2026-09-05', time: '11:00', done: false },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: 'e1', name: 'National Emergency', role: 'Ambulance / Police / Fire', phone: '112', available24h: true },
  { id: 'e2', name: 'Ambulance Service', role: 'Medical Emergency', phone: '108', available24h: true },
  { id: 'e3', name: 'Women Helpline', role: 'Women in Distress', phone: '1091', available24h: true },
  { id: 'e4', name: 'Child Helpline', role: 'Child Protection', phone: '1098', available24h: true },
  { id: 'e5', name: 'Rampur PHC', role: 'Primary Health Centre', phone: '+91 98765 43210', available24h: false },
  { id: 'e6', name: 'District Hospital', role: 'Emergency Room', phone: '+91 98111 22334', available24h: true },
  { id: 'e7', name: 'Dr. Anita Sharma', role: 'General Physician', phone: '+91 98123 45678', available24h: false },
];

export const mockUrgencyGuidance: UrgencyGuidance[] = [
  {
    symptom: 'Fever', level: 'see_doctor', advice: 'A persistent fever may need medical attention. Rest, drink fluids, and monitor your temperature.',
    recommendations: ['Drink plenty of fluids', 'Rest in a cool place', 'Take paracetamol if needed', 'See a doctor if fever lasts more than 3 days'],
  },
  {
    symptom: 'Cough / Cold', level: 'self_care', advice: 'Most coughs and colds resolve on their own within a week. Practice good hygiene.',
    recommendations: ['Drink warm fluids', 'Gargle with salt water', 'Use a cough syrup if needed', 'See a doctor if breathing difficulty occurs'],
  },
  {
    symptom: 'Chest Pain', level: 'emergency', advice: 'Chest pain can be serious. Seek emergency care immediately.',
    recommendations: ['Call emergency services (108) immediately', 'Do not drive yourself', 'Sit down and stay calm', 'Chew an aspirin if available and not allergic'],
  },
  {
    symptom: 'Headache', level: 'self_care', advice: 'Most headaches are not serious. Rest and stay hydrated.',
    recommendations: ['Rest in a quiet, dark room', 'Stay hydrated', 'Take paracetamol if needed', 'See a doctor if severe or persistent'],
  },
  {
    symptom: 'Stomach Pain', level: 'see_doctor', advice: 'Stomach pain has many causes. Monitor and see a doctor if it persists.',
    recommendations: ['Drink clean water', 'Eat light food', 'Avoid spicy food', 'See a doctor if pain is severe or with vomiting'],
  },
  {
    symptom: 'Difficulty Breathing', level: 'emergency', advice: 'Difficulty breathing is a medical emergency. Seek help immediately.',
    recommendations: ['Call emergency services (108) immediately', 'Sit upright', 'Use an inhaler if you have one', 'Do not exert yourself'],
  },
  {
    symptom: 'Skin Rash', level: 'see_doctor', advice: 'Skin rashes can have many causes. A doctor can help identify the right treatment.',
    recommendations: ['Do not scratch', 'Keep the area clean', 'Apply a cool compress', 'See a doctor if spreading or painful'],
  },
  {
    symptom: 'Vomiting', level: 'urgent', advice: 'Repeated vomiting can lead to dehydration. Visit a healthcare facility within 24 hours.',
    recommendations: ['Sip oral rehydration solution (ORS)', 'Avoid solid food temporarily', 'Stay hydrated', 'Visit a doctor if blood in vomit or persistent'],
  },
  {
    symptom: 'Diarrhea', level: 'urgent', advice: 'Diarrhea can cause dehydration. Drink ORS and visit a facility if it persists.',
    recommendations: ['Drink ORS frequently', 'Eat bland food (rice, banana)', 'Avoid dairy', 'Visit a doctor if blood in stool or lasts more than 2 days'],
  },
  {
    symptom: 'Pregnancy Bleeding', level: 'emergency', advice: 'Any bleeding during pregnancy is an emergency. Seek immediate medical care.',
    recommendations: ['Call emergency services (108) immediately', 'Lie down and stay calm', 'Do not take any medication without advice', 'Go to the nearest hospital'],
  },
  {
    symptom: 'High Blood Pressure', level: 'urgent', advice: 'High blood pressure needs monitoring. Visit a healthcare facility within 24 hours.',
    recommendations: ['Rest and stay calm', 'Reduce salt intake', 'Take prescribed medication', 'Visit a doctor for proper management'],
  },
  {
    symptom: 'Joint Pain', level: 'self_care', advice: 'Mild joint pain can be managed with rest and gentle movement.',
    recommendations: ['Rest the affected joint', 'Apply a warm or cold compress', 'Take paracetamol if needed', 'See a doctor if swelling or severe pain'],
  },
];

export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'hr1', patientId: 'u1', date: '2026-08-20', type: 'diagnosis',
    title: 'Hypertension - Stage 1', description: 'Blood pressure 145/95. Prescribed lifestyle changes and monitoring.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Dr. Anita Sharma', addedByRole: 'doctor',
  },
  {
    id: 'hr2', patientId: 'u1', date: '2026-08-20', type: 'prescription',
    title: 'Amlodipine 5mg - Once daily', description: 'For blood pressure management. Take in the morning with water.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Dr. Anita Sharma', addedByRole: 'doctor',
  },
  {
    id: 'hr3', patientId: 'u1', date: '2026-08-15', type: 'test_result',
    title: 'Blood Glucose - Fasting', description: 'Result: 142 mg/dL (Elevated). Recommended: HbA1c test for diabetes screening.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Dr. Anita Sharma', addedByRole: 'doctor',
  },
  {
    id: 'hr4', patientId: 'u1', date: '2026-07-10', type: 'vaccination',
    title: 'Tetanus Booster', description: 'Tetanus toxoid vaccine administered. Next dose in 10 years.',
    doctorName: 'Dr. Vikram Singh', doctorId: 'd2', facility: 'District Hospital',
    addedBy: 'Dr. Vikram Singh', addedByRole: 'doctor',
  },
  {
    id: 'hr5', patientId: 'u1', date: '2026-06-05', type: 'allergy',
    title: 'Allergy - Penicillin', description: 'Patient reports allergic reaction to penicillin. Avoid penicillin-based antibiotics.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Dr. Anita Sharma', addedByRole: 'doctor',
  },
  {
    id: 'hr6', patientId: 'u1', date: '2026-08-25', type: 'consultation',
    title: 'Teleconsultation - Fever and body ache', description: 'Patient presented with fever 101F and body ache for 3 days. Advised rest, fluids, and paracetamol. Follow-up if symptoms persist.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Dr. Anita Sharma', addedByRole: 'doctor',
  },
  {
    id: 'hr7', patientId: 'u1', date: '2026-08-28', type: 'referral',
    title: 'Referral to District Hospital - Cardiology', description: 'Suspected cardiac issue. ECG recommended at District Hospital under Dr. Mohan Das.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Dr. Anita Sharma', addedByRole: 'doctor',
  },
  {
    id: 'hr8', patientId: 'u1', date: '2026-08-30', type: 'follow_up',
    title: 'Follow-up scheduled with Cardiologist', description: 'Follow-up appointment booked with Dr. Mohan Das on Sep 2 for chest pain evaluation.',
    doctorName: 'Dr. Anita Sharma', doctorId: 'd1', facility: 'Rampur PHC',
    addedBy: 'Sunita Devi', addedByRole: 'healthcare_worker',
  },
];

export const mockConsultations: Consultation[] = [
  {
    id: 'c1', patientId: 'u1', patientName: 'Ramesh Kumar', doctorId: 'd1', doctorName: 'Dr. Anita Sharma',
    date: '2026-08-30', time: '14:00', duration: 20, type: 'teleconsultation', status: 'scheduled',
    notes: 'Fever and body ache consultation',
  },
  {
    id: 'c2', patientId: 'p2', patientName: 'Kamala Devi', doctorId: 'd1', doctorName: 'Dr. Anita Sharma',
    date: '2026-08-28', time: '11:00', duration: 30, type: 'in-person', status: 'completed',
    notes: 'Diabetes management - adjusted Metformin dosage',
  },
  {
    id: 'c3', patientId: 'p3', patientName: 'Mohan Lal', doctorId: 'd1', doctorName: 'Dr. Anita Sharma',
    date: '2026-08-25', time: '15:00', duration: 15, type: 'teleconsultation', status: 'completed',
    notes: 'Skin rash - prescribed antihistamine',
  },
  {
    id: 'c4', patientId: 'p4', patientName: 'Geeta Rani', doctorId: 'd3', doctorName: 'Dr. Priya Reddy',
    date: '2026-08-22', time: '10:00', duration: 40, type: 'in-person', status: 'completed',
    notes: 'Pregnancy check-up - 7 months, normal',
  },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Appointment Confirmed', message: 'Your teleconsultation with Dr. Anita Sharma is confirmed for today at 2:00 PM.', type: 'appointment', date: '2026-08-30', read: false },
  { id: 'n2', title: 'Referral Accepted', message: 'Your referral to District Hospital has been accepted. Please visit by Sep 2.', type: 'referral', date: '2026-08-29', read: false },
  { id: 'n3', title: 'Lab Test Reminder', message: 'Your Lipid Profile test is scheduled for Sep 1 at City Diagnostic Lab.', type: 'lab', date: '2026-08-28', read: true },
  { id: 'n4', title: 'Medication Reminder', message: 'Take Metformin (morning dose) at 8:00 AM.', type: 'reminder', date: '2026-08-30', read: false },
];

export const mockCommunityPatients = [
  { id: 'p2', name: 'Kamala Devi', age: 52, gender: 'Female', condition: 'Diabetes', lastVisit: '2026-08-28', status: 'stable', phone: '+91 98000 11122' },
  { id: 'p3', name: 'Mohan Lal', age: 38, gender: 'Male', condition: 'Skin Condition', lastVisit: '2026-08-25', status: 'follow-up needed', phone: '+91 98000 22233' },
  { id: 'p4', name: 'Geeta Rani', age: 26, gender: 'Female', condition: 'Pregnancy (7 months)', lastVisit: '2026-08-22', status: 'critical', phone: '+91 98000 33344' },
  { id: 'p5', name: 'Babu Ram', age: 60, gender: 'Male', condition: 'Hypertension', lastVisit: '2026-08-20', status: 'stable', phone: '+91 98000 44455' },
  { id: 'p6', name: 'Sita Devi', age: 30, gender: 'Female', condition: 'Anemia', lastVisit: '2026-08-18', status: 'improving', phone: '+91 98000 55566' },
  { id: 'p7', name: 'Arjun Singh', age: 5, gender: 'Male', condition: 'Malnutrition', lastVisit: '2026-08-15', status: 'follow-up needed', phone: '+91 98000 66677' },
];

export const mockFieldVisits = [
  { id: 'fv1', patient: 'Geeta Rani', date: '2026-08-31', purpose: 'Pregnancy follow-up', status: 'scheduled' },
  { id: 'fv2', patient: 'Arjun Singh', date: '2026-09-01', purpose: 'Nutrition assessment', status: 'scheduled' },
  { id: 'fv3', patient: 'Babu Ram', date: '2026-08-28', purpose: 'BP monitoring', status: 'completed' },
  { id: 'fv4', patient: 'Sita Devi', date: '2026-08-26', purpose: 'Iron supplement delivery', status: 'completed' },
];

export const adminStats = {
  totalPatients: 1248,
  totalAppointments: 3420,
  totalConsultations: 2156,
  totalReferrals: 487,
  avgWaitingTime: '24 min',
  totalHospitals: 18,
  totalDoctors: 42,
  totalHealthcareWorkers: 28,
  medicineStockLow: 7,
  medicineStockOk: 23,
  appointmentsToday: 34,
  consultationsToday: 18,
  referralsPending: 12,
  emergencyCases: 5,
};

export const centreStats = [
  { name: 'Rampur PHC', patients: 320, appointments: 890, waitingTime: '18 min', medicineStock: 85, status: 'active' },
  { name: 'District Hospital', patients: 580, appointments: 1450, waitingTime: '35 min', medicineStock: 72, status: 'active' },
  { name: 'City Medical Center', patients: 210, appointments: 520, waitingTime: '22 min', medicineStock: 90, status: 'active' },
  { name: 'Heart Care Institute', patients: 138, appointments: 560, waitingTime: '40 min', medicineStock: 68, status: 'active' },
  { name: 'Rural Health Clinic', patients: 180, appointments: 420, waitingTime: '15 min', medicineStock: 45, status: 'low-stock' },
  { name: 'Skin Care Clinic', patients: 95, appointments: 280, waitingTime: '12 min', medicineStock: 80, status: 'active' },
];

export const appointmentTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
];

export const mockPatientProfiles: PatientProfile[] = [
  {
    id: 'pp1',
    patientId: 'u1',
    name: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    bloodGroup: 'B+',
    dateOfBirth: '1981-03-15',
    location: 'Rampur, UP',
    address: 'Village Rampur, Block Sadar, District Rampur, Uttar Pradesh 244901',
    phone: '+91 98765 43210',
    email: 'ramesh@sevora.health',
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '+91 98765 12345',
    },
    allergies: ['Penicillin', 'Dust mites'],
    chronicConditions: ['Hypertension (Stage 1)', 'Pre-diabetes'],
    currentMedications: [
      { name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily (morning)', startDate: '2026-08-20', prescribedBy: 'Dr. Anita Sharma' },
      { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', startDate: '2026-08-15', prescribedBy: 'Dr. Anita Sharma' },
    ],
    medicalHistory: [
      { condition: 'Hypertension - Stage 1', diagnosedDate: '2026-08-20', status: 'managed', notes: 'BP 145/95. Lifestyle changes and Amlodipine prescribed.' },
      { condition: 'Pre-diabetes', diagnosedDate: '2026-08-15', status: 'ongoing', notes: 'Fasting glucose 142 mg/dL. Metformin started. HbA1c pending.' },
      { condition: 'Seasonal flu', diagnosedDate: '2025-11-10', status: 'resolved', notes: 'Recovered with symptomatic treatment.' },
    ],
    vaccinations: [
      { name: 'Tetanus Booster', date: '2026-07-10', nextDue: '2036-07-10', administeredBy: 'Dr. Vikram Singh' },
      { name: 'COVID-19 (2nd dose)', date: '2025-05-20', administeredBy: 'Rampur PHC' },
      { name: 'Hepatitis B (3rd dose)', date: '2024-01-15', administeredBy: 'District Hospital' },
    ],
    surgeries: [
      { name: 'Appendectomy', date: '2015-06-12', hospital: 'District Hospital Rampur', notes: 'Laparoscopic appendectomy. Uncomplicated recovery.' },
    ],
    insurance: {
      scheme: 'Ayushman Bharat (PM-JAY)',
      idNumber: 'PMJAY-UP-2018-456789',
      coverage: 'Up to Rs. 5,00,000 per family per year',
      validTill: '2027-03-31',
    },
    height: '168 cm',
    weight: '72 kg',
    bmi: 25.5,
    smokingStatus: 'Former smoker (quit 2020)',
    alcoholUse: 'Occasional',
    registeredAt: '2025-01-15',
    lastUpdated: '2026-08-30',
    updatedBy: 'Dr. Anita Sharma',
  },
  {
    id: 'pp2',
    patientId: 'p2',
    name: 'Kamala Devi',
    age: 52,
    gender: 'Female',
    bloodGroup: 'O+',
    dateOfBirth: '1974-07-22',
    location: 'Rampur, UP',
    address: 'Village Rampur, Block Sadar, District Rampur, Uttar Pradesh 244901',
    phone: '+91 98000 11122',
    email: 'kamala@sevora.health',
    emergencyContact: {
      name: 'Rajesh Kumar',
      relationship: 'Son',
      phone: '+91 98000 99988',
    },
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes', 'Hypothyroidism'],
    currentMedications: [
      { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-03-10', prescribedBy: 'Dr. Anita Sharma' },
      { name: 'Thyroxine 50mcg', dosage: '50mcg', frequency: 'Once daily (empty stomach)', startDate: '2024-05-15', prescribedBy: 'Dr. Anita Sharma' },
    ],
    medicalHistory: [
      { condition: 'Type 2 Diabetes', diagnosedDate: '2024-03-10', status: 'managed', notes: 'HbA1c 7.2%. Metformin started. Diet counseling given.' },
      { condition: 'Hypothyroidism', diagnosedDate: '2024-05-15', status: 'managed', notes: 'TSH elevated. Thyroxine prescribed.' },
    ],
    vaccinations: [
      { name: 'Influenza', date: '2025-10-15', nextDue: '2026-10-15', administeredBy: 'Rampur PHC' },
    ],
    surgeries: [],
    insurance: {
      scheme: 'Ayushman Bharat (PM-JAY)',
      idNumber: 'PMJAY-UP-2019-123456',
      coverage: 'Up to Rs. 5,00,000 per family per year',
      validTill: '2027-03-31',
    },
    height: '155 cm',
    weight: '62 kg',
    bmi: 25.8,
    smokingStatus: 'Never',
    alcoholUse: 'Never',
    registeredAt: '2025-02-01',
    lastUpdated: '2026-08-28',
    updatedBy: 'Dr. Anita Sharma',
  },
  {
    id: 'pp3',
    patientId: 'p3',
    name: 'Mohan Lal',
    age: 38,
    gender: 'Male',
    bloodGroup: 'A+',
    dateOfBirth: '1988-11-05',
    location: 'Rampur, UP',
    address: 'Village Rampur, Block Sadar, District Rampur, Uttar Pradesh 244901',
    phone: '+91 98000 22233',
    email: 'mohan@sevora.health',
    emergencyContact: {
      name: 'Lakshmi Devi',
      relationship: 'Wife',
      phone: '+91 98000 88877',
    },
    allergies: [],
    chronicConditions: ['Eczema'],
    currentMedications: [
      { name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'As needed', startDate: '2026-08-25', prescribedBy: 'Dr. Anita Sharma' },
      { name: 'Topical Hydrocortisone', dosage: '1%', frequency: 'Twice daily (affected area)', startDate: '2026-08-25', prescribedBy: 'Dr. Anita Sharma' },
    ],
    medicalHistory: [
      { condition: 'Eczema', diagnosedDate: '2026-08-25', status: 'ongoing', notes: 'Persistent skin rash on arms and neck. Antihistamine and topical steroid prescribed.' },
    ],
    vaccinations: [
      { name: 'Tetanus', date: '2024-03-01', nextDue: '2034-03-01', administeredBy: 'Rampur PHC' },
    ],
    surgeries: [],
    insurance: {
      scheme: 'State Health Insurance',
      idNumber: 'SHI-UP-2025-789012',
      coverage: 'Up to Rs. 2,00,000 per year',
      validTill: '2026-12-31',
    },
    height: '172 cm',
    weight: '68 kg',
    bmi: 23.0,
    smokingStatus: 'Never',
    alcoholUse: 'Never',
    registeredAt: '2025-03-10',
    lastUpdated: '2026-08-25',
    updatedBy: 'Dr. Anita Sharma',
  },
  {
    id: 'pp4',
    patientId: 'p4',
    name: 'Geeta Rani',
    age: 26,
    gender: 'Female',
    bloodGroup: 'AB+',
    dateOfBirth: '2000-04-18',
    location: 'Rampur, UP',
    address: 'Village Rampur, Block Sadar, District Rampur, Uttar Pradesh 244901',
    phone: '+91 98000 33344',
    email: 'geeta@sevora.health',
    emergencyContact: {
      name: 'Suresh Kumar',
      relationship: 'Husband',
      phone: '+91 98000 77766',
    },
    allergies: ['Latex'],
    chronicConditions: ['Pregnancy (7 months)'],
    currentMedications: [
      { name: 'Iron + Folic Acid', dosage: '1 tablet', frequency: 'Once daily', startDate: '2026-02-01', prescribedBy: 'Dr. Priya Reddy' },
      { name: 'Calcium supplement', dosage: '500mg', frequency: 'Once daily', startDate: '2026-02-01', prescribedBy: 'Dr. Priya Reddy' },
    ],
    medicalHistory: [
      { condition: 'Pregnancy - 3rd trimester', diagnosedDate: '2026-01-15', status: 'ongoing', notes: '7 months pregnant. Regular ANC visits. Mild anemia detected, iron supplement prescribed.' },
    ],
    vaccinations: [
      { name: 'Tdap (Pregnancy)', date: '2026-05-10', administeredBy: 'Dr. Priya Reddy' },
      { name: 'TT (Tetanus)', date: '2026-04-01', administeredBy: 'City Medical Center' },
    ],
    surgeries: [],
    insurance: {
      scheme: 'Ayushman Bharat (PM-JAY)',
      idNumber: 'PMJAY-UP-2020-345678',
      coverage: 'Up to Rs. 5,00,000 per family per year',
      validTill: '2027-03-31',
    },
    height: '160 cm',
    weight: '65 kg',
    bmi: 25.4,
    smokingStatus: 'Never',
    alcoholUse: 'Never',
    registeredAt: '2025-01-20',
    lastUpdated: '2026-08-22',
    updatedBy: 'Dr. Priya Reddy',
  },
];

export function getUserAppointments(user: User): Appointment[] {
  return mockAppointments.filter((a) => {
    if (user.role === 'patient') return a.patientId === user.id;
    if (user.role === 'doctor') return a.doctorId === user.id || a.doctorName === user.name;
    return false;
  });
}
