import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { appointmentTimeSlots } from '@/data/mockData';
import { fetchDoctors, insertAppointment } from '@/lib/supabase';
import type { User, Appointment } from '@/types';
import { Search, Star, Clock, MapPin, Video, Calendar, Check, Languages, IndianRupee, Briefcase, AlertCircle } from 'lucide-react';

export function FindDoctors() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [bookingStep, setBookingStep] = useState<'select' | 'date' | 'time' | 'reason' | 'confirm' | 'done'>('select');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [apptType, setApptType] = useState<'in-person' | 'teleconsultation'>('teleconsultation');
  const [reason, setReason] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [booking, setBooking] = useState(false);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDoctors(); }, [loadDoctors]);

  const filtered = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.specialization ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (d.facility ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'online' && d.onlineConsultation) ||
      (filter === 'offline' && d.offlineConsultation);
    return matchesSearch && matchesFilter;
  });

  const openBooking = (doctor: User) => {
    setSelectedDoctor(doctor);
    setBookingStep('date');
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setBookingError('');
    if (doctor.onlineConsultation && !doctor.offlineConsultation) {
      setApptType('teleconsultation');
    } else if (doctor.offlineConsultation && !doctor.onlineConsultation) {
      setApptType('in-person');
    } else {
      setApptType('teleconsultation');
    }
  };

  const closeBooking = () => {
    setSelectedDoctor(null);
    setBookingStep('select');
    setBookingError('');
  };

  const confirmBooking = async () => {
    if (!selectedDoctor || !user) return;
    setBooking(true);
    setBookingError('');
    try {
      const meetingId = apptType === 'teleconsultation'
        ? `SEV-${Date.now().toString(36).toUpperCase().slice(-6)}`
        : undefined;
      const location = apptType === 'in-person' ? selectedDoctor.facility : undefined;

      await insertAppointment(
        user.id,
        user.name,
        selectedDoctor.id,
        selectedDoctor.name,
        selectedDoctor.specialization ?? '',
        selectedDate,
        selectedTime,
        apptType,
        reason,
        meetingId,
        location,
      );
      setBookingStep('done');
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const nextWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { value: d.toISOString().split('T')[0], label: d.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' }) };
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <SectionHeader title={t('findDoctors')} subtitle="Browse and book appointments with available doctors" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 animate-fade-in">
        <SectionHeader title={t('findDoctors')} subtitle="Browse and book appointments with available doctors" />
        <Card className="p-4">
          <EmptyState icon={AlertCircle} title="Failed to load doctors" description={error} />
          <Button size="sm" className="mt-3" onClick={loadDoctors}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader title={t('findDoctors')} subtitle="Browse and book appointments with available doctors" />

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchDoctors')}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          {t('all')}
        </button>
        <button
          onClick={() => setFilter('online')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'online' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          <Video size={14} /> Online
        </button>
        <button
          onClick={() => setFilter('offline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'offline' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          <MapPin size={14} /> In-Person
        </button>
      </div>

      {/* Doctor cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <Card className="col-span-2 p-4"><EmptyState icon={Search} title="No doctors found" description="Try a different search term" /></Card>
        ) : (
          filtered.map((doctor) => {
            const available = doctor.onlineConsultation || doctor.offlineConsultation;
            return (
              <Card key={doctor.id} className="p-4" hover>
                <div className="flex items-start gap-3">
                  <Avatar name={doctor.name} color={doctor.avatarColor} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900">{doctor.name}</h3>
                    <p className="text-sm text-slate-500">{doctor.specialization}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {doctor.yearsExperience != null && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Briefcase size={13} />
                          {doctor.yearsExperience} {t('yearsExp')}
                        </span>
                      )}
                      {doctor.qualification && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Star size={13} className="text-warning-500 fill-warning-500" />
                          {doctor.qualification}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={available ? 'success' : 'default'}>
                    {available ? t('available') : t('unavailable')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <MapPin size={14} />
                  <span className="truncate">{doctor.facility}{doctor.location ? `, ${doctor.location}` : ''}</span>
                </div>
                {doctor.languages.length > 0 && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Languages size={14} />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                )}
                {(doctor.availableDays?.length ?? 0) > 0 && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>{doctor.availableDays!.join(', ')}</span>
                    {doctor.availableTimes && <span>• {doctor.availableTimes}</span>}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {doctor.onlineConsultation && (
                    <Badge variant="info" className="text-[10px]"><Video size={10} className="mr-0.5" />Online</Badge>
                  )}
                  {doctor.offlineConsultation && (
                    <Badge variant="default" className="text-[10px]"><MapPin size={10} className="mr-0.5" />In-Person</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <Button size="sm" fullWidth onClick={() => openBooking(doctor)} disabled={!available}>
                    {t('bookAppointment')}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      <Modal open={!!selectedDoctor} onClose={closeBooking} title={t('bookAppt')} size="md">
        {selectedDoctor && bookingStep !== 'done' && (
          <div className="space-y-4">
            {/* Doctor info */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Avatar name={selectedDoctor.name} color={selectedDoctor.avatarColor} size="md" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">{selectedDoctor.name}</p>
                <p className="text-xs text-slate-500">{selectedDoctor.specialization}</p>
                {selectedDoctor.facility && <p className="text-xs text-slate-400">{selectedDoctor.facility}</p>}
              </div>
            </div>

            {/* Step: Date */}
            {bookingStep === 'date' && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">{t('selectDate')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {nextWeek.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => { setSelectedDate(d.value); setBookingStep('time'); }}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                        selectedDate === d.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Time */}
            {bookingStep === 'time' && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">{t('selectTime')}</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {appointmentTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => { setSelectedTime(slot); setBookingStep('reason'); }}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                        selectedTime === slot ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button onClick={() => setBookingStep('date')} className="text-sm text-slate-500 mt-3 hover:text-slate-700">{t('back')}</button>
              </div>
            )}

            {/* Step: Reason & Type */}
            {bookingStep === 'reason' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">{t('appointmentType')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setApptType('teleconsultation')}
                      disabled={!selectedDoctor.onlineConsultation}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        apptType === 'teleconsultation' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
                      }`}
                    >
                      <Video size={18} className={apptType === 'teleconsultation' ? 'text-brand-600' : 'text-slate-400'} />
                      <span className="text-sm font-medium text-slate-700">{t('teleconsultation')}</span>
                    </button>
                    <button
                      onClick={() => setApptType('in-person')}
                      disabled={!selectedDoctor.offlineConsultation}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        apptType === 'in-person' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
                      }`}
                    >
                      <MapPin size={18} className={apptType === 'in-person' ? 'text-brand-600' : 'text-slate-400'} />
                      <span className="text-sm font-medium text-slate-700">{t('inPerson')}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">{t('reasonVisit')}</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Describe your symptoms or reason for visit..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                  />
                </div>
                {bookingError && (
                  <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">{bookingError}</div>
                )}
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setBookingStep('time')}>{t('back')}</Button>
                  <Button fullWidth onClick={() => setBookingStep('confirm')} disabled={!reason.trim()}>
                    {t('confirm')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Confirm */}
            {bookingStep === 'confirm' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">{t('date')}</span><span className="font-semibold text-slate-900">{selectedDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{t('time')}</span><span className="font-semibold text-slate-900">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{t('type')}</span><span className="font-semibold text-slate-900">{apptType === 'teleconsultation' ? t('teleconsultation') : t('inPerson')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{t('reasonVisit')}</span><span className="font-semibold text-slate-900 text-right max-w-[60%]">{reason}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-semibold text-slate-900">{selectedDoctor.name}</span></div>
                </div>
                {bookingError && (
                  <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">{bookingError}</div>
                )}
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setBookingStep('reason')}>{t('back')}</Button>
                  <Button fullWidth icon={<Calendar size={18} />} onClick={confirmBooking} disabled={booking}>
                    {booking ? 'Booking...' : `${t('confirm')} ${t('bookAppt')}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {bookingStep === 'done' && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
              <Check size={32} className="text-success-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Appointment Booked!</h3>
            <p className="text-sm text-slate-500 mt-1">Your appointment with {selectedDoctor?.name} on {selectedDate} at {selectedTime} has been booked successfully.</p>
            <Button className="mt-4" onClick={closeBooking}>{t('close')}</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
