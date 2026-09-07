import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { StatCard, SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockCommunityPatients, mockFieldVisits, mockReferrals } from '@/data/mockData';
import {
  Users, ClipboardList, Send, MapPin, Phone, Calendar,
  Activity, HeartPulse, AlertCircle, CheckCircle2, Clock,
} from 'lucide-react';

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  stable: { variant: 'success', label: 'Stable' },
  'follow-up needed': { variant: 'warning', label: 'Follow-up Needed' },
  critical: { variant: 'danger', label: 'Critical' },
  improving: { variant: 'info', label: 'Improving' },
};

export function HealthcareWorkerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  if (!user) return null;

  const pendingReferrals = mockReferrals.filter((r) => r.status === 'pending');
  const scheduledVisits = mockFieldVisits.filter((v) => v.status === 'scheduled');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-success-600 to-accent-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-success-600/20">
        <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
        <p className="text-white/80 text-sm mt-1">Healthcare Worker • {user.facility}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label={t('communityPatients')} value={mockCommunityPatients.length} color="text-brand-600" bgColor="bg-brand-50" />
        <StatCard icon={MapPin} label={t('fieldVisits')} value={scheduledVisits.length} color="text-accent-600" bgColor="bg-accent-50" subtitle="scheduled" />
        <StatCard icon={Send} label={t('referralsManaged')} value={pendingReferrals.length} color="text-warning-600" bgColor="bg-warning-50" subtitle="pending" />
        <StatCard icon={AlertCircle} label="Critical Cases" value={mockCommunityPatients.filter((p) => p.status === 'critical').length} color="text-danger-600" bgColor="bg-danger-50" />
      </div>

      <div>
        <SectionHeader title={t('fieldVisits')} subtitle="Upcoming field visits in your community" />
        <div className="space-y-2">
          {scheduledVisits.length === 0 ? (
            <Card className="p-4"><EmptyState icon={MapPin} title="No scheduled visits" /></Card>
          ) : (
            scheduledVisits.map((visit) => (
              <Card key={visit.id} className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-accent-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{visit.patient}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} />{visit.date}</span>
                    <span>•</span>
                    <span>{visit.purpose}</span>
                  </div>
                </div>
                <Badge variant="warning">{t('pending')}</Badge>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <SectionHeader title={t('communityPatients')} subtitle="Patients under your care" />
        <div className="space-y-2">
          {mockCommunityPatients.map((patient) => {
            const cfg = statusConfig[patient.status] || statusConfig.stable;
            return (
              <Card key={patient.id} className="p-4" hover>
                <div className="flex items-start gap-3">
                  <Avatar name={patient.name} color="#64748b" size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{patient.name}</h3>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span>{patient.age} yrs • {patient.gender}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Activity size={12} />{patient.condition}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">Last visit: {patient.lastVisit}</span>
                      <a href={`tel:${patient.phone}`}>
                        <span className="flex items-center gap-1 text-xs text-brand-600 font-medium">
                          <Phone size={13} />{t('callNow')}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader title={t('referralsManaged')} subtitle="Pending referrals requiring follow-up" />
        <div className="space-y-2">
          {pendingReferrals.length === 0 ? (
            <Card className="p-4"><EmptyState icon={Send} title="No pending referrals" /></Card>
          ) : (
            pendingReferrals.map((ref) => (
              <Card key={ref.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center shrink-0">
                  <Send size={18} className="text-warning-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{ref.patientName}</p>
                  <p className="text-xs text-slate-500 truncate">{ref.reason}</p>
                </div>
                <Badge variant={ref.priority === 'emergency' ? 'danger' : ref.priority === 'urgent' ? 'warning' : 'default'}>
                  {ref.priority}
                </Badge>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
