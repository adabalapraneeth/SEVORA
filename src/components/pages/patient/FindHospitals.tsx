import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Badge } from '@/components/ui/Card';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockHospitals } from '@/data/mockData';
import type { Hospital } from '@/types';
import { MapPin, Phone, Clock, Star, Navigation, Search, Building2, Stethoscope, Pill, FlaskConical, HeartPulse } from 'lucide-react';

const typeConfig = {
  hospital: { icon: Building2, color: 'text-danger-600', bg: 'bg-danger-50', label: 'Hospital' },
  phc: { icon: HeartPulse, color: 'text-brand-600', bg: 'bg-brand-50', label: 'PHC' },
  clinic: { icon: Stethoscope, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Clinic' },
  pharmacy: { icon: Pill, color: 'text-success-600', bg: 'bg-success-50', label: 'Pharmacy' },
  lab: { icon: FlaskConical, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Lab' },
};

export function FindHospitals() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Hospital['type']>('all');

  const filtered = mockHospitals.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.address.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || h.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader title={t('findHospitals')} subtitle={t('findNearby')} />

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search')}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            filter === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {t('all')}
        </button>
        {(Object.keys(typeConfig) as Hospital['type'][]).map((type) => {
          const cfg = typeConfig[type];
          const Icon = cfg.icon;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === type ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Icon size={13} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-4"><EmptyState icon={MapPin} title="No facilities found" /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.sort((a, b) => a.distance - b.distance).map((h) => {
            const cfg = typeConfig[h.type];
            const Icon = cfg.icon;
            return (
              <Card key={h.id} className="p-4" hover>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon size={22} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{h.name}</h3>
                      <Badge variant="brand" className="text-[10px]">{cfg.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Navigation size={12} />{h.distance} km away</span>
                      <span className="flex items-center gap-1"><Star size={12} className="text-warning-500 fill-warning-500" />{h.rating}</span>
                      {h.open24h && <Badge variant="success" className="text-[10px]">{t('open24h')}</Badge>}
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
                        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
