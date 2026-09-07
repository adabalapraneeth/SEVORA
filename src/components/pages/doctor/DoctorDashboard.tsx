import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatCard, SectionHeader, EmptyState } from '@/components/ui/StatCard';
import {
  fetchUserAppointments, updateAppointmentStatus,
  fetchPatientProfile, fetchHealthRecords, fetchConsultations, fetchReferrals, fetchLabTests,
} from '@/lib/supabase';
import type { Appointment, MeetingStatus, User, HealthRecord, Consultation, Referral, LabTest } from '@/types';
import {
  Calendar, Users, Video, Clock, Stethoscope, CheckCircle2,
  XCircle, Send, Activity, Hash, Lock, FileText, Pill, FlaskConical,
  ArrowLeft, AlertCircle, Eye, Phone, MapPin, Droplet, Heart,
} from 'lucide-react';

function meetingStatusLabel(status: MeetingStatus): string {
  const labels: Record<MeetingStatus, string> = {
    scheduled: 'Scheduled', meeting_soon: 'Starting Soon',
    waiting_for_patient: 'Waiting for Patient', waiting_for_doctor: 'Waiting for Doctor',
    in_progress: 'In Progress', completed: 'Completed',
    patient_did_not_join: 'Patient Did Not Join', doctor_did_not_join: 'Doctor Did Not Join',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

function meetingStatusVariant(status: MeetingStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<MeetingStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    scheduled: 'info', meeting_soon: 'warning',
    waiting_for_patient: 'warning', waiting_for_doctor: 'warning',
    in_progress: 'success', completed: 'default',
    patient_did_not_join: 'danger', doctor_did_not_join: 'danger', cancelled: 'danger',
  };
  return map[status];
}

const recordTypeConfig: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
  diagnosis: { icon: Stethoscope, color: 'text-brand-600', bg: 'bg-brand-50', label: 'Diagnosis' },
  prescription: { icon: Pill, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Prescription' },
  test_result: { icon: FlaskConical, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Test Result' },
  vaccination: { icon: Activity, color: 'text-success-600', bg: 'bg-success-50', label: 'Vaccination' },
  allergy: { icon: AlertCircle, color: 'text-danger-600', bg: 'bg-danger-50', label: 'Allergy' },
  consultation: { icon: Activity, color: 'text-brand-600', bg: 'bg-brand-50', label: 'Consultation' },
  referral: { icon: Send, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Referral' },
  follow_up: { icon: Calendar, color: 'text-success-600', bg: 'bg-success-50', label: 'Follow-up' },
};

export function DoctorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [viewPatientId, setViewPatientId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<{
    profile: User | null;
    records: HealthRecord[];
    consultations: Consultation[];
    referrals: Referral[];
    labTests: LabTest[];
  } | null>(null);
  const [patientLoading, setPatientLoading] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserAppointments(user.id, user.role);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const todays = appointments.filter((a) => a.date === today);
  const upcoming = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed');
  const completed = appointments.filter((a) => a.status === 'completed');
  const uniquePatients = new Set(appointments.map((a) => a.patientId));

  const display = filter === 'today' ? todays : filter === 'upcoming' ? upcoming : completed;

  const updateStatus = async (id: string, status: Appointment['status']) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    }
  };

  const viewPatient = async (patientId: string) => {
    setViewPatientId(patientId);
    setPatientLoading(true);
    setPatientData(null);
    try {
      const [profile, records, consultations, referrals, labTests] = await Promise.all([
        fetchPatientProfile(patientId),
        fetchHealthRecords(patientId),
        fetchConsultations(patientId).catch(() => [] as Consultation[]),
        fetchReferrals(patientId, user.id).catch(() => [] as Referral[]),
        fetchLabTests(patientId),
      ]);
      setPatientData({ profile, records, consultations, referrals, labTests });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient data');
    } finally {
      setPatientLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'default' | 'danger'> = {
      confirmed: 'success', pending: 'warning', completed: 'default', cancelled: 'danger',
    };
    return <Badge variant={map[status] || 'default'}>{t(status as never) || status}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-accent-600 to-brand-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-accent-600/20">
          <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
          <p className="text-white/80 text-sm mt-1">{user.specialization} • {user.facility}</p>
        </div>
        <div className="space-y-3">
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
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-accent-600 to-brand-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-accent-600/20">
        <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
        <p className="text-white/80 text-sm mt-1">{user.specialization} • {user.facility}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Calendar} label={t('todayAppointments')} value={todays.length} color="text-brand-600" bgColor="bg-brand-50" />
        <StatCard icon={Users} label={t('myPatients')} value={uniquePatients.size} color="text-accent-600" bgColor="bg-accent-50" />
        <StatCard icon={Video} label={t('totalConsultations')} value={completed.length} color="text-success-600" bgColor="bg-success-50" />
        <StatCard icon={Send} label={t('referrals')} value={0} color="text-warning-600" bgColor="bg-warning-50" />
      </div>

      {error && (
        <Card className="p-3 bg-danger-50 border-danger-200">
          <div className="flex items-center gap-2 text-sm text-danger-700">
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError('')} className="ml-auto text-danger-600 hover:underline text-xs">Dismiss</button>
          </div>
        </Card>
      )}

      <div>
        <SectionHeader title={t('patientManagement')} subtitle="Manage your appointments and patients" />
        <div className="flex gap-2 mb-3">
          {(['today', 'upcoming', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f === 'today' ? t('todayAppointments') : f === 'upcoming' ? t('upcomingAppointments') : t('completed')}
            </button>
          ))}
        </div>

        {display.length === 0 ? (
          <Card className="p-4"><EmptyState icon={Calendar} title={t('noData')} /></Card>
        ) : (
          <div className="space-y-3">
            {display.map((apt) => (
              <Card key={apt.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={apt.patientName} color="#64748b" size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{apt.patientName}</h3>
                      {statusBadge(apt.status)}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={13} />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} />{apt.time}</span>
                      {apt.type === 'teleconsultation' && <span className="flex items-center gap-1"><Video size={13} />{t('teleconsultation')}</span>}
                    </div>

                    {apt.type === 'teleconsultation' && apt.meetingId && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                          <Hash size={12} className="text-slate-400" />
                          <span className="text-xs font-mono font-semibold text-slate-700">{apt.meetingId}</span>
                        </div>
                        {apt.meetingStatus && (
                          <Badge variant={meetingStatusVariant(apt.meetingStatus)}>
                            {meetingStatusLabel(apt.meetingStatus)}
                          </Badge>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-3 py-2 rounded-lg">{apt.reason}</p>

                    {apt.meetingStatus === 'completed' && apt.meetingStartedAt && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-50 space-y-0.5 text-[11px] text-slate-500">
                        {apt.patientJoinedAt && <div>Patient joined: {new Date(apt.patientJoinedAt).toLocaleString()}</div>}
                        {apt.doctorJoinedAt && <div>Doctor joined: {new Date(apt.doctorJoinedAt).toLocaleString()}</div>}
                        {apt.meetingEndedAt && <div>Meeting ended: {new Date(apt.meetingEndedAt).toLocaleString()}</div>}
                      </div>
                    )}

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {(apt.status === 'pending' || apt.status === 'confirmed' || apt.status === 'completed') && (
                        <Button size="sm" variant="secondary" icon={<Eye size={16} />} onClick={() => viewPatient(apt.patientId)}>
                          View Patient
                        </Button>
                      )}
                      {apt.status === 'pending' && (
                        <>
                          <Button size="sm" variant="success" icon={<CheckCircle2 size={16} />} onClick={() => updateStatus(apt.id, 'confirmed')}>
                            {t('confirm')}
                          </Button>
                          <Button size="sm" variant="danger" icon={<XCircle size={16} />} onClick={() => updateStatus(apt.id, 'cancelled')}>
                            {t('cancel')}
                          </Button>
                        </>
                      )}
                      {apt.status === 'confirmed' && apt.type === 'teleconsultation' && (
                        <a href="#/teleconsultation">
                          <Button size="sm" icon={<Video size={16} />}>Start Consultation</Button>
                        </a>
                      )}
                      {apt.status === 'confirmed' && (
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(apt.id, 'completed')}>
                          Mark {t('completed')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Patient Modal */}
      <Modal open={!!viewPatientId} onClose={() => setViewPatientId(null)} title="Patient Details" size="lg">
        {patientLoading && (
          <div className="space-y-3 py-4">
            <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        )}

        {!patientLoading && patientData && (
          <div className="space-y-4">
            {/* Patient Profile */}
            {patientData.profile ? (
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name={patientData.profile.name} color={patientData.profile.avatarColor} size="lg" />
                  <div>
                    <h3 className="font-bold text-slate-900">{patientData.profile.name}</h3>
                    <p className="text-xs text-slate-500">{patientData.profile.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {patientData.profile.phone && (
                    <div className="flex items-center gap-1.5 text-slate-600"><Phone size={13} /> {patientData.profile.phone}</div>
                  )}
                  {patientData.profile.gender && (
                    <div className="flex items-center gap-1.5 text-slate-600"><Stethoscope size={13} /> {patientData.profile.gender}</div>
                  )}
                  {patientData.profile.age != null && (
                    <div className="flex items-center gap-1.5 text-slate-600"><Calendar size={13} /> {patientData.profile.age} years</div>
                  )}
                  {patientData.profile.bloodGroup && (
                    <div className="flex items-center gap-1.5 text-slate-600"><Droplet size={13} /> {patientData.profile.bloodGroup}</div>
                  )}
                  {patientData.profile.location && (
                    <div className="flex items-center gap-1.5 text-slate-600 col-span-2"><MapPin size={13} /> {patientData.profile.location}</div>
                  )}
                </div>
                {patientData.profile.allergies.length > 0 && (
                  <div className="flex items-start gap-1.5 text-xs">
                    <AlertCircle size={14} className="text-danger-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Allergies: </span>
                      <span className="text-slate-600">{patientData.profile.allergies.join(', ')}</span>
                    </div>
                  </div>
                )}
                {patientData.profile.existingConditions.length > 0 && (
                  <div className="flex items-start gap-1.5 text-xs">
                    <Heart size={14} className="text-danger-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Conditions: </span>
                      <span className="text-slate-600">{patientData.profile.existingConditions.join(', ')}</span>
                    </div>
                  </div>
                )}
                {patientData.profile.currentMedications && (
                  <div className="flex items-start gap-1.5 text-xs">
                    <Pill size={14} className="text-accent-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Medications: </span>
                      <span className="text-slate-600">{patientData.profile.currentMedications}</span>
                    </div>
                  </div>
                )}
                {patientData.profile.emergencyContactName && (
                  <div className="flex items-start gap-1.5 text-xs">
                    <Phone size={14} className="text-warning-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700">Emergency Contact: </span>
                      <span className="text-slate-600">{patientData.profile.emergencyContactName} ({patientData.profile.emergencyContactPhone})</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-3 bg-slate-50"><p className="text-sm text-slate-500">Patient profile not available.</p></Card>
            )}

            {/* Health Records */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <FileText size={16} /> Health Records ({patientData.records.length})
              </h4>
              {patientData.records.length === 0 ? (
                <p className="text-xs text-slate-400">No records found.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {patientData.records.map((rec) => {
                    const cfg = recordTypeConfig[rec.type] ?? recordTypeConfig.consultation;
                    const Icon = cfg.icon;
                    return (
                      <div key={rec.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <Icon size={16} className={cfg.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900 text-sm">{rec.title}</p>
                            <Badge variant="default" className="text-[10px]">{cfg.label}</Badge>
                          </div>
                          <p className="text-xs text-slate-400">{rec.date}{rec.doctorName ? ` • ${rec.doctorName}` : ''}</p>
                          <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lab Tests */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <FlaskConical size={16} /> Lab Tests ({patientData.labTests.length})
              </h4>
              {patientData.labTests.length === 0 ? (
                <p className="text-xs text-slate-400">No lab tests found.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {patientData.labTests.map((lt) => (
                    <div key={lt.id} className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900 text-sm">{lt.testName}</p>
                        <Badge variant={lt.status === 'completed' ? 'success' : 'warning'} className="text-[10px]">{lt.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-400">{lt.date} • {lt.labName}</p>
                      {lt.result && <p className="text-xs text-slate-600 mt-1">Result: {lt.result}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Referrals */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Send size={16} /> Referrals ({patientData.referrals.length})
              </h4>
              {patientData.referrals.length === 0 ? (
                <p className="text-xs text-slate-400">No referrals found.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {patientData.referrals.map((ref) => (
                    <div key={ref.id} className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900 text-sm">{ref.fromFacility} → {ref.toFacility}</p>
                        <Badge variant={ref.status === 'completed' ? 'success' : 'warning'} className="text-[10px]">{ref.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-400">{ref.date} • {ref.priority}</p>
                      <p className="text-xs text-slate-600 mt-1">{ref.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Previous Consultations */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Activity size={16} /> Previous Consultations ({patientData.consultations.length})
              </h4>
              {patientData.consultations.length === 0 ? (
                <p className="text-xs text-slate-400">No previous consultations found.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {patientData.consultations.map((c) => (
                    <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900 text-sm">{c.date} at {c.time}</p>
                        <Badge variant={c.status === 'completed' ? 'default' : 'info'} className="text-[10px]">{c.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-400">{c.duration} min • {c.type}</p>
                      {c.notes && <p className="text-xs text-slate-600 mt-1">{c.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
