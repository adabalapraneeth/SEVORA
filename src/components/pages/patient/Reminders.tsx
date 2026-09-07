import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockReminders } from '@/data/mockData';
import type { Reminder } from '@/types';
import { BellRing, Plus, Clock, Calendar, Stethoscope, Pill, FlaskConical, Syringe, Check } from 'lucide-react';

const typeConfig = {
  follow_up: { icon: Stethoscope, color: 'text-brand-600', bg: 'bg-brand-50', label: 'Follow-up' },
  medication: { icon: Pill, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Medication' },
  test: { icon: FlaskConical, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Test' },
  vaccination: { icon: Syringe, color: 'text-success-600', bg: 'bg-success-50', label: 'Vaccination' },
};

export function Reminders() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Reminder['type']>('follow_up');
  const [newDate, setNewDate] = useState('');

  if (!user) return null;
  const myReminders = user.role === 'patient' ? reminders.filter((r) => r.patientId === user.id) : reminders;

  const toggleDone = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  };

  const addReminder = () => {
    if (newTitle && newDate) {
      const r: Reminder = {
        id: `rm${Date.now()}`,
        patientId: user.id,
        title: newTitle,
        type: newType,
        date: newDate,
        time: '09:00',
        done: false,
      };
      setReminders((prev) => [r, ...prev]);
      setShowAdd(false);
      setNewTitle('');
      setNewDate('');
    }
  };

  const sorted = [...myReminders].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader
        title={t('reminders')}
        subtitle="Follow-up and medication reminders"
        action={user.role === 'patient' ? <Button size="sm" icon={<Plus size={16} />} onClick={() => setShowAdd(true)}>{t('addReminder')}</Button> : undefined}
      />

      {sorted.length === 0 ? (
        <Card className="p-4"><EmptyState icon={BellRing} title={t('noData')} /></Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((rm) => {
            const cfg = typeConfig[rm.type];
            const Icon = cfg.icon;
            return (
              <Card key={rm.id} className={`p-4 ${rm.done ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleDone(rm.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      rm.done ? 'bg-success-500 border-success-500' : 'border-slate-300 hover:border-brand-400'
                    }`}
                  >
                    {rm.done && <Check size={14} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-semibold text-sm ${rm.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>{rm.title}</h3>
                      <Badge variant="default" className="text-[10px]">{cfg.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={13} />{rm.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} />{rm.time}</span>
                    </div>
                  </div>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t('addReminder')} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">{t('type')}</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(typeConfig) as Reminder['type'][]).map((type) => {
                const cfg = typeConfig[type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${
                      newType === type ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
                    }`}
                  >
                    <Icon size={16} className={cfg.color} />
                    <span className="text-xs font-medium text-slate-700">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Follow-up with Dr. Sharma"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('date')}</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900"
            />
          </div>
          <Button fullWidth size="lg" onClick={addReminder} disabled={!newTitle || !newDate}>{t('save')}</Button>
        </div>
      </Modal>
    </div>
  );
}
