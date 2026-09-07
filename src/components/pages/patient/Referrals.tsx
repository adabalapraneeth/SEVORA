import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockReferrals } from '@/data/mockData';
import { Send, ArrowRight, Clock, Building2, FileText, CheckCircle2 } from 'lucide-react';

const priorityConfig = {
  routine: { variant: 'default' as const, label: 'Routine' },
  urgent: { variant: 'warning' as const, label: 'Urgent' },
  emergency: { variant: 'danger' as const, label: 'Emergency' },
};

const statusConfig = {
  pending: { variant: 'warning' as const, label: 'Pending' },
  accepted: { variant: 'success' as const, label: 'Accepted' },
  completed: { variant: 'default' as const, label: 'Completed' },
  rejected: { variant: 'danger' as const, label: 'Rejected' },
};

export function Referrals() {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const referrals = user.role === 'patient'
    ? mockReferrals.filter((r) => r.patientId === user.id)
    : mockReferrals;

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader title={t('referrals')} subtitle={t('referralTracking')} />

      {referrals.length === 0 ? (
        <Card className="p-4"><EmptyState icon={Send} title={t('noData')} /></Card>
      ) : (
        <div className="space-y-3">
          {referrals.map((ref) => {
            const pCfg = priorityConfig[ref.priority];
            const sCfg = statusConfig[ref.status];
            return (
              <Card key={ref.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                      <Send size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{ref.patientName}</p>
                      <p className="text-xs text-slate-500">{ref.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant={pCfg.variant}>{pCfg.label}</Badge>
                    <Badge variant={sCfg.variant}>{sCfg.label}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <Building2 size={13} />{ref.fromFacility}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 shrink-0" />
                  <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700">
                    <Building2 size={13} />{ref.toFacility}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-slate-700 font-medium">{ref.reason}</p>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <FileText size={13} className="mt-0.5 shrink-0" />
                    <span>{ref.notes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={13} />
                    <span>Referred by {ref.doctorName}</span>
                  </div>
                </div>
                {/* Progress tracker */}
                <div className="flex items-center gap-1 mt-4">
                  {['pending', 'accepted', 'completed'].map((step, i) => {
                    const stepOrder = ['pending', 'accepted', 'completed'];
                    const currentIdx = stepOrder.indexOf(ref.status);
                    const isActive = i <= currentIdx;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive ? 'bg-success-500 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isActive ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        {i < 2 && <div className={`flex-1 h-0.5 mx-1 ${isActive && i < currentIdx ? 'bg-success-500' : 'bg-slate-200'}`} />}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
