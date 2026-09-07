import { useState } from 'react';
import { useAuth, type RegisterData } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { languageNames } from '@/i18n/translations';
import type { Role, Language } from '@/types';
import {
  Globe, User, Stethoscope, HeartPulse, Mail, Lock, Phone,
  User as UserIcon, ArrowRight, Check, Calendar, MapPin, Droplet,
  Home, AlertTriangle, Pill, FileText, GraduationCap, Briefcase,
  Clock, Languages, Video, Building2, Heart, ChevronDown, ChevronUp,
} from 'lucide-react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['Male', 'Female', 'Other'];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const workerTypes = ['ASHA Worker', 'ANM (Auxiliary Nurse Midwife)', 'Health Volunteer', 'Community Health Worker', 'Field Officer'];

export function AuthScreen() {
  const { login, register } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('patient');

  // Patient fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Doctor fields
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [facility, setFacility] = useState('');
  const [location, setLocation] = useState('');
  const [languages, setLanguages] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState('');
  const [onlineConsultation, setOnlineConsultation] = useState(true);
  const [offlineConsultation, setOfflineConsultation] = useState(true);

  // Healthcare worker fields
  const [workerType, setWorkerType] = useState('');
  const [healthCenter, setHealthCenter] = useState('');
  const [experience, setExperience] = useState('');

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setPassword('');
    setDateOfBirth(''); setGender(''); setBloodGroup('');
    setAddress(''); setVillage(''); setDistrict(''); setState('');
    setEmergencyContactName(''); setEmergencyContactRelationship(''); setEmergencyContactPhone('');
    setAllergies(''); setExistingConditions(''); setCurrentMedications(''); setMedicalHistory('');
    setQualification(''); setSpecialization(''); setYearsExperience('');
    setFacility(''); setLocation(''); setLanguages('');
    setAvailableDays([]); setAvailableTimes('');
    setOnlineConsultation(true); setOfflineConsultation(true);
    setWorkerType(''); setHealthCenter(''); setExperience('');
    setShowOptional(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (mode === 'login') {
      const result = await login(email, password);
      if (!result.success) { setError(result.error || 'Login failed'); setSubmitting(false); }
      return;
    }

    // Registration validation
    if (!name.trim()) return setError('Full name is required');
    if (!email.trim()) return setError('Email is required');
    if (!phone.trim()) return setError('Phone number is required');
    if (!password.trim()) return setError('Password is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    if (role === 'patient') {
      if (!dateOfBirth) return setError('Date of birth is required');
      if (!gender) return setError('Gender is required');
      if (!bloodGroup) return setError('Blood group is required');
      if (!address.trim()) return setError('Address is required');
      if (!village.trim()) return setError('Village is required');
      if (!district.trim()) return setError('District is required');
      if (!state.trim()) return setError('State is required');
      if (!emergencyContactName.trim()) return setError('Emergency contact name is required');
      if (!emergencyContactPhone.trim()) return setError('Emergency contact phone is required');
    }

    if (role === 'doctor') {
      if (!dateOfBirth) return setError('Date of birth is required');
      if (!gender) return setError('Gender is required');
      if (!qualification.trim()) return setError('Medical qualification is required');
      if (!specialization.trim()) return setError('Specialization is required');
      if (!yearsExperience.trim()) return setError('Years of experience is required');
      if (!facility.trim()) return setError('Hospital/Clinic name is required');
      if (!location.trim()) return setError('Location is required');
      if (!languages.trim()) return setError('Languages spoken is required');
    }

    if (role === 'healthcare_worker') {
      if (!gender) return setError('Gender is required');
      if (!address.trim()) return setError('Address is required');
      if (!village.trim()) return setError('Village is required');
      if (!district.trim()) return setError('District is required');
      if (!state.trim()) return setError('State is required');
      if (!workerType) return setError('Worker type is required');
      if (!healthCenter.trim()) return setError('Health centre/organization is required');
      if (!experience.trim()) return setError('Experience is required');
    }

    const data: RegisterData = {
      name, email, phone, role, password,
      dateOfBirth, gender, bloodGroup, address, village, district, state,
      emergencyContactName, emergencyContactRelationship, emergencyContactPhone,
      allergies, existingConditions, currentMedications, medicalHistory,
      qualification, specialization, yearsExperience, facility, location, languages,
      availableDays, availableTimes, onlineConsultation, offlineConsultation,
      workerType, healthCenter, experience,
    };

    const result = await register(data);
    if (!result.success) { setError(result.error || 'Registration failed'); setSubmitting(false); }
  };

  const roleOptions: { value: Role; label: string; icon: typeof User; color: string }[] = [
    { value: 'patient', label: t('patient'), icon: UserIcon, color: 'brand' },
    { value: 'doctor', label: t('doctor'), icon: Stethoscope, color: 'accent' },
    { value: 'healthcare_worker', label: t('healthcareWorker'), icon: HeartPulse, color: 'success' },
  ];

  const toggleDay = (day: string) => {
    setAvailableDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Language selector */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <Globe size={16} />
            <span>{languageNames[lang]}</span>
          </button>
          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 animate-fade-in">
                {(Object.keys(languageNames) as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${
                      lang === l ? 'text-brand-700 font-semibold bg-brand-50/50' : 'text-slate-700'
                    }`}
                  >
                    {languageNames[l]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Left Panel - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 text-white p-8 lg:p-12 flex flex-col justify-center min-h-[30vh] lg:min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">SEVORA</h1>
              <p className="text-sm text-white/70 mt-0.5">{t('tagline')}</p>
            </div>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4">
            Healthcare for rural and underserved communities
          </h2>
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-8">
            Connect with doctors, book appointments, access your health records, get emergency help, and more — all in one place.
          </p>
          <div className="space-y-3">
            {[
              'Patient registration and digital health records',
              'Doctor search, appointment booking & teleconsultation',
              'Emergency help with nearby facilities',
              'Referral tracking, lab tests, and medicine availability',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-white" />
                </div>
                <span className="text-sm text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? t('welcomeBack') : t('createAccount')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login' ? t('enterCredentials') : t('fillDetails')}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('signIn')}
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); resetForm(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('signUp')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('selectRole')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const active = role === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setRole(opt.value); setError(''); }}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                            active ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
                          <span className={`text-xs font-medium text-center ${active ? 'text-brand-700' : 'text-slate-600'}`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Common: Name */}
                <FormField icon={UserIcon} label={t('fullName')} value={name} onChange={setName} placeholder="Ramesh Kumar" required />

                {/* Common: Phone */}
                <FormField icon={Phone} label={t('phone')} value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" required />
              </>
            )}

            {/* Common: Email + Password (always shown) */}
            <FormField icon={Mail} label={t('email')} value={email} onChange={setEmail} placeholder="you@sevora.health" type="email" required />
            <FormField icon={Lock} label={t('password')} value={password} onChange={setPassword} placeholder="••••••••" type="password" required />

            {/* Patient-specific fields */}
            {mode === 'register' && role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FormField icon={Calendar} label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" required />
                  <SelectField icon={UserIcon} label="Gender" value={gender} onChange={setGender} options={genderOptions} required />
                </div>
                <SelectField icon={Droplet} label="Blood Group" value={bloodGroup} onChange={setBloodGroup} options={bloodGroups} required />
                <FormField icon={Home} label="Full Address" value={address} onChange={setAddress} placeholder="House No, Street, Area" required />
                <div className="grid grid-cols-3 gap-3">
                  <FormField icon={MapPin} label="Village" value={village} onChange={setVillage} placeholder="Village" required />
                  <FormField icon={MapPin} label="District" value={district} onChange={setDistrict} placeholder="District" required />
                  <FormField icon={MapPin} label="State" value={state} onChange={setState} placeholder="State" required />
                </div>

                {/* Emergency Contact */}
                <div className="pt-2">
                  <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Heart size={15} className="text-danger-600" /> Emergency Contact
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField icon={UserIcon} label="Contact Name" value={emergencyContactName} onChange={setEmergencyContactName} placeholder="Spouse / Parent" required />
                    <FormField icon={UserIcon} label="Relationship" value={emergencyContactRelationship} onChange={setEmergencyContactRelationship} placeholder="Spouse" />
                  </div>
                  <FormField icon={Phone} label="Contact Phone" value={emergencyContactPhone} onChange={setEmergencyContactPhone} placeholder="+91 98765 12345" type="tel" required />
                </div>

                {/* Optional Medical Info */}
                <button
                  type="button"
                  onClick={() => setShowOptional(!showOptional)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700"
                >
                  <span>Medical Information (Optional)</span>
                  {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showOptional && (
                  <div className="space-y-3 animate-fade-in">
                    <FormField icon={AlertTriangle} label="Allergies (comma-separated)" value={allergies} onChange={setAllergies} placeholder="Penicillin, Dust, Peanuts" />
                    <FormField icon={FileText} label="Existing Medical Conditions (comma-separated)" value={existingConditions} onChange={setExistingConditions} placeholder="Diabetes, Hypertension" />
                    <FormField icon={Pill} label="Current Medications" value={currentMedications} onChange={setCurrentMedications} placeholder="Metformin 500mg, Amlodipine 5mg" />
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Medical History</label>
                      <textarea
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        rows={2}
                        placeholder="Previous surgeries, hospitalizations, chronic conditions..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Doctor-specific fields */}
            {mode === 'register' && role === 'doctor' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FormField icon={Calendar} label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" required />
                  <SelectField icon={UserIcon} label="Gender" value={gender} onChange={setGender} options={genderOptions} required />
                </div>
                <FormField icon={Home} label="Address" value={address} onChange={setAddress} placeholder="Clinic/Hospital Address" />
                <FormField icon={GraduationCap} label="Medical Qualification" value={qualification} onChange={setQualification} placeholder="MBBS, MD, etc." required />
                <FormField icon={Stethoscope} label="Specialization" value={specialization} onChange={setSpecialization} placeholder="Cardiology, Pediatrics, etc." required />
                <div className="grid grid-cols-2 gap-3">
                  <FormField icon={Briefcase} label="Years of Experience" value={yearsExperience} onChange={setYearsExperience} placeholder="12" type="number" required />
                  <FormField icon={Building2} label="Hospital/Clinic" value={facility} onChange={setFacility} placeholder="Rampur PHC" required />
                </div>
                <FormField icon={MapPin} label="Location" value={location} onChange={setLocation} placeholder="City, State" required />
                <FormField icon={Languages} label="Languages Spoken (comma-separated)" value={languages} onChange={setLanguages} placeholder="Hindi, English" required />

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Available Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {weekDays.map((day) => {
                      const selected = availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selected ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <FormField icon={Clock} label="Available Times" value={availableTimes} onChange={setAvailableTimes} placeholder="9:00 AM - 5:00 PM" />

                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${onlineConsultation ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                    <input type="checkbox" checked={onlineConsultation} onChange={(e) => setOnlineConsultation(e.target.checked)} className="sr-only" />
                    <Video size={18} className={onlineConsultation ? 'text-brand-600' : 'text-slate-400'} />
                    <span className="text-sm font-medium text-slate-700">Online Consultation</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${offlineConsultation ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                    <input type="checkbox" checked={offlineConsultation} onChange={(e) => setOfflineConsultation(e.target.checked)} className="sr-only" />
                    <Building2 size={18} className={offlineConsultation ? 'text-brand-600' : 'text-slate-400'} />
                    <span className="text-sm font-medium text-slate-700">In-Person Visit</span>
                  </label>
                </div>
              </>
            )}

            {/* Healthcare Worker-specific fields */}
            {mode === 'register' && role === 'healthcare_worker' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FormField icon={Calendar} label="Age" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
                  <SelectField icon={UserIcon} label="Gender" value={gender} onChange={setGender} options={genderOptions} required />
                </div>
                <FormField icon={Home} label="Address" value={address} onChange={setAddress} placeholder="Full Address" required />
                <div className="grid grid-cols-3 gap-3">
                  <FormField icon={MapPin} label="Village" value={village} onChange={setVillage} placeholder="Village" required />
                  <FormField icon={MapPin} label="District" value={district} onChange={setDistrict} placeholder="District" required />
                  <FormField icon={MapPin} label="State" value={state} onChange={setState} placeholder="State" required />
                </div>
                <SelectField icon={HeartPulse} label="Worker Type" value={workerType} onChange={setWorkerType} options={workerTypes} required />
                <FormField icon={Building2} label="Health Centre/Organization" value={healthCenter} onChange={setHealthCenter} placeholder="Rampur PHC" required />
                <FormField icon={Briefcase} label="Experience" value={experience} onChange={setExperience} placeholder="5 years" required />
              </>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" icon={<ArrowRight size={20} />} disabled={submitting}>
              {submitting ? 'Please wait...' : mode === 'login' ? t('signIn') : t('createAccount')}
            </Button>
          </form>


        </div>
      </div>
    </div>
  );
}

function FormField({
  icon: Icon, label, value, onChange, placeholder, type = 'text', required,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      <div className="relative">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function SelectField({
  icon: Icon, label, value, onChange, options, required,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      <div className="relative">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 bg-white appearance-none cursor-pointer"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
