import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { fetchUserAppointments, updateAppointmentStatus } from '@/lib/supabase';
import type { Appointment } from '@/types';
import {
  Calendar, Video, Stethoscope, Clock, MapPin, X, Hash, Lock, AlertCircle,
} from 'lucide-react';

export function Appointments() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const isPatient = user.role === 'patient';
  const isDoctor = user.role === 'doctor';

  const filtered = appointments.filter((a) => {
    if (filter === 'upcoming') return a.status === 'pending' || a.status === 'confirmed';
    if (filter === 'completed') return a.status === 'completed';
    return true;
  });

  const cancelAppt = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'cancelled');
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
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
      <div className="space-y-4 animate-fade-in">
        <SectionHeader title={t('appointments')} subtitle="Loading..." />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
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

  if (error) {
    return (
      <div className="space-y-4 animate-fade-in">
        <SectionHeader title={t('appointments')} subtitle="Error" />
        <Card className="p-4">
          <EmptyState icon={AlertCircle} title="Failed to load appointments" description={error} />
          <Button size="sm" className="mt-3" onClick={loadAppointments}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader
        title={t('appointments')}
        subtitle={isPatient ? 'Your booked appointments' : isDoctor ? 'Appointments booked with you' : 'Appointments'}
      />

      <div className="flex gap-2">
        {(['upcoming', 'completed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f === 'upcoming' ? t('upcomingAppointments') : f === 'completed' ? t('completed') : t('all')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-4"><EmptyState icon={Calendar} title={t('noData')} /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <Card key={apt.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  apt.type === 'teleconsultation' ? 'bg-accent-50' : 'bg-brand-50'
                }`}>
                  {apt.type === 'teleconsultation'
                    ? <Video size={22} className="text-accent-600" />
                    : <Stethoscope size={22} className="text-brand-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {isPatient ? apt.doctorName : apt.patientName}
                    </h3>
                    {statusBadge(apt.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{apt.specialization}</p>

                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={13} />{apt.date}</span>
                    <span className="flex items-center gap-1"><Clock size={13} />{apt.time}</span>
                    <span className={`flex items-center gap-1 font-medium ${
                      apt.type === 'teleconsultation' ? 'text-accent-600' : 'text-brand-600'
                    }`}>
                      {apt.type === 'teleconsultation'
                        ? <><Video size={13} /> Online</>
                        : <><Stethoscope size={13} /> Offline</>}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-3 py-2 rounded-lg">{apt.reason}</p>

                  {/* Online: Meeting ID */}
                  {apt.type === 'teleconsultation' && apt.meetingId && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                        <Hash size={12} className="text-slate-400" />
                        <span className="text-xs font-mono font-semibold text-slate-700">{apt.meetingId}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Lock size={10} /> Shared meeting ID
                      </span>
                    </div>
                  )}

                  {/* Offline: Location */}
                  {apt.type === 'in-person' && apt.location && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                      <MapPin size={13} className="text-brand-500" />
                      <span>{apt.location}</span>
                    </div>
                  )}

                  {/* Actions */}
                  {apt.status === 'confirmed' && apt.type === 'teleconsultation' && (
                    <div className="flex gap-2 mt-3">
                      <a href="#/teleconsultation" className="flex-1">
                        <Button size="sm" fullWidth icon={<Video size={16} />}>
                          {isDoctor ? 'Start Consultation' : 'Join Call'}
                        </Button>
                      </a>
                    </div>
                  )}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && isPatient && (
                    <button
                      onClick={() => cancelAppt(apt.id)}
                      className="flex items-center gap-1 text-xs text-danger-600 font-medium mt-3 hover:underline"
                    >
                      <X size={14} />{t('cancel')}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
