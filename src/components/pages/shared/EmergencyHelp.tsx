import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/StatCard';
import { mockEmergencyContacts, mockHospitals } from '@/data/mockData';
import { Siren, Phone, MapPin, Building2, HeartPulse, Clock, Navigation, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function EmergencyHelp() {
  const { t } = useLanguage();
  const [sosActive, setSosActive] = useState(false);

  const emergencyHospitals = mockHospitals.filter((h) => h.open24h).sort((a, b) => a.distance - b.distance);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* SOS Button */}
      <div className="bg-gradient-to-r from-danger-600 to-danger-700 rounded-2xl p-6 text-white text-center shadow-lg shadow-danger-600/20">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setSosActive(!sosActive)}
            className={`relative w-28 h-28 rounded-full bg-white text-danger-600 font-bold text-xl shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              sosActive ? 'animate-pulse-ring' : ''
            }`}
          >
            {sosActive && <span className="absolute inset-0 rounded-full bg-white/40 animate-pulse-ring" />}
            <div className="flex flex-col items-center">
              <Siren size={32} />
              <span className="text-sm mt-1">SOS</span>
            </div>
          </button>
          <h2 className="text-xl font-bold mt-4">{t('sosButton')}</h2>
          <p className="text-sm text-white/80 mt-1">{t('emergencyDesc')}</p>
          {sosActive && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <CheckCircle2 size={18} />
              <span>Alert sent to emergency contacts and nearby facilities</span>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <SectionHeader title={t('emergencyContacts')} subtitle="Tap to call immediately" />
        <div className="grid sm:grid-cols-2 gap-3">
          {mockEmergencyContacts.map((contact) => (
            <a key={contact.id} href={`tel:${contact.phone}`}>
              <Card className="p-4 flex items-center gap-3" hover>
                <div className="w-12 h-12 rounded-xl bg-danger-50 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-danger-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.role}</p>
                  <p className="text-sm font-semibold text-brand-600 mt-0.5">{contact.phone}</p>
                </div>
                {contact.available24h && <Badge variant="danger" className="text-[10px]">{t('open24h')}</Badge>}
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Nearby Emergency Facilities */}
      <div>
        <SectionHeader title={t('nearbyFacilities')} subtitle="24/7 emergency facilities near you" />
        <div className="space-y-3">
          {emergencyHospitals.map((h) => (
            <Card key={h.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-danger-50 flex items-center justify-center shrink-0">
                  {h.type === 'hospital' ? <Building2 size={22} className="text-danger-600" /> : <HeartPulse size={22} className="text-danger-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{h.name}</h3>
                    <Badge variant="danger" className="text-[10px]">{t('open24h')}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Navigation size={12} />{h.distance} km</span>
                    <span className="flex items-center gap-1"><Star size={12} className="text-warning-500 fill-warning-500" />{h.rating}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                    <MapPin size={13} className="shrink-0" />{h.address}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.services.map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${h.phone}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-danger-50 text-danger-700 text-xs font-semibold hover:bg-danger-100 transition-colors">
                        <Phone size={14} />{t('callNow')}
                      </button>
                    </a>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors">
                      <Navigation size={14} />{t('getDirections')}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-4 bg-warning-50 border border-warning-200 rounded-xl">
        <AlertTriangle size={20} className="text-warning-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-warning-800">Important</p>
          <p className="text-xs text-warning-700 mt-0.5">
            In a life-threatening emergency, call your local emergency number (108 for ambulance, 112 for all services) immediately.
            Do not wait for app response. The SOS feature sends alerts to your configured contacts.
          </p>
        </div>
      </div>
    </div>
  );
}
