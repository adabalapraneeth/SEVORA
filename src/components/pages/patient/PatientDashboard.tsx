import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { StatCard, SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { fetchUserAppointments, fetchHealthRecords } from '@/lib/supabase';
import type { Appointment, HealthRecord } from '@/types';
import {
  Calendar, Send, FlaskConical, BellRing, FileText, Stethoscope, Video,
  Activity, MapPin, Pill, Siren, AlertCircle,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function PatientDashboard({ onNavigate }: DashboardProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [appts, recs] = await Promise.all([
        fetchUserAppointments(user.id, user.role),
        fetchHealthRecords(user.id),
      ]);
      setAppointments(appts);
      setRecords(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!user) return null;

  const myAppointments = appointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed');
  const myRecords = records.slice(0, 3);

  const quickActions: { id: string; label: string; icon: typeof Calendar; color: string; bg: string }[] = [
    { id: 'doctors', label: t('findDoctors'), icon: Stethoscope, color: 'text-brand-600', bg: 'bg-brand-50' },
    { id: 'teleconsultation', label: t('teleconsultation'), icon: Video, color: 'text-accent-600', bg: 'bg-accent-50' },
    { id: 'symptom', label: t('symptomCheck'), icon: Activity, color: 'text-success-600', bg: 'bg-success-50' },
    { id: 'hospitals', label: t('findHospitals'), icon: MapPin, color: 'text-warning-600', bg: 'bg-warning-50' },
    { id: 'medicines', label: t('medicines'), icon: Pill, color: 'text-danger-600', bg: 'bg-danger-50' },
    { id: 'emergency', label: t('emergency'), icon: Siren, color: 'text-danger-600', bg: 'bg-danger-50' },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'info' | 'default' | 'danger'> = {
      confirmed: 'success', pending: 'warning', completed: 'default', cancelled: 'danger',
      accepted: 'success', rejected: 'danger', in_progress: 'info',
    };
    return <Badge variant={map[status] || 'default'}>{t(status as never) || status}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-brand-600/20">
        <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
        <p className="text-white/80 text-sm mt-1">Manage your health and connect with care providers</p>
      </div>

      {error && (
        <Card className="p-3 bg-danger-50 border-danger-200">
          <div className="flex items-center gap-2 text-sm text-danger-700">
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError('')} className="ml-auto text-danger-600 hover:underline text-xs">Dismiss</button>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <SectionHeader title={t('quickActions')} />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={action.color} />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Calendar} label={t('upcomingAppointments')} value={myAppointments.length} color="text-brand-600" bgColor="bg-brand-50" />
        <StatCard icon={Send} label={t('activeReferrals')} value={0} color="text-accent-600" bgColor="bg-accent-50" />
        <StatCard icon={FlaskConical} label={t('pendingLabTests')} value={0} color="text-warning-600" bgColor="bg-warning-50" />
        <StatCard icon={BellRing} label={t('activeReminders')} value={0} color="text-success-600" bgColor="bg-success-50" />
      </div>

      {/* Upcoming Appointments */}
      <div>
        <SectionHeader
          title={t('upcomingAppointments')}
          action={<button onClick={() => onNavigate('appointments')} className="text-sm text-brand-600 font-medium hover:underline">{t('viewAll')}</button>}
        />
        <div className="space-y-2">
          {loading ? (
            <Card className="p-4 animate-pulse"><div className="h-16 bg-slate-100 rounded-xl" /></Card>
          ) : myAppointments.length === 0 ? (
            <Card className="p-4"><EmptyState icon={Calendar} title={t('noData')} /></Card>
          ) : (
            myAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 flex items-center gap-3" hover onClick={() => onNavigate('appointments')}>
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  {apt.type === 'teleconsultation' ? <Video size={20} className="text-brand-600" /> : <Stethoscope size={20} className="text-brand-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{apt.doctorName}</p>
                  <p className="text-xs text-slate-500">{apt.specialization} • {apt.date} at {apt.time}</p>
                </div>
                {statusBadge(apt.status)}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Recent Records */}
      <div>
        <SectionHeader
          title={t('recentRecords')}
          action={<button onClick={() => onNavigate('records')} className="text-sm text-brand-600 font-medium hover:underline">{t('viewAll')}</button>}
        />
        <div className="space-y-2">
          {loading ? (
            <Card className="p-4 animate-pulse"><div className="h-16 bg-slate-100 rounded-xl" /></Card>
          ) : myRecords.length === 0 ? (
            <Card className="p-4"><EmptyState icon={FileText} title={t('noData')} /></Card>
          ) : (
            myRecords.map((rec) => (
              <Card key={rec.id} className="p-3 flex items-center gap-3" hover onClick={() => onNavigate('records')}>
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{rec.title}</p>
                  <p className="text-xs text-slate-500">{rec.date} • {rec.doctorName}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
