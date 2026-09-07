import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import {
  fetchHealthRecords, insertHealthRecord,
  fetchUserAppointments, fetchPatientProfile,
} from '@/lib/supabase';
import type { HealthRecord as HealthRecordType, Appointment, User } from '@/types';
import {
  FileText, Pill, FlaskConical, Syringe, AlertTriangle, Stethoscope,
  Send, Calendar, Lock, Plus, Activity, ArrowLeft, Shield, AlertCircle,
} from 'lucide-react';

const typeConfig = {
  diagnosis: { icon: Stethoscope, color: 'text-brand-600', bg: 'bg-brand-50', label: 'Diagnosis' },
  prescription: { icon: Pill, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Prescription' },
  test_result: { icon: FlaskConical, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Test Result' },
  vaccination: { icon: Syringe, color: 'text-success-600', bg: 'bg-success-50', label: 'Vaccination' },
  allergy: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-50', label: 'Allergy' },
  consultation: { icon: Activity, color: 'text-brand-600', bg: 'bg-brand-50', label: 'Consultation' },
  referral: { icon: Send, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Referral' },
  follow_up: { icon: Calendar, color: 'text-success-600', bg: 'bg-success-50', label: 'Follow-up' },
};

type RecordType = keyof typeof typeConfig;

export function HealthRecords() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecordType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | RecordType>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ type: 'consultation' as RecordType, title: '', description: '' });
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [patientProfiles, setPatientProfiles] = useState<Record<string, User>>({});

  if (!user) return null;

  const isPatient = user.role === 'patient';
  const isDoctor = user.role === 'doctor';
  const isHCW = user.role === 'healthcare_worker';
  const isAdmin = user.role === 'admin';
  const canAdd = isDoctor || isHCW;

  const loadRecords = useCallback(async (patientId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchHealthRecords(patientId);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  // Patient: load own records
  useEffect(() => {
    if (isPatient) {
      loadRecords(user.id);
    }
  }, [isPatient, user.id, loadRecords]);

  // Doctor/HCW: load patient list from appointments
  useEffect(() => {
    if (!isPatient && (isDoctor || isHCW || isAdmin)) {
      (async () => {
        setLoading(true);
        setError('');
        try {
          const role = isDoctor ? 'doctor' : 'patient';
          const appts = await fetchUserAppointments(user.id, role);
          setPatientAppointments(appts);
          const uniquePatientIds = [...new Set(appts.map((a) => a.patientId))];
          const profiles: Record<string, User> = {};
          for (const pid of uniquePatientIds) {
            const profile = await fetchPatientProfile(pid);
            if (profile) profiles[pid] = profile;
          }
          setPatientProfiles(profiles);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load patient list');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user.id, isPatient, isDoctor, isHCW, isAdmin]);

  // Load records when a patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      loadRecords(selectedPatientId);
    }
  }, [selectedPatientId, loadRecords]);

  const handleAddRecord = async () => {
    if (!selectedPatientId || !newRecord.title.trim() || !newRecord.description.trim()) return;
    try {
      const record = await insertHealthRecord({
        patient_id: selectedPatientId,
        date: new Date().toISOString().split('T')[0],
        type: newRecord.type,
        title: newRecord.title,
        description: newRecord.description,
        doctor_name: isDoctor ? user.name : undefined,
        doctor_id: isDoctor ? user.id : undefined,
        facility: user.facility,
        added_by: user.name,
        added_by_role: user.role as string,
      });
      setRecords((prev) => [record, ...prev]);
      setNewRecord({ type: 'consultation', title: '', description: '' });
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add record');
    }
  };

  // Patient view: own records only
  if (isPatient) {
    const filtered = filter === 'all' ? records : records.filter((r) => r.type === filter);

    return (
      <div className="space-y-4 animate-fade-in">
        <SectionHeader title={t('healthRecords')} subtitle="Your complete medical history" />

        <Card className="p-3 bg-brand-50/50 border-brand-200">
          <div className="flex items-start gap-2.5">
            <Lock size={16} className="text-brand-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600">
              Your health records are confidential. Only authorized doctors and healthcare workers assigned to your care can view or add records.
            </p>
          </div>
        </Card>

        {error && (
          <Card className="p-3 bg-danger-50 border-danger-200">
            <div className="flex items-center gap-2 text-sm text-danger-700"><AlertCircle size={16} /> {error}</div>
          </Card>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <RecordFilters filter={filter} setFilter={setFilter} />
            {filtered.length === 0 ? (
              <Card className="p-4"><EmptyState icon={FileText} title={t('noData')} /></Card>
            ) : (
              <div className="space-y-3">
                {filtered.map((rec) => <RecordCard key={rec.id} record={rec} />)}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Doctor / HCW / Admin view
  if (canAdd || isAdmin) {
    if (selectedPatientId) {
      const filtered = filter === 'all' ? records : records.filter((r) => r.type === filter);
      const patientName = patientProfiles[selectedPatientId]?.name || 'Patient';

      return (
        <div className="space-y-4 animate-fade-in">
          <button
            onClick={() => { setSelectedPatientId(null); setRecords([]); }}
            className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
          >
            <ArrowLeft size={16} /> {t('back')} to patient list
          </button>

          <SectionHeader
            title={`${patientName}'s Records`}
            subtitle="Secure digital health record"
            action={canAdd ? <Button size="sm" icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>Add Record</Button> : undefined}
          />

          <Card className="p-3 bg-success-50/50 border-success-200">
            <div className="flex items-start gap-2.5">
              <Shield size={16} className="text-success-600 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600">
                {isDoctor
                  ? 'As an authorized doctor, you can view and add consultations, prescriptions, lab reports, referrals, and follow-up notes.'
                  : 'As a healthcare worker, you can add follow-up notes and view records. Medical entries are primarily managed by doctors.'}
              </p>
            </div>
          </Card>

          {error && (
            <Card className="p-3 bg-danger-50 border-danger-200">
              <div className="flex items-center gap-2 text-sm text-danger-700"><AlertCircle size={16} /> {error}</div>
            </Card>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <RecordFilters filter={filter} setFilter={setFilter} />
              {filtered.length === 0 ? (
                <Card className="p-4"><EmptyState icon={FileText} title={t('noData')} /></Card>
              ) : (
                <div className="space-y-3">
                  {filtered.map((rec) => <RecordCard key={rec.id} record={rec} />)}
                </div>
              )}
            </>
          )}

          {/* Add Record Modal */}
          <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Health Record" size="md">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Record Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(typeConfig) as RecordType[]).map((type) => {
                    const cfg = typeConfig[type];
                    const Icon = cfg.icon;
                    const selected = newRecord.type === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setNewRecord({ ...newRecord, type })}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                          selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
                        }`}
                      >
                        <Icon size={18} className={selected ? 'text-brand-600' : 'text-slate-400'} />
                        <span className="text-[10px] font-medium text-slate-700">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Title</label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  placeholder="e.g., Hypertension diagnosis"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Description / Notes</label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  rows={4}
                  placeholder="Enter clinical notes, prescription details, or test findings..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</Button>
                <Button
                  fullWidth
                  icon={<Plus size={18} />}
                  disabled={!newRecord.title.trim() || !newRecord.description.trim()}
                  onClick={handleAddRecord}
                >
                  Add Record
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      );
    }

    // Patient list for doctors/HCW
    const uniquePatients = Object.values(patientProfiles);

    return (
      <div className="space-y-4 animate-fade-in">
        <SectionHeader title={t('healthRecords')} subtitle="Select a patient to view their secure health records" />

        <Card className="p-3 bg-brand-50/50 border-brand-200">
          <div className="flex items-start gap-2.5">
            <Lock size={16} className="text-brand-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600">
              Patient health records are protected by role-based access control. Only authorized healthcare providers can view and manage these records.
            </p>
          </div>
        </Card>

        {error && (
          <Card className="p-3 bg-danger-50 border-danger-200">
            <div className="flex items-center gap-2 text-sm text-danger-700"><AlertCircle size={16} /> {error}</div>
          </Card>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : uniquePatients.length === 0 ? (
          <Card className="p-4"><EmptyState icon={FileText} title="No patients yet" description="Patients will appear here once they book appointments with you." /></Card>
        ) : (
          <div className="space-y-2">
            {uniquePatients.map((patient) => {
              const patientRecords = records.filter((r) => r.patientId === patient.id);
              return (
                <Card key={patient.id} className="p-4" hover onClick={() => setSelectedPatientId(patient.id)}>
                  <div className="flex items-start gap-3">
                    <Avatar name={patient.name} color={patient.avatarColor} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm">{patient.name}</h3>
                      <p className="text-xs text-slate-500">
                        {patient.age != null ? `${patient.age} yrs` : ''}{patient.gender ? ` • ${patient.gender}` : ''}{patient.bloodGroup ? ` • ${patient.bloodGroup}` : ''}
                      </p>
                      {patient.location && <p className="text-xs text-slate-400 mt-0.5">{patient.location}</p>}
                    </div>
                    <FileText size={18} className="text-slate-400 shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="p-4"><EmptyState icon={Lock} title="Access Denied" /></Card>
    </div>
  );
}

function RecordFilters({ filter, setFilter }: { filter: 'all' | RecordType; setFilter: (f: 'all' | RecordType) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => setFilter('all')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
          filter === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
        }`}
      >
        All
      </button>
      {(Object.keys(typeConfig) as RecordType[]).map((key) => {
        const cfg = typeConfig[key];
        const Icon = cfg.icon;
        return (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Icon size={13} />
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

function RecordCard({ record }: { record: HealthRecordType }) {
  const cfg = typeConfig[record.type] ?? typeConfig.consultation;
  const Icon = cfg.icon;
  return (
    <Card className="p-4" hover>
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
          <Icon size={20} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm">{record.title}</h3>
            <Badge variant="default" className="text-[10px]">{cfg.label}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {record.date}
            {record.doctorName && ` • ${record.doctorName}`}
            {record.facility && ` • ${record.facility}`}
          </p>
          <p className="text-sm text-slate-600 mt-2">{record.description}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={12} className="text-slate-400" />
            <span className="text-[10px] text-slate-400">Added by {record.addedBy} ({record.addedByRole})</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
