import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockPatientProfiles, mockCommunityPatients } from '@/data/mockData';
import type { PatientProfile as PatientProfileType, Role } from '@/types';
import {
  User, Droplet, MapPin, Phone, Mail, Calendar, Shield, AlertTriangle,
  Activity, Pill, Syringe, Stethoscope, FileText, Heart, Building2,
  Ruler, Weight, Cigarette, WineIcon, Users, Lock, Eye,
} from 'lucide-react';

type ViewMode = 'own' | 'patient_list' | 'detail';

export function PatientProfile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  if (!user) return null;

  const canViewFull = (role: Role) => role === 'doctor' || role === 'admin';
  const canViewLimited = (role: Role) => role === 'healthcare_worker';
  const isPatient = user.role === 'patient';

  if (isPatient) {
    const profile = mockPatientProfiles.find((p) => p.patientId === user.id);
    if (!profile) {
      return (
        <div className="space-y-4 animate-fade-in">
          <SectionHeader title={t('patientProfile')} subtitle="Your complete health information" />
          <Card className="p-4"><EmptyState icon={User} title={t('noData')} /></Card>
        </div>
      );
    }
    return <ProfileDetail profile={profile} canEdit={false} viewerRole={user.role} />;
  }

  if (canViewFull(user.role) || canViewLimited(user.role)) {
    if (selectedPatientId) {
      const profile = mockPatientProfiles.find((p) => p.patientId === selectedPatientId);
      if (profile) {
        return (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setSelectedPatientId(null)}
              className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
            >
              <User size={16} /> {t('back')} to patient list
            </button>
            <ProfileDetail profile={profile} canEdit={canViewFull(user.role)} viewerRole={user.role} />
          </div>
        );
      }
    }

    const allPatients = [
      ...mockPatientProfiles.map((p) => ({ id: p.patientId, name: p.name, age: p.age, gender: p.gender, condition: p.chronicConditions.join(', ') || 'None' })),
      ...mockCommunityPatients.map((p) => ({ id: p.id, name: p.name, age: p.age, gender: p.gender, condition: p.condition })),
    ];
    const uniquePatients = allPatients.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

    return (
      <div className="space-y-4 animate-fade-in">
        <SectionHeader
          title={t('patientProfiles')}
          subtitle={canViewFull(user.role) ? 'View and manage patient health records' : 'View community patient information'}
        />

        <Card className="p-4 bg-brand-50/50 border-brand-200">
          <div className="flex items-start gap-3">
            <Lock size={18} className="text-brand-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Role-Based Access Control</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {canViewFull(user.role)
                  ? 'As a doctor, you have full access to patient medical records and can add consultations, prescriptions, and referrals.'
                  : 'As a healthcare worker, you can view patient demographics and basic health status. Medical records are managed by authorized doctors.'}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          {uniquePatients.map((patient) => {
            const profile = mockPatientProfiles.find((p) => p.patientId === patient.id);
            return (
              <Card key={patient.id} className="p-4" hover onClick={() => setSelectedPatientId(patient.id)}>
                <div className="flex items-start gap-3">
                  <Avatar name={patient.name} color="#64748b" size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{patient.name}</h3>
                      {profile ? (
                        <Badge variant="success">Full Profile</Badge>
                      ) : (
                        <Badge variant="default">Basic Info</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span>{patient.age} yrs • {patient.gender}</span>
                      <span className="flex items-center gap-1"><Activity size={12} />{patient.condition}</span>
                    </div>
                  </div>
                  <Eye size={18} className="text-slate-400 shrink-0" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="p-4"><EmptyState icon={Lock} title="Access Denied" description="You do not have permission to view patient profiles." /></Card>
    </div>
  );
}

function ProfileDetail({ profile, canEdit, viewerRole }: { profile: PatientProfileType; canEdit: boolean; viewerRole: Role }) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'overview' | 'medical' | 'medications' | 'vaccinations' | 'surgeries' | 'insurance'>('overview');

  const isDoctor = viewerRole === 'doctor';
  const isPatient = viewerRole === 'patient';
  const isHCW = viewerRole === 'healthcare_worker';

  const sections = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'medical' as const, label: 'Medical History', icon: Activity },
    { id: 'medications' as const, label: 'Medications', icon: Pill },
    { id: 'vaccinations' as const, label: 'Vaccinations', icon: Syringe },
    { id: 'surgeries' as const, label: 'Surgeries', icon: Stethoscope },
    { id: 'insurance' as const, label: 'Insurance', icon: FileText },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 to-accent-600" />
        <div className="px-5 pb-5 -mt-12">
          <div className="flex items-end gap-4">
            <div className="rounded-full ring-4 ring-white">
              <Avatar name={profile.name} color="#2563eb" size="lg" />
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="brand">{profile.age} years</Badge>
                <Badge variant="default">{profile.gender}</Badge>
                <Badge variant="danger"><Droplet size={11} /> {profile.bloodGroup}</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Access notice */}
      {!isPatient && (
        <Card className={`p-3 ${isDoctor ? 'bg-success-50/50 border-success-200' : 'bg-warning-50/50 border-warning-200'}`}>
          <div className="flex items-start gap-2.5">
            <Shield size={16} className={isDoctor ? 'text-success-600 mt-0.5' : 'text-warning-600 mt-0.5'} />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                {isDoctor ? 'Full Medical Access' : 'Limited Access (Healthcare Worker)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isDoctor
                  ? 'You can view all medical details and add records to this patient\'s file.'
                  : 'You can view demographics and basic health info. Medical records are managed by doctors.'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                active ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Icon size={14} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeSection === 'overview' && (
        <div className="space-y-3">
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-brand-600" /> Personal Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow icon={Calendar} label="Date of Birth" value={profile.dateOfBirth} />
              <InfoRow icon={Droplet} label="Blood Group" value={profile.bloodGroup} />
              <InfoRow icon={MapPin} label="Location" value={profile.location} />
              <InfoRow icon={Phone} label="Phone" value={isPatient || isDoctor ? profile.phone : 'Restricted'} />
              <InfoRow icon={Mail} label="Email" value={profile.email} />
              <InfoRow icon={Users} label="Emergency Contact" value={`${profile.emergencyContact.name} (${profile.emergencyContact.relationship})`} />
              {!isHCW && (
                <InfoRow icon={Phone} label="Emergency Phone" value={profile.emergencyContact.phone} />
              )}
              <InfoRow icon={MapPin} label="Address" value={profile.address} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Heart size={18} className="text-danger-600" /> Vital Statistics & Lifestyle
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow icon={Ruler} label="Height" value={profile.height || 'N/A'} />
              <InfoRow icon={Weight} label="Weight" value={profile.weight || 'N/A'} />
              <InfoRow icon={Activity} label="BMI" value={profile.bmi ? profile.bmi.toString() : 'N/A'} />
              <InfoRow icon={Cigarette} label="Smoking" value={profile.smokingStatus || 'N/A'} />
              <InfoRow icon={WineIcon} label="Alcohol Use" value={profile.alcoholUse || 'N/A'} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-danger-600" /> Allergies
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.length > 0 ? (
                profile.allergies.map((allergy, i) => (
                  <Badge key={i} variant="danger"><AlertTriangle size={11} /> {allergy}</Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400">No known allergies</span>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity size={18} className="text-warning-600" /> Chronic Conditions
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.chronicConditions.length > 0 ? (
                profile.chronicConditions.map((condition, i) => (
                  <Badge key={i} variant="warning">{condition}</Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400">No chronic conditions</span>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Medical History */}
      {activeSection === 'medical' && (
        <div className="space-y-3">
          {profile.medicalHistory.length === 0 ? (
            <Card className="p-4"><EmptyState icon={Activity} title="No medical history" /></Card>
          ) : (
            profile.medicalHistory.map((entry, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center shrink-0">
                    <Activity size={18} className="text-warning-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{entry.condition}</h3>
                      <Badge variant={entry.status === 'resolved' ? 'success' : entry.status === 'managed' ? 'info' : 'warning'}>
                        {entry.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Diagnosed: {entry.diagnosedDate}</p>
                    <p className="text-sm text-slate-600 mt-2">{entry.notes}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Medications */}
      {activeSection === 'medications' && (
        <div className="space-y-3">
          {profile.currentMedications.length === 0 ? (
            <Card className="p-4"><EmptyState icon={Pill} title="No current medications" /></Card>
          ) : (
            profile.currentMedications.map((med, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                    <Pill size={18} className="text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm">{med.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span>Dosage: {med.dosage}</span>
                      <span>Frequency: {med.frequency}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>Started: {med.startDate}</span>
                      <span>Prescribed by: {med.prescribedBy}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Vaccinations */}
      {activeSection === 'vaccinations' && (
        <div className="space-y-3">
          {profile.vaccinations.length === 0 ? (
            <Card className="p-4"><EmptyState icon={Syringe} title="No vaccination records" /></Card>
          ) : (
            profile.vaccinations.map((vacc, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center shrink-0">
                    <Syringe size={18} className="text-success-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm">{vacc.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {vacc.date}</span>
                      {vacc.nextDue && <span className="text-warning-600">Next due: {vacc.nextDue}</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Administered by: {vacc.administeredBy}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Surgeries */}
      {activeSection === 'surgeries' && (
        <div className="space-y-3">
          {profile.surgeries.length === 0 ? (
            <Card className="p-4"><EmptyState icon={Stethoscope} title="No surgery records" /></Card>
          ) : (
            profile.surgeries.map((surgery, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Stethoscope size={18} className="text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm">{surgery.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {surgery.date}</span>
                      <span className="flex items-center gap-1"><Building2 size={12} /> {surgery.hospital}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{surgery.notes}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Insurance */}
      {activeSection === 'insurance' && (
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-brand-600" /> Insurance / Health Scheme
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <InfoRow icon={Shield} label="Scheme" value={profile.insurance.scheme} />
            <InfoRow icon={FileText} label="ID Number" value={profile.insurance.idNumber} />
            <InfoRow icon={Shield} label="Coverage" value={profile.insurance.coverage} />
            <InfoRow icon={Calendar} label="Valid Till" value={profile.insurance.validTill} />
          </div>
        </Card>
      )}

      {/* Metadata */}
      <Card className="p-3 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Registered: {profile.registeredAt}</span>
          <span>Last updated: {profile.lastUpdated} by {profile.updatedBy}</span>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}
