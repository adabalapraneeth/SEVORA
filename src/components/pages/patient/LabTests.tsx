import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockLabTests } from '@/data/mockData';
import type { LabTest } from '@/types';
import { FlaskConical, Clock, CheckCircle2, FileText, IndianRupee, Plus } from 'lucide-react';

const statusConfig = {
  pending: { variant: 'warning' as const, icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
  in_progress: { variant: 'info' as const, icon: Clock, color: 'text-accent-600', bg: 'bg-accent-50' },
  completed: { variant: 'success' as const, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
};

const availableTests = [
  { name: 'Complete Blood Count (CBC)', cost: 250 },
  { name: 'Lipid Profile', cost: 400 },
  { name: 'Blood Glucose (Fasting)', cost: 150 },
  { name: 'HbA1c (Diabetes)', cost: 350 },
  { name: 'Thyroid Profile (T3, T4, TSH)', cost: 500 },
  { name: 'Urine Routine', cost: 100 },
  { name: 'Liver Function Test', cost: 450 },
  { name: 'Kidney Function Test', cost: 400 },
  { name: 'Vitamin D', cost: 600 },
  { name: 'ECG', cost: 300 },
];

export function LabTests() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tests, setTests] = useState<LabTest[]>(mockLabTests);
  const [showBook, setShowBook] = useState(false);
  const [selectedTest, setSelectedTest] = useState<typeof availableTests[0] | null>(null);
  const [booked, setBooked] = useState(false);

  if (!user) return null;
  const myTests = user.role === 'patient' ? tests.filter((l) => l.patientId === user.id) : tests;

  const bookTest = () => {
    if (selectedTest) {
      const newTest: LabTest = {
        id: `l${Date.now()}`,
        patientId: user.id,
        patientName: user.name,
        testName: selectedTest.name,
        labName: 'City Diagnostic Lab',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        cost: selectedTest.cost,
      };
      setTests((prev) => [newTest, ...prev]);
      setBooked(true);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader
        title={t('labTests')}
        subtitle="Book and track laboratory tests"
        action={user.role === 'patient' ? <Button size="sm" icon={<Plus size={16} />} onClick={() => { setShowBook(true); setBooked(false); setSelectedTest(null); }}>{t('bookTest')}</Button> : undefined}
      />

      {myTests.length === 0 ? (
        <Card className="p-4"><EmptyState icon={FlaskConical} title={t('noData')} /></Card>
      ) : (
        <div className="space-y-3">
          {myTests.map((test) => {
            const cfg = statusConfig[test.status];
            const StatusIcon = cfg.icon;
            return (
              <Card key={test.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <FlaskConical size={20} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{test.testName}</h3>
                      <Badge variant={cfg.variant}>{test.status === 'in_progress' ? t('inProgress') : test.status === 'completed' ? t('completed') : t('pending')}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{test.labName} • {test.date}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <IndianRupee size={13} />{test.cost}
                      </span>
                    </div>
                    {test.result && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileText size={14} className="text-slate-500" />
                          <p className="text-xs font-semibold text-slate-700">Result</p>
                        </div>
                        <p className="text-xs text-slate-600">{test.result}</p>
                        <button className="flex items-center gap-1 text-xs text-brand-600 font-medium mt-2 hover:underline">
                          <FileText size={13} />{t('viewReport')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showBook} onClose={() => setShowBook(false)} title={t('bookTest')} size="md">
        {!booked ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">Select a test to book at City Diagnostic Lab:</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableTests.map((test) => (
                <button
                  key={test.name}
                  onClick={() => setSelectedTest(test)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                    selectedTest?.name === test.name ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm font-medium ${selectedTest?.name === test.name ? 'text-brand-700' : 'text-slate-700'}`}>
                    {test.name}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-600 font-semibold">
                    <IndianRupee size={14} />{test.cost}
                  </span>
                </button>
              ))}
            </div>
            <Button fullWidth size="lg" disabled={!selectedTest} onClick={bookTest}>{t('confirm')}</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-success-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Test Booked!</h3>
            <p className="text-sm text-slate-500 mt-1">Your {selectedTest?.name} has been booked at City Diagnostic Lab.</p>
            <Button className="mt-4" onClick={() => setShowBook(false)}>{t('close')}</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
