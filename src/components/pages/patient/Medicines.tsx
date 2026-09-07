import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Badge } from '@/components/ui/Card';
import { SectionHeader, EmptyState } from '@/components/ui/StatCard';
import { mockMedicines } from '@/data/mockData';
import { Pill, Search, IndianRupee, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Medicines() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_stock' | 'out_stock'>('all');

  const filtered = mockMedicines.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'in_stock' && m.inStock) || (filter === 'out_stock' && !m.inStock);
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(mockMedicines.map((m) => m.category)));

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader title={t('medicines')} subtitle="Check medicine availability at nearby pharmacies" />

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchMedicine')}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'in_stock', 'out_stock'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f === 'all' ? t('all') : f === 'in_stock' ? t('inStock') : t('outOfStock')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-4"><EmptyState icon={Pill} title="No medicines found" /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((med) => (
            <Card key={med.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  med.inStock ? 'bg-success-50' : 'bg-danger-50'
                }`}>
                  {med.inStock ? <Package size={20} className="text-success-600" /> : <AlertCircle size={20} className="text-danger-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{med.name}</h3>
                    <Badge variant={med.inStock ? 'success' : 'danger'}>
                      {med.inStock ? t('inStock') : t('outOfStock')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{med.category} • {med.pharmacy}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500">
                    <span className="flex items-center gap-1"><IndianRupee size={13} />{med.price}</span>
                    {med.inStock && (
                      <span className="flex items-center gap-1">
                        <Package size={13} />
                        {med.stock} {med.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
