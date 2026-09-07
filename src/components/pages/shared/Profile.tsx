import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Avatar, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { User } from '@/types';
import { Mail, Phone, MapPin, Calendar, User as UserIcon, Droplet,
  Stethoscope, Building2, FileText, Shield, LogOut, Home, Heart,
  AlertTriangle, Pill, GraduationCap, Briefcase, Clock, Languages,
  Video, HeartPulse, Edit3, Save, X,
} from 'lucide-react';

type IconType = typeof Mail;

const roleLabels: Record<string, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  healthcare_worker: 'Healthcare Worker',
  admin: 'Administrator',
};

export function Profile() {
  const { t } = useLanguage();
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  if (!user) return null;

  const startEdit = () => {
    setEditForm({ ...user });
    setEditing(true);
  };

  const saveEdit = () => {
    updateUser(editForm);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({});
  };

  const set = (key: keyof User, value: string | string[] | boolean | number | undefined) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-2xl mx-auto">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 to-accent-600" />
        <div className="px-5 pb-5 -mt-12">
          <div className="flex items-end gap-4">
            <div className="rounded-full ring-4 ring-white">
              <Avatar name={user.name} color={user.avatarColor} size="lg" />
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <Badge variant="brand" className="mt-1">{roleLabels[user.role]}</Badge>
            </div>
            <Button size="sm" variant="secondary" icon={<Edit3 size={15} />} onClick={startEdit}>
              {t('save') === 'Save' ? 'Edit' : t('save')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Role-Based Access Notice */}
      <Card className="p-4 bg-brand-50/50 border-brand-200">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Role-Based Access Control</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Your account has {roleLabels[user.role]} access. You can only view and manage information authorized for your role.
            </p>
          </div>
        </div>
      </Card>

      {/* Basic Info (all roles) */}
      <Card className="p-5">
        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-brand-600" />
          {t('personalInfo')}
        </h2>
        <div className="space-y-3">
          <InfoRow icon={Mail} label={t('email')} value={user.email} />
          <InfoRow icon={Phone} label={t('phone')} value={user.phone} />
          {user.dateOfBirth && <InfoRow icon={Calendar} label="Date of Birth" value={user.dateOfBirth} />}
          {user.age !== undefined && <InfoRow icon={UserIcon} label={t('age')} value={`${user.age} years`} />}
          {user.gender && <InfoRow icon={UserIcon} label={t('gender')} value={user.gender} />}
          {user.bloodGroup && <InfoRow icon={Droplet} label={t('bloodGroup')} value={user.bloodGroup} />}
          {user.location && <InfoRow icon={MapPin} label={t('location')} value={user.location} />}
          {user.address && <InfoRow icon={Home} label="Address" value={user.address} />}
          {user.village && <InfoRow icon={MapPin} label="Village" value={user.village} />}
          {user.district && <InfoRow icon={MapPin} label="District" value={user.district} />}
          {user.state && <InfoRow icon={MapPin} label="State" value={user.state} />}
          <InfoRow icon={Calendar} label={t('registeredOn')} value={user.registeredAt} />
        </div>
      </Card>

      {/* Patient-specific sections */}
      {user.role === 'patient' && (
        <>
          {/* Emergency Contact */}
          {(user.emergencyContactName || user.emergencyContactPhone) && (
            <Card className="p-5">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Heart size={18} className="text-danger-600" />
                Emergency Contact
              </h2>
              <div className="space-y-3">
                {user.emergencyContactName && <InfoRow icon={UserIcon} label="Contact Name" value={user.emergencyContactName} />}
                {user.emergencyContactRelationship && <InfoRow icon={UserIcon} label="Relationship" value={user.emergencyContactRelationship} />}
                {user.emergencyContactPhone && <InfoRow icon={Phone} label="Contact Phone" value={user.emergencyContactPhone} />}
              </div>
            </Card>
          )}

          {/* Medical Info */}
          {(user.allergies?.length || user.existingConditions?.length || user.currentMedications || user.medicalHistory) && (
            <Card className="p-5">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-warning-600" />
                Medical Information
              </h2>
              <div className="space-y-3">
                {user.allergies && user.allergies.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-danger-50 flex items-center justify-center shrink-0">
                      <AlertTriangle size={16} className="text-danger-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-500">Allergies</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {user.allergies.map((a, i) => <Badge key={i} variant="danger">{a}</Badge>)}
                      </div>
                    </div>
                  </div>
                )}
                {user.existingConditions && user.existingConditions.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-warning-50 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-warning-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-500">Existing Conditions</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {user.existingConditions.map((c, i) => <Badge key={i} variant="warning">{c}</Badge>)}
                      </div>
                    </div>
                  </div>
                )}
                {user.currentMedications && <InfoRow icon={Pill} label="Current Medications" value={user.currentMedications} />}
                {user.medicalHistory && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-500">Medical History</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{user.medicalHistory}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Doctor-specific sections */}
      {user.role === 'doctor' && (
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Stethoscope size={18} className="text-accent-600" />
            Professional Information
          </h2>
          <div className="space-y-3">
            {user.qualification && <InfoRow icon={GraduationCap} label="Qualification" value={user.qualification} />}
            {user.specialization && <InfoRow icon={Stethoscope} label={t('specialization')} value={user.specialization} />}
            {user.yearsExperience !== undefined && <InfoRow icon={Briefcase} label="Experience" value={`${user.yearsExperience} years`} />}
            {user.facility && <InfoRow icon={Building2} label={t('facility')} value={user.facility} />}
            {user.languages && user.languages.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Languages size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-500">Languages</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {user.languages.map((l, i) => <Badge key={i} variant="info">{l}</Badge>)}
                  </div>
                </div>
              </div>
            )}
            {user.availableDays && user.availableDays.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-500">Available Days</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {user.availableDays.map((d, i) => <Badge key={i} variant="success">{d}</Badge>)}
                  </div>
                </div>
              </div>
            )}
            {user.availableTimes && <InfoRow icon={Clock} label="Available Times" value={user.availableTimes} />}
            {(user.onlineConsultation !== undefined || user.offlineConsultation !== undefined) && (
              <div className="flex items-center gap-4 pt-2">
                {user.onlineConsultation && (
                  <Badge variant="success"><Video size={11} /> Online Available</Badge>
                )}
                {user.offlineConsultation && (
                  <Badge variant="info"><Building2 size={11} /> In-Person Available</Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Healthcare worker-specific sections */}
      {user.role === 'healthcare_worker' && (
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HeartPulse size={18} className="text-success-600" />
            Worker Information
          </h2>
          <div className="space-y-3">
            {user.workerType && <InfoRow icon={HeartPulse} label="Worker Type" value={user.workerType} />}
            {user.healthCenter && <InfoRow icon={Building2} label="Health Centre" value={user.healthCenter} />}
            {user.experience && <InfoRow icon={Briefcase} label="Experience" value={user.experience} />}
          </div>
        </Card>
      )}

      {/* Logout */}
      <Button variant="danger" fullWidth size="lg" icon={<LogOut size={20} />} onClick={logout}>
        {t('logout')}
      </Button>

      {/* Edit Modal */}
      <Modal open={editing} onClose={cancelEdit} title="Edit Profile" size="md">
        <div className="space-y-4">
          <EditField label={t('fullName')} value={editForm.name || ''} onChange={(v) => set('name', v)} />
          <EditField label={t('phone')} value={editForm.phone || ''} onChange={(v) => set('phone', v)} />
          {user.role === 'patient' && (
            <>
              <EditField label="Address" value={editForm.address || ''} onChange={(v) => set('address', v)} />
              <div className="grid grid-cols-3 gap-2">
                <EditField label="Village" value={editForm.village || ''} onChange={(v) => set('village', v)} />
                <EditField label="District" value={editForm.district || ''} onChange={(v) => set('district', v)} />
                <EditField label="State" value={editForm.state || ''} onChange={(v) => set('state', v)} />
              </div>
              <EditField label="Emergency Contact Name" value={editForm.emergencyContactName || ''} onChange={(v) => set('emergencyContactName', v)} />
              <EditField label="Emergency Contact Phone" value={editForm.emergencyContactPhone || ''} onChange={(v) => set('emergencyContactPhone', v)} />
              <EditField label="Allergies (comma-separated)" value={(editForm.allergies || []).join(', ')} onChange={(v) => set('allergies', v.split(',').map((s) => s.trim()).filter(Boolean))} />
              <EditField label="Current Medications" value={editForm.currentMedications || ''} onChange={(v) => set('currentMedications', v)} />
              <EditField label="Medical History" value={editForm.medicalHistory || ''} onChange={(v) => set('medicalHistory', v)} textarea />
            </>
          )}
          {user.role === 'doctor' && (
            <>
              <EditField label="Specialization" value={editForm.specialization || ''} onChange={(v) => set('specialization', v)} />
              <EditField label="Hospital/Clinic" value={editForm.facility || ''} onChange={(v) => set('facility', v)} />
              <EditField label="Location" value={editForm.location || ''} onChange={(v) => set('location', v)} />
              <EditField label="Languages (comma-separated)" value={(editForm.languages || []).join(', ')} onChange={(v) => set('languages', v.split(',').map((s) => s.trim()).filter(Boolean))} />
              <EditField label="Available Times" value={editForm.availableTimes || ''} onChange={(v) => set('availableTimes', v)} />
            </>
          )}
          {user.role === 'healthcare_worker' && (
            <>
              <EditField label="Worker Type" value={editForm.workerType || ''} onChange={(v) => set('workerType', v)} />
              <EditField label="Health Centre" value={editForm.healthCenter || ''} onChange={(v) => set('healthCenter', v)} />
              <EditField label="Experience" value={editForm.experience || ''} onChange={(v) => set('experience', v)} />
            </>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" icon={<X size={18} />} onClick={cancelEdit}>{t('cancel')}</Button>
            <Button fullWidth icon={<Save size={18} />} onClick={saveEdit}>{t('save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
      </div>
    </div>
  );
}

function EditField({
  label, value, onChange, textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900"
        />
      )}
    </div>
  );
}
