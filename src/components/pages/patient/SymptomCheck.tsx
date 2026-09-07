import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockUrgencyGuidance } from '@/data/mockData';
import type { UrgencyGuidance } from '@/types';
import { Activity, AlertTriangle, Stethoscope, Home, Clock, Siren, Check, ArrowRight, ShieldAlert } from 'lucide-react';

const levelConfig = {
  self_care: { icon: Home, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', badge: 'success' as const, label: 'Self-Care at Home' },
  see_doctor: { icon: Stethoscope, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200', badge: 'brand' as const, label: 'See a Doctor' },
  urgent: { icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', badge: 'warning' as const, label: 'Urgent - Visit within 24 hours' },
  emergency: { icon: Siren, color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', badge: 'danger' as const, label: 'Emergency - Call for help now' },
};

export function SymptomCheck() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [guidance, setGuidance] = useState<UrgencyGuidance[] | null>(null);

  const toggle = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const getGuidance = () => {
    const results = mockUrgencyGuidance.filter((g) => selected.includes(g.symptom));
    setGuidance(results.length > 0 ? results : []);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-success-600 to-accent-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('symptomCheckTitle')}</h2>
            <p className="text-sm text-white/80">{t('symptomCheckDesc')}</p>
          </div>
        </div>
      </div>

      {!guidance && (
        <>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">{t('selectSymptoms')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mockUrgencyGuidance.map((g) => {
                const active = selected.includes(g.symptom);
                return (
                  <button
                    key={g.symptom}
                    onClick={() => toggle(g.symptom)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                      active ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {active ? (
                      <Check size={18} className="text-brand-600 shrink-0" />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${active ? 'text-brand-700' : 'text-slate-700'}`}>
                      {g.symptom}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button size="lg" fullWidth icon={<ArrowRight size={20} />} onClick={getGuidance} disabled={selected.length === 0}>
            {t('getGuidance')}
          </Button>
        </>
      )}

      {guidance && (
        <>
          <div className="space-y-3">
            {guidance.map((g, i) => {
              const cfg = levelConfig[g.level];
              const Icon = cfg.icon;
              return (
                <Card key={i} className={`p-4 border-2 ${cfg.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon size={20} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{g.symptom}</h3>
                        <Badge variant={cfg.badge}>{cfg.label}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1.5">{g.advice}</p>
                      <div className="mt-3 space-y-1.5">
                        {g.recommendations.map((rec, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check size={14} className="text-success-600 mt-0.5 shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                      {g.level === 'emergency' && (
                        <a href="tel:108" className="block mt-3">
                          <Button variant="danger" size="sm" fullWidth icon={<Siren size={16} />}>
                            Call Emergency (108)
                          </Button>
                        </a>
                      )}
                      {(g.level === 'see_doctor' || g.level === 'urgent') && (
                        <Button size="sm" className="mt-3" icon={<Stethoscope size={16} />}>
                          {t('findDoctors')}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setGuidance(null); setSelected([]); }}>
              {t('back')}
            </Button>
          </div>
        </>
      )}

      <div className="flex items-start gap-2 p-3 bg-warning-50 border border-warning-200 rounded-xl">
        <ShieldAlert size={18} className="text-warning-600 mt-0.5 shrink-0" />
        <p className="text-xs text-warning-700">{t('disclaimer')}</p>
      </div>
    </div>
  );
}
