import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { AppShell } from '@/components/layout/AppShell';
import { PatientDashboard } from '@/components/pages/patient/PatientDashboard';
import { PatientProfile } from '@/components/pages/patient/PatientProfile';
import { FindDoctors } from '@/components/pages/patient/FindDoctors';
import { Appointments } from '@/components/pages/patient/Appointments';
import { Teleconsultation } from '@/components/pages/patient/Teleconsultation';
import { SymptomCheck } from '@/components/pages/patient/SymptomCheck';
import { FindHospitals } from '@/components/pages/patient/FindHospitals';
import { Referrals } from '@/components/pages/patient/Referrals';
import { LabTests } from '@/components/pages/patient/LabTests';
import { Medicines } from '@/components/pages/patient/Medicines';
import { Reminders } from '@/components/pages/patient/Reminders';
import { HealthRecords } from '@/components/pages/patient/HealthRecords';
import { EmergencyHelp } from '@/components/pages/shared/EmergencyHelp';
import { Profile } from '@/components/pages/shared/Profile';
import { DoctorDashboard } from '@/components/pages/doctor/DoctorDashboard';
import { HealthcareWorkerDashboard } from '@/components/pages/healthcare_worker/HealthcareWorkerDashboard';
import { AdminDashboard } from '@/components/pages/admin/AdminDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-slate-500 text-sm">Loading SEVORA...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderPage = () => {
    // Shared pages
    if (activeTab === 'emergency') return <EmergencyHelp />;
    if (activeTab === 'profile') return <Profile />;
    if (activeTab === 'profile_view') return <PatientProfile />;

    // Role-specific pages
    switch (user.role) {
      case 'patient':
        switch (activeTab) {
          case 'dashboard': return <PatientDashboard onNavigate={setActiveTab} />;
          case 'doctors': return <FindDoctors />;
          case 'appointments': return <Appointments />;
          case 'teleconsultation': return <Teleconsultation />;
          case 'symptom': return <SymptomCheck />;
          case 'hospitals': return <FindHospitals />;
          case 'referrals': return <Referrals />;
          case 'labs': return <LabTests />;
          case 'medicines': return <Medicines />;
          case 'reminders': return <Reminders />;
          case 'records': return <HealthRecords />;
          default: return <PatientDashboard onNavigate={setActiveTab} />;
        }

      case 'doctor':
        switch (activeTab) {
          case 'dashboard': return <DoctorDashboard />;
          case 'appointments': return <Appointments />;
          case 'teleconsultation': return <Teleconsultation />;
          case 'records': return <HealthRecords />;
          case 'referrals': return <Referrals />;
          case 'labs': return <LabTests />;
          default: return <DoctorDashboard />;
        }

      case 'healthcare_worker':
        switch (activeTab) {
          case 'dashboard': return <HealthcareWorkerDashboard />;
          case 'patients': return <HealthcareWorkerDashboard />;
          case 'records': return <HealthRecords />;
          case 'referrals': return <Referrals />;
          case 'reminders': return <Reminders />;
          case 'medicines': return <Medicines />;
          default: return <HealthcareWorkerDashboard />;
        }

      case 'admin':
        switch (activeTab) {
          case 'dashboard': return <AdminDashboard />;
          case 'appointments': return <Appointments />;
          case 'records': return <HealthRecords />;
          case 'referrals': return <Referrals />;
          case 'medicines': return <Medicines />;
          default: return <AdminDashboard />;
        }

      default:
        return <PatientDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderPage()}
    </AppShell>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
