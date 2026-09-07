import { useState, type ReactNode } from 'react';
import { Menu, X, LogOut, Globe, Wifi, WifiOff, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { navItems } from '@/config/navigation';
import { Avatar } from '@/components/ui/Card';
import { languageNames } from '@/i18n/translations';
import type { Language } from '@/types';

interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export function AppShell({ activeTab, onTabChange, children }: AppShellProps) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  if (!user) return null;

  const items = navItems[user.role];

  const handleNav = (id: string) => {
    onTabChange(id);
    setSidebarOpen(false);
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  })();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 fixed h-screen overflow-y-auto">
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">SEVORA</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">{t('tagline')}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
                <span>{t(item.label)}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-100">
          <button
            onClick={() => handleNav('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'profile' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserIcon size={20} className={activeTab === 'profile' ? 'text-brand-600' : 'text-slate-400'} />
            <span>{t('profile')}</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-600 hover:bg-danger-50 transition-all mt-1"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-in">
            <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-lg font-bold text-slate-900">SEVORA</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {items.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
                    <span>{t(item.label)}</span>
                  </button>
                );
              })}
              <button
                onClick={() => handleNav('profile')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'profile' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserIcon size={20} className={activeTab === 'profile' ? 'text-brand-600' : 'text-slate-400'} />
                <span>{t('profile')}</span>
              </button>
            </nav>
            <div className="px-3 py-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-danger-600 hover:bg-danger-50 transition-all"
              >
                <LogOut size={20} />
                <span>{t('logout')}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu size={22} />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="font-bold text-slate-900">SEVORA</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm text-slate-500">{greeting},</p>
                <p className="text-base font-bold text-slate-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Online/Offline indicator */}
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                  isOnline ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                }`}
                title={isOnline ? t('online') : t('offline')}
              >
                {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>{isOnline ? t('online') : t('offline')}</span>
              </button>

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifs(false); }}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Globe size={18} />
                  <span className="text-sm font-medium hidden sm:inline">{languageNames[lang]}</span>
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

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotifs(!showNotifs); setShowLangMenu(false); }}
                  className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
                </button>
                {showNotifs && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
                    <div className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-slate-200 z-20 animate-fade-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{t('notifications')}</h3>
                        <button className="text-xs text-brand-600 font-medium hover:underline">{t('markAllRead')}</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {[
                          { title: 'Appointment Confirmed', msg: 'Your teleconsultation with Dr. Anita Sharma is confirmed for today at 2:00 PM.', time: '2h ago', unread: true },
                          { title: 'Referral Accepted', msg: 'Your referral to District Hospital has been accepted.', time: '1d ago', unread: true },
                          { title: 'Lab Test Reminder', msg: 'Your Lipid Profile test is scheduled for Sep 1.', time: '2d ago', unread: false },
                          { title: 'Medication Reminder', msg: 'Take Metformin (morning dose) at 8:00 AM.', time: '5h ago', unread: true },
                        ].map((n, i) => (
                          <div key={i} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-brand-50/30' : ''}`}>
                            <div className="flex items-start gap-2">
                              {n.unread && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />}
                              <div className={n.unread ? '' : 'pl-4'}>
                                <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.msg}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Avatar */}
              <button onClick={() => handleNav('profile')} className="ml-1">
                <Avatar name={user.name} color={user.avatarColor} size="md" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 py-5 pb-24 lg:pb-6 max-w-6xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 safe-bottom">
          <div className="flex items-center justify-around px-1 py-1.5 overflow-x-auto gap-0.5">
            {items.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[60px] transition-colors ${
                    active ? 'text-brand-600' : 'text-slate-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium leading-none whitespace-nowrap">{t(item.label)}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
