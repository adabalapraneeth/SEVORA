import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Role } from '@/types';
import { supabase, mapProfileToUser } from '@/lib/supabase';

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  role: Role;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  existingConditions?: string;
  currentMedications?: string;
  medicalHistory?: string;
  qualification?: string;
  specialization?: string;
  yearsExperience?: string;
  facility?: string;
  location?: string;
  languages?: string;
  availableDays?: string[];
  availableTimes?: string;
  onlineConsultation?: boolean;
  offlineConsultation?: boolean;
  workerType?: string;
  healthCenter?: string;
  experience?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVATAR_COLORS = ['#2563eb', '#0891b2', '#059669', '#db2777', '#dc2626', '#ea580c'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!mounted) return;

          if (data) {
            setUser(mapProfileToUser(data));
          } else {
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setLoading(false);
      })();
    });

    return () => { mounted = false; };
  }, []);

  const login: AuthContextType['login'] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Login failed' };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found. Please contact support.' };
    }

    setUser(mapProfileToUser(profile));
    return { success: true };
  };

  const register: AuthContextType['register'] = async (data) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) return { success: false, error: authError.message };
    if (!authData.user) return { success: false, error: 'Registration failed' };

    const uid = authData.user.id;
    const today = new Date().toISOString().split('T')[0];
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const profile: Record<string, unknown> = {
      id: uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      avatar_color: avatarColor,
      registered_at: today,
    };

    if (data.role === 'patient') {
      profile.date_of_birth = data.dateOfBirth ?? null;
      profile.gender = data.gender ?? null;
      profile.blood_group = data.bloodGroup ?? null;
      profile.address = data.address ?? null;
      profile.village = data.village ?? null;
      profile.district = data.district ?? null;
      profile.state = data.state ?? null;
      profile.emergency_contact_name = data.emergencyContactName ?? null;
      profile.emergency_contact_relationship = data.emergencyContactRelationship ?? null;
      profile.emergency_contact_phone = data.emergencyContactPhone ?? null;
      profile.allergies = data.allergies ? data.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [];
      profile.existing_conditions = data.existingConditions ? data.existingConditions.split(',').map((s) => s.trim()).filter(Boolean) : [];
      profile.current_medications = data.currentMedications ?? null;
      profile.medical_history = data.medicalHistory ?? null;
      if (data.dateOfBirth) {
        profile.age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
      }
      profile.location = [data.village, data.district, data.state].filter(Boolean).join(', ') || null;
    } else if (data.role === 'doctor') {
      profile.qualification = data.qualification ?? null;
      profile.specialization = data.specialization ?? null;
      profile.years_experience = data.yearsExperience ? parseInt(data.yearsExperience) : null;
      profile.facility = data.facility ?? null;
      profile.location = data.location ?? null;
      profile.languages = data.languages ? data.languages.split(',').map((s) => s.trim()).filter(Boolean) : [];
      profile.available_days = data.availableDays ?? [];
      profile.available_times = data.availableTimes ?? null;
      profile.online_consultation = data.onlineConsultation ?? true;
      profile.offline_consultation = data.offlineConsultation ?? true;
      profile.license_no = data.qualification ?? null;
      profile.date_of_birth = data.dateOfBirth ?? null;
      profile.gender = data.gender ?? null;
    } else if (data.role === 'healthcare_worker') {
      profile.worker_type = data.workerType ?? null;
      profile.health_center = data.healthCenter ?? null;
      profile.experience = data.experience ?? null;
      profile.facility = data.healthCenter ?? null;
      profile.gender = data.gender ?? null;
      profile.address = data.address ?? null;
      profile.village = data.village ?? null;
      profile.district = data.district ?? null;
      profile.state = data.state ?? null;
      profile.location = [data.village, data.district, data.state].filter(Boolean).join(', ') || null;
    }

    const { error: profileError } = await supabase.from('profiles').insert(profile);

    if (profileError) {
      await supabase.auth.signOut();
      return { success: false, error: profileError.message };
    }

    const { data: fullProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (fullProfile) {
      setUser(mapProfileToUser(fullProfile));
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
