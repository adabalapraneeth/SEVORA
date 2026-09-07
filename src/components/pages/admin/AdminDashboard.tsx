import { useLanguage } from '@/context/LanguageContext';
import { Card, Badge } from '@/components/ui/Card';
import { StatCard, SectionHeader } from '@/components/ui/StatCard';
import { adminStats, centreStats, mockMedicines, mockAppointments, mockReferrals } from '@/data/mockData';
import {
  Users, Calendar, Stethoscope, Send, Clock, Pill,
  Building2, Activity, AlertCircle, TrendingUp, HeartPulse,
  UserCog, Video,
} from 'lucide-react';

export function AdminDashboard() {
  const { t } = useLanguage();

  const lowStockMeds = mockMedicines.filter((m) => !m.inStock);
  const pendingAppts = mockAppointments.filter((a) => a.status === 'pending');
  const pendingRefs = mockReferrals.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-brand-600/20">
        <h1 className="text-xl sm:text-2xl font-bold">Administrator Dashboard</h1>
        <p className="text-white/80 text-sm mt-1">District-wide healthcare overview and statistics</p>
      </div>

      {/* Overview Stats */}
      <div>
        <SectionHeader title={t('overview')} subtitle="Key metrics across the district" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Users} label={t('totalPatients')} value={adminStats.totalPatients.toLocaleString()} color="text-brand-600" bgColor="bg-brand-50" />
          <StatCard icon={Calendar} label={t('totalAppointments')} value={adminStats.totalAppointments.toLocaleString()} color="text-accent-600" bgColor="bg-accent-50" />
          <StatCard icon={Stethoscope} label={t('totalConsultations')} value={adminStats.totalConsultations.toLocaleString()} color="text-success-600" bgColor="bg-success-50" />
          <StatCard icon={Send} label={t('totalReferrals')} value={adminStats.totalReferrals} color="text-warning-600" bgColor="bg-warning-50" />
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <SectionHeader title="Today's Activity" subtitle="Real-time activity for today" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Calendar} label="Appointments Today" value={adminStats.appointmentsToday} color="text-brand-600" bgColor="bg-brand-50" />
          <StatCard icon={Video} label="Consultations Today" value={adminStats.consultationsToday} color="text-accent-600" bgColor="bg-accent-50" />
          <StatCard icon={Clock} label="Avg. Waiting Time" value={adminStats.avgWaitingTime} color="text-warning-600" bgColor="bg-warning-50" />
          <StatCard icon={AlertCircle} label="Emergency Cases" value={adminStats.emergencyCases} color="text-danger-600" bgColor="bg-danger-50" />
        </div>
      </div>

      {/* Resources */}
      <div>
        <SectionHeader title="Healthcare Resources" subtitle="Infrastructure and workforce" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Building2} label="Healthcare Centres" value={adminStats.totalHospitals} color="text-brand-600" bgColor="bg-brand-50" />
          <StatCard icon={Stethoscope} label="Doctors" value={adminStats.totalDoctors} color="text-accent-600" bgColor="bg-accent-50" />
          <StatCard icon={HeartPulse} label="Healthcare Workers" value={adminStats.totalHealthcareWorkers} color="text-success-600" bgColor="bg-success-50" />
          <StatCard icon={Pill} label={t('medicineStock')} value={`${adminStats.medicineStockOk} OK`} color="text-success-600" bgColor="bg-success-50" subtitle={`${adminStats.medicineStockLow} low stock`} />
        </div>
      </div>

      {/* Centre Statistics */}
      <div>
        <SectionHeader title={t('centreStats')} subtitle="Performance by healthcare centre" />
        <div className="overflow-x-auto">
          <Card className="min-w-[640px] lg:min-w-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">{t('name')}</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">{t('totalPatients')}</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">{t('totalAppointments')}</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">{t('avgWaitingTime')}</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">{t('medicineStock')}</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {centreStats.map((centre, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{centre.name}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{centre.patients}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{centre.appointments}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{centre.waitingTime}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${centre.medicineStock > 70 ? 'bg-success-500' : centre.medicineStock > 50 ? 'bg-warning-500' : 'bg-danger-500'}`}
                            style={{ width: `${centre.medicineStock}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{centre.medicineStock}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={centre.status === 'active' ? 'success' : 'warning'}>
                        {centre.status === 'active' ? 'Active' : 'Low Stock'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Alerts & Pending Items */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-danger-600" />
            <h3 className="font-bold text-slate-900 text-sm">Low Stock Medicines</h3>
          </div>
          <div className="space-y-2">
            {lowStockMeds.map((med) => (
              <div key={med.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{med.name}</span>
                <Badge variant="danger" className="text-[10px]">{t('outOfStock')}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-warning-600" />
            <h3 className="font-bold text-slate-900 text-sm">Pending Appointments</h3>
          </div>
          <div className="space-y-2">
            {pendingAppts.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 truncate">{apt.patientName}</span>
                <span className="text-xs text-slate-400 shrink-0 ml-2">{apt.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Send size={18} className="text-accent-600" />
            <h3 className="font-bold text-slate-900 text-sm">Pending Referrals</h3>
          </div>
          <div className="space-y-2">
            {pendingRefs.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 truncate">{ref.patientName}</span>
                <Badge variant={ref.priority === 'emergency' ? 'danger' : ref.priority === 'urgent' ? 'warning' : 'default'} className="text-[10px]">
                  {ref.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
