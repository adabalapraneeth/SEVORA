import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { getUserAppointments } from '@/data/mockData';
import type { Appointment, MeetingStatus } from '@/types';
import {
  Video, Calendar, Clock, Phone, VideoOff, MessageSquare, Mic,
  Camera, ArrowLeft, Lock, Users, CheckCircle2, AlertCircle,
  Hourglass, UserCheck, Stethoscope, XCircle, Hash,
} from 'lucide-react';

const PATIENT_NO_SHOW_MINUTES = 15;

function getMeetingStatusLabel(status: MeetingStatus): string {
  const labels: Record<MeetingStatus, string> = {
    scheduled: 'Scheduled',
    meeting_soon: 'Meeting will start soon',
    waiting_for_patient: 'Waiting for Patient',
    waiting_for_doctor: 'Waiting for Doctor',
    in_progress: 'In Progress',
    completed: 'Completed',
    patient_did_not_join: 'Patient Did Not Join',
    doctor_did_not_join: 'Doctor Did Not Join',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

function getMeetingStatusVariant(status: MeetingStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' {
  const map: Record<MeetingStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand'> = {
    scheduled: 'info',
    meeting_soon: 'warning',
    waiting_for_patient: 'warning',
    waiting_for_doctor: 'warning',
    in_progress: 'success',
    completed: 'default',
    patient_did_not_join: 'danger',
    doctor_did_not_join: 'danger',
    cancelled: 'danger',
  };
  return map[status];
}

function getMeetingStatusIcon(status: MeetingStatus) {
  const map: Record<MeetingStatus, typeof Video> = {
    scheduled: Calendar,
    meeting_soon: Hourglass,
    waiting_for_patient: UserCheck,
    waiting_for_doctor: Stethoscope,
    in_progress: Video,
    completed: CheckCircle2,
    patient_did_not_join: AlertCircle,
    doctor_did_not_join: AlertCircle,
    cancelled: XCircle,
  };
  return map[status];
}

function parseAppointmentDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

function formatScheduledTime(date: string, time: string): string {
  const dt = parseAppointmentDateTime(date, time);
  return dt.toLocaleString('en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function Teleconsultation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(() => user ? getUserAppointments(user) : []);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const isPatient = user.role === 'patient';
  const isDoctor = user.role === 'doctor';

  // Filter teleconsultation appointments for this user only
  const teleAppts = appointments.filter((a) => a.type === 'teleconsultation');

  const activeAppt = teleAppts.find((a) => a.id === activeMeetingId);

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Meeting room view
  if (activeAppt && activeAppt.meetingStatus !== 'completed' && activeAppt.meetingStatus !== 'cancelled' && activeAppt.meetingStatus !== 'patient_did_not_join') {
    return (
      <MeetingRoom
        appointment={activeAppt}
        userRole={user.role}
        userName={user.name}
        now={now}
        onJoin={() => {
          const timestamp = new Date().toISOString();
          if (isPatient && !activeAppt.patientJoinedAt) {
            updateAppointment(activeAppt.id, { patientJoinedAt: timestamp });
          }
          if (isDoctor && !activeAppt.doctorJoinedAt) {
            updateAppointment(activeAppt.id, { doctorJoinedAt: timestamp });
          }
        }}
        onEndCall={() => {
          updateAppointment(activeAppt.id, {
            meetingStatus: 'completed',
            meetingEndedAt: new Date().toISOString(),
            completedBy: isDoctor ? 'doctor' : 'patient',
            status: 'completed',
          });
          setActiveMeetingId(null);
        }}
        onLeave={() => setActiveMeetingId(null)}
      />
    );
  }

  // Pre-meeting waiting room
  if (activeAppt) {
    return (
      <WaitingRoom
        appointment={activeAppt}
        userRole={user.role}
        now={now}
        onBack={() => setActiveMeetingId(null)}
        onJoin={() => {
          const apptTime = parseAppointmentDateTime(activeAppt.date, activeAppt.time);
          const diffMin = (now.getTime() - apptTime.getTime()) / 60000;
          if (diffMin < -1) return;

          const timestamp = new Date().toISOString();
          if (isPatient && !activeAppt.patientJoinedAt) {
            updateAppointment(activeAppt.id, { patientJoinedAt: timestamp });
          }
          if (isDoctor && !activeAppt.doctorJoinedAt) {
            updateAppointment(activeAppt.id, { doctorJoinedAt: timestamp });
          }
        }}
      />
    );
  }

  // List view
  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader title={t('teleconsultation')} subtitle="Secure video consultations — connected via meeting ID, not phone numbers" />

      <div className="bg-gradient-to-r from-accent-600 to-brand-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
            <Video size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Secure Video Consultations</h3>
            <p className="text-sm text-white/80">Each appointment has a unique meeting ID. No phone numbers are shared.</p>
          </div>
        </div>
      </div>

      <Card className="p-3 bg-brand-50/50 border-brand-200">
        <div className="flex items-start gap-2.5">
          <Lock size={16} className="text-brand-600 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600">
            Meetings are accessible only at the scheduled time. Joining early shows a waiting screen with the countdown.
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        {teleAppts.length === 0 ? (
          <Card className="p-4"><EmptyState icon={VideoOff} title="No teleconsultations scheduled" /></Card>
        ) : (
          teleAppts.map((apt) => (
            <TeleconsultationCard
              key={apt.id}
              appointment={apt}
              userRole={user.role}
              now={now}
              onJoin={() => setActiveMeetingId(apt.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TeleconsultationCard({
  appointment: apt,
  userRole,
  now,
  onJoin,
}: {
  appointment: Appointment;
  userRole: string;
  now: Date;
  onJoin: () => void;
}) {
  const apptTime = parseAppointmentDateTime(apt.date, apt.time);
  const diffMin = (now.getTime() - apptTime.getTime()) / 60000;
  const isCompleted = apt.meetingStatus === 'completed' || apt.meetingStatus === 'patient_did_not_join' || apt.meetingStatus === 'cancelled';
  const canJoin = apt.status === 'confirmed' && !isCompleted;
  const isEarly = diffMin < -1;

  const StatusIcon = apt.meetingStatus ? getMeetingStatusIcon(apt.meetingStatus) : Calendar;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
          <Video size={22} className="text-accent-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              {userRole === 'patient' ? apt.doctorName : apt.patientName}
            </h3>
            {apt.meetingStatus && (
              <Badge variant={getMeetingStatusVariant(apt.meetingStatus)}>
                <StatusIcon size={11} />
                {getMeetingStatusLabel(apt.meetingStatus)}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{apt.specialization}</p>

          {/* Meeting ID — prominently displayed, no phone */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              <Hash size={12} className="text-slate-400" />
              <span className="text-xs font-mono font-semibold text-slate-700">{apt.meetingId || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={13} />{apt.date}</span>
            <span className="flex items-center gap-1"><Clock size={13} />{apt.time}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-3 py-2 rounded-lg">{apt.reason}</p>

          {/* Timestamps for completed meetings */}
          {isCompleted && apt.meetingStartedAt && (
            <div className="mt-2 p-2.5 rounded-lg bg-slate-50 space-y-1 text-[11px] text-slate-500">
              {apt.patientJoinedAt && <div>Patient joined: {new Date(apt.patientJoinedAt).toLocaleString()}</div>}
              {apt.doctorJoinedAt && <div>Doctor joined: {new Date(apt.doctorJoinedAt).toLocaleString()}</div>}
              {apt.meetingStartedAt && <div>Meeting started: {new Date(apt.meetingStartedAt).toLocaleString()}</div>}
              {apt.meetingEndedAt && <div>Meeting ended: {new Date(apt.meetingEndedAt).toLocaleString()}</div>}
              {apt.completedBy && <div className="font-medium text-slate-600">Ended by: {apt.completedBy}</div>}
            </div>
          )}

          {/* Join button */}
          {canJoin ? (
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                icon={<Video size={16} />}
                onClick={onJoin}
              >
                {userRole === 'doctor' ? 'Start Consultation' : 'Join Meeting'}
              </Button>
              {isEarly && (
                <span className="text-xs text-warning-600 font-medium flex items-center gap-1">
                  <Hourglass size={13} /> Opens at scheduled time
                </span>
              )}
            </div>
          ) : isCompleted ? (
            <p className="text-xs text-slate-400 font-medium mt-3 flex items-center gap-1">
              <CheckCircle2 size={13} /> Meeting ended
            </p>
          ) : apt.status === 'pending' ? (
            <p className="text-xs text-warning-600 font-medium mt-3">Waiting for doctor confirmation</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function WaitingRoom({
  appointment: apt,
  userRole,
  now,
  onBack,
  onJoin,
}: {
  appointment: Appointment;
  userRole: string;
  now: Date;
  onBack: () => void;
  onJoin: () => void;
}) {
  const apptTime = parseAppointmentDateTime(apt.date, apt.time);
  const diffMin = (now.getTime() - apptTime.getTime()) / 60000;
  const isEarly = diffMin < -1;
  const isTooLate = diffMin > PATIENT_NO_SHOW_MINUTES && !apt.patientJoinedAt && userRole === 'patient';

  if (isTooLate) {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline">
          <ArrowLeft size={16} /> Back
        </button>
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-danger-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Meeting Window Closed</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            The join window for this appointment has expired. Please contact your healthcare provider to reschedule.
          </p>
        </Card>
      </div>
    );
  }

  if (isEarly) {
    const timeUntil = apptTime.getTime() - now.getTime();
    const hours = Math.floor(timeUntil / 3600000);
    const minutes = Math.floor((timeUntil % 3600000) / 60000);
    const seconds = Math.floor((timeUntil % 60000) / 1000);

    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline">
          <ArrowLeft size={16} /> Back
        </button>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-warning-100 flex items-center justify-center mx-auto mb-4">
            <Hourglass size={32} className="text-warning-600 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Meeting will start soon</h2>
          <p className="text-sm text-slate-500 mt-2">
            This meeting is scheduled for:
          </p>
          <p className="text-base font-bold text-brand-700 mt-1">{formatScheduledTime(apt.date, apt.time)}</p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <CountdownUnit value={hours} label="Hours" />
            <CountdownUnit value={minutes} label="Minutes" />
            <CountdownUnit value={seconds} label="Seconds" />
          </div>

          {/* Meeting ID */}
          <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
            <Hash size={14} className="text-slate-400" />
            <span className="text-sm font-mono font-semibold text-slate-700">{apt.meetingId}</span>
          </div>

          <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <Lock size={12} /> You can join at the scheduled time. Please wait.
          </p>
        </Card>
      </div>
    );
  }

  // At or past scheduled time — can join
  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline">
        <ArrowLeft size={16} /> Back
      </button>

      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
          <Video size={32} className="text-success-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Ready to Join</h2>
        <p className="text-sm text-slate-500 mt-2">
          {userRole === 'doctor' ? 'Start your consultation now' : 'Join your consultation now'}
        </p>
        <p className="text-base font-bold text-brand-700 mt-1">{formatScheduledTime(apt.date, apt.time)}</p>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
          <Hash size={14} className="text-slate-400" />
          <span className="text-sm font-mono font-semibold text-slate-700">{apt.meetingId}</span>
        </div>

        <div className="mt-6">
          <Button size="lg" icon={<Video size={20} />} onClick={onJoin}>
            {userRole === 'doctor' ? 'Start Consultation' : 'Join Meeting'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold font-mono">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] text-slate-400 mt-1.5 font-medium">{label}</span>
    </div>
  );
}

function MeetingRoom({
  appointment: apt,
  userRole,
  userName,
  now,
  onJoin,
  onEndCall,
  onLeave,
}: {
  appointment: Appointment;
  userRole: string;
  userName: string;
  now: Date;
  onJoin: () => void;
  onEndCall: () => void;
  onLeave: () => void;
}) {
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!joinedRef.current) {
      joinedRef.current = true;
      onJoin();
    }
  }, [onJoin]);

  const patientJoined = !!apt.patientJoinedAt;
  const doctorJoined = !!apt.doctorJoinedAt;
  const bothJoined = patientJoined && doctorJoined;

  // Determine current status
  let currentStatus: MeetingStatus = apt.meetingStatus || 'scheduled';
  if (bothJoined) {
    currentStatus = 'in_progress';
  } else if (patientJoined && !doctorJoined) {
    currentStatus = 'waiting_for_doctor';
  } else if (doctorJoined && !patientJoined) {
    currentStatus = 'waiting_for_patient';
  }

  // Check for patient no-show (doctor is in, patient hasn't joined after 15 min)
  const apptTime = parseAppointmentDateTime(apt.date, apt.time);
  const diffMin = (now.getTime() - apptTime.getTime()) / 60000;
  const patientNoShow = doctorJoined && !patientJoined && diffMin > PATIENT_NO_SHOW_MINUTES;

  if (patientNoShow && userRole === 'doctor') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-danger-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Patient Did Not Join</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            The patient has not joined within {PATIENT_NO_SHOW_MINUTES} minutes of the scheduled start time.
          </p>
          <Button
            variant="danger"
            className="mt-4"
            icon={<XCircle size={18} />}
            onClick={onEndCall}
          >
            Close Meeting
          </Button>
        </Card>
      </div>
    );
  }

  const otherPersonName = userRole === 'patient' ? apt.doctorName : apt.patientName;
  const otherPersonRole = userRole === 'patient' ? 'Doctor' : 'Patient';

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
        {/* Status bar */}
        <div className="px-4 py-2.5 bg-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getMeetingStatusVariant(currentStatus)}>
              {getMeetingStatusLabel(currentStatus)}
            </Badge>
            <span className="text-xs text-white/50 font-mono">{apt.meetingId}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <Lock size={12} /> Secure
          </div>
        </div>

        {/* Video area */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          {bothJoined ? (
            <div className="text-center text-white">
              <div className="w-24 h-24 rounded-full bg-brand-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-lg">
                {otherPersonName.split(' ').map((n) => n[0]).join('')}
              </div>
              <p className="text-lg font-semibold">{otherPersonName}</p>
              <p className="text-sm text-white/60">{otherPersonRole}</p>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-success-400">
                <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                Connected
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="w-20 h-20 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                {currentStatus === 'waiting_for_patient' ? (
                  <UserCheck size={36} className="text-warning-400 animate-pulse" />
                ) : currentStatus === 'waiting_for_doctor' ? (
                  <Stethoscope size={36} className="text-warning-400 animate-pulse" />
                ) : (
                  <Hourglass size={36} className="text-white/40 animate-pulse" />
                )}
              </div>
              <p className="text-lg font-semibold">
                {currentStatus === 'waiting_for_patient' && `Waiting for Patient`}
                {currentStatus === 'waiting_for_doctor' && `Waiting for Doctor`}
              </p>
              <p className="text-sm text-white/50 mt-1">
                {currentStatus === 'waiting_for_patient' && 'The patient will join shortly'}
                {currentStatus === 'waiting_for_doctor' && 'The doctor will join shortly'}
              </p>
              <p className="text-xs text-white/30 mt-3">{formatScheduledTime(apt.date, apt.time)}</p>
            </div>
          )}

          {/* Self view */}
          <div className="absolute bottom-3 right-3 w-24 h-20 sm:w-32 sm:h-24 bg-slate-700 rounded-lg border-2 border-white/20 flex items-center justify-center">
            <Camera size={20} className="text-white/40" />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 flex items-center justify-center gap-3">
          <button className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
            <Mic size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
            <Video size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
            <MessageSquare size={20} />
          </button>
          {userRole === 'doctor' && bothJoined ? (
            <button
              onClick={onEndCall}
              className="w-14 h-14 rounded-full bg-danger-600 flex items-center justify-center text-white hover:bg-danger-700 transition-colors shadow-lg shadow-danger-600/30"
              title="End Consultation"
            >
              <Phone size={22} className="rotate-[135deg]" />
            </button>
          ) : (
            <button
              onClick={onLeave}
              className="w-14 h-14 rounded-full bg-danger-600 flex items-center justify-center text-white hover:bg-danger-700 transition-colors shadow-lg shadow-danger-600/30"
              title="Leave Meeting"
            >
              <Phone size={22} className="rotate-[135deg]" />
            </button>
          )}
        </div>
      </div>

      {/* Meeting info */}
      <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {userRole === 'patient' ? apt.doctorName : apt.patientName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{apt.specialization} • {apt.reason}</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100">
            <Hash size={12} className="text-slate-400" />
            <span className="text-xs font-mono font-semibold text-slate-700">{apt.meetingId}</span>
          </div>
        </div>

        {/* Participant status */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${patientJoined ? 'bg-success-500' : 'bg-slate-300'}`} />
            <span className={patientJoined ? 'text-success-600 font-medium' : 'text-slate-400'}>
              Patient {patientJoined ? 'joined' : 'not joined'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${doctorJoined ? 'bg-success-500' : 'bg-slate-300'}`} />
            <span className={doctorJoined ? 'text-success-600 font-medium' : 'text-slate-400'}>
              Doctor {doctorJoined ? 'joined' : 'not joined'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
