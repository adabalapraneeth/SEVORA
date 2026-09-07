import type { Role } from '@/types';
import type { TranslationKey } from '@/i18n/translations';
import {
  LayoutDashboard, FileText, Stethoscope, Calendar, Video, Activity,
  MapPin, Send, FlaskConical, Pill, BellRing, Siren, Users, ClipboardList, UserCircle,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: TranslationKey;
  icon: typeof LayoutDashboard;
}

export const navItems: Record<Role, NavItem[]> = {
  patient: [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'profile_view', label: 'patientProfile', icon: UserCircle },
    { id: 'records', label: 'healthRecords', icon: FileText },
    { id: 'doctors', label: 'findDoctors', icon: Stethoscope },
    { id: 'appointments', label: 'appointments', icon: Calendar },
    { id: 'teleconsultation', label: 'teleconsultation', icon: Video },
    { id: 'symptom', label: 'symptomCheck', icon: Activity },
    { id: 'hospitals', label: 'findHospitals', icon: MapPin },
    { id: 'referrals', label: 'referrals', icon: Send },
    { id: 'labs', label: 'labTests', icon: FlaskConical },
    { id: 'medicines', label: 'medicines', icon: Pill },
    { id: 'reminders', label: 'reminders', icon: BellRing },
    { id: 'emergency', label: 'emergency', icon: Siren },
  ],
  doctor: [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'appointments', icon: Calendar },
    { id: 'teleconsultation', label: 'teleconsultation', icon: Video },
    { id: 'records', label: 'healthRecords', icon: FileText },
    { id: 'referrals', label: 'referrals', icon: Send },
    { id: 'labs', label: 'labTests', icon: FlaskConical },
    { id: 'emergency', label: 'emergency', icon: Siren },
  ],
  healthcare_worker: [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'communityPatients', icon: Users },
    { id: 'profile_view', label: 'patientProfile', icon: UserCircle },
    { id: 'records', label: 'healthRecords', icon: FileText },
    { id: 'referrals', label: 'referrals', icon: Send },
    { id: 'reminders', label: 'reminders', icon: BellRing },
    { id: 'medicines', label: 'medicines', icon: Pill },
    { id: 'emergency', label: 'emergency', icon: Siren },
  ],
  admin: [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'appointments', icon: Calendar },
    { id: 'records', label: 'healthRecords', icon: FileText },
    { id: 'referrals', label: 'referrals', icon: ClipboardList },
    { id: 'medicines', label: 'medicines', icon: Pill },
    { id: 'emergency', label: 'emergency', icon: Siren },
  ],
};
