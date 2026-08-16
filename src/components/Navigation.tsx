import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenTab } from '../types';
import {
  Activity,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  Wrench,
  Bell,
  Award,
  User,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Zap,
  Radio,
  Clock,
  Shield,
  LogOut,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react';

interface NavItem {
  id: ScreenTab;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
}

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    maintenance,
    userProfile,
    userAccounts,
    switchUserAccount,
    logout,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setIsSearchOpen,
    telemetryLive,
    setTelemetryLive,
    triggerFaultSimulation,
    machines,
    isDrawerOpen,
    setIsDrawerOpen
  } = useApp();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isFaultModalOpen, setIsFaultModalOpen] = useState(false);
  const [selectedSimMachine, setSelectedSimMachine] = useState<string>('M-01');

  const unreadAlertsCount = alerts.filter((a) => a.status === 'unread').length;
  const activeOrdersCount = maintenance.filter((m) => m.status === 'in_progress' || m.status === 'pending').length;

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Command Center',
      shortLabel: 'Overview',
      icon: <Activity className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'machines',
      label: 'Fleet Monitoring',
      shortLabel: 'Fleet',
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
      badge: machines.length,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'digital_twin',
      label: '3D Digital Twin & AR',
      shortLabel: '3D Twin',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      badge: '3D+AR',
      badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-700/50'
    },
    {
      id: 'analytics',
      label: 'AI & Signal Analysis',
      shortLabel: 'Signals',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      badge: '8-Feat',
      badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
    },
    {
      id: 'factory_map',
      label: 'Factory Floor Map',
      shortLabel: 'Floor',
      icon: <MapPin className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'maintenance',
      label: 'Work Orders & Kanban',
      shortLabel: 'Kanban',
      icon: <Wrench className="w-5 h-5 text-orange-400" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-700/50'
    },
    {
      id: 'alerts',
      label: 'Alarm Center',
      shortLabel: 'Alarms',
      icon: <Bell className="w-5 h-5 text-rose-400" />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700/50'
    },
    {
      id: 'academic_review',
      label: 'PSG Defense Mode',
      shortLabel: 'PSG Review',
      icon: <Award className="w-5 h-5 text-purple-400" />,
      badge: 'C24653',
      badgeColor: 'bg-purple-950 text-purple-300 border border-purple-700/50'
    },
    {
      id: 'settings',
      label: 'System Settings',
      shortLabel: 'Settings',
      icon: <Settings className="w-5 h-5 text-slate-400" />
    }
  ];

  const handleFaultInject = (faultType: 'bearing_wear' | 'shaft_misalignment' | 'thermal_overload' | 'restore_normal') => {
    triggerFaultSimulation(selectedSimMachine, faultType);
    setIsFaultModalOpen(false);
  };

  return (
    <>
      {/* ── DESKTOP & TABLET SIDEBAR ───────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-30 bg-slate-950 border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <div className="font-black text-sm tracking-wider text-slate-100 flex items-center gap-1.5 font-display">
                  OMNI<span className="text-cyan-400">SIGHT</span>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Industrial IoT & AR
                </div>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden md:block"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Real-time MQTT Edge Status Indicator */}
        <div className={`px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/40 text-xs ${isSidebarCollapsed ? 'text-center' : ''}`}>
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono text-slate-300">ESP32 MQTT Edge</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                1883 ONLINE
              </span>
            </div>
          ) : (
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 mx-auto" title="MQTT Edge Connected"></span>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <span className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>

                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isSidebarCollapsed && item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account & Role Switcher */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 relative">
          <div
            onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 cursor-pointer transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{userProfile.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono truncate">{userProfile.role}</div>
              </div>
            )}
            {!isSidebarCollapsed && <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
          </div>

          {/* Account Dropdown Menu */}
          {isAccountDropdownOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Perspective
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {userAccounts.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserAccount(u.id);
                      setIsAccountDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                      u.id === userProfile.id ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover" />
                    <div className="truncate">
                      <div className="font-medium truncate">{u.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{u.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 mt-2 pt-2 flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsAccountDropdownOpen(false);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsAccountDropdownOpen(false);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── TOP INDUSTRIAL HEADER (FIXED TOP) ─────────────────────────── */}
      <header
        className={`fixed top-0 right-0 z-20 h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
          isSidebarCollapsed ? 'left-0 md:left-20' : 'left-0 md:left-64'
        }`}
      >
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase">OMNISIGHT //</span>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
        </div>

        {/* Right: Telemetry Controls, Search, Fault Injector, Alarms */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telemetry Live/Pause toggle */}
          <button
            onClick={() => setTelemetryLive(!telemetryLive)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
              telemetryLive
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle live telemetry streaming from simulated ESP32 nodes"
          >
            {telemetryLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>STREAM: LIVE</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-slate-400" />
                <span>STREAM: PAUSED</span>
              </>
            )}
          </button>

          {/* Quick Search Shortcut */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Evaluator Fault Simulation Trigger */}
          <button
            onClick={() => setIsFaultModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium transition-all"
            title="Inject simulated mechanical or thermal faults for project evaluation"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-mono">FAULT SANDBOX</span>
          </button>

          {/* Alarms Icon */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER NAVIGATION ───────────────────────────────────── */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-72 bg-slate-900 h-full p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  </div>
                  <div className="font-bold text-slate-100">OMNISIGHT</div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-mono">PSG Polytechnic College</div>
              <div className="text-[11px] text-slate-500">Dept of Computer Networking</div>
            </div>
          </div>
        </div>
      )}

      {/* ── EVALUATOR FAULT INJECTION MODAL ────────────────────────────── */}
      {isFaultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Evaluator Fault Injection Sandbox</h3>
              </div>
              <button
                onClick={() => setIsFaultModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Inject live mechanical degradation or thermal drift conditions into any factory asset to test the
              8-feature Random Forest classifier, 3D Digital Twin AR alerts, and work order dispatch pipeline.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Machine</label>
                <select
                  value={selectedSimMachine}
                  onChange={(e) => setSelectedSimMachine(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.name} ({m.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleFaultInject('bearing_wear')}
                  className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-700/60 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">
                    ⚡ Bearing Outer Race Spalling
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Spikes Kurtosis &gt; 7.0, Crest Factor &gt; 5.5, RUL &lt; 18h
                  </div>
                </button>

                <button
                  onClick={() => handleFaultInject('shaft_misalignment')}
                  className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-700/60 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                    📐 Angular Misalignment
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    2X harmonic surge at 180Hz, Peak Shock 5.1g
                  </div>
                </button>

                <button
                  onClick={() => handleFaultInject('thermal_overload')}
                  className="p-3 rounded-xl bg-orange-950/40 hover:bg-orange-950/70 border border-orange-700/60 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-orange-300 group-hover:text-orange-200">
                    🔥 Stator Thermal Overload
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Temperature jump to +84.5°C with current ripple
                  </div>
                </button>

                <button
                  onClick={() => handleFaultInject('restore_normal')}
                  className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-700/60 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                    ✓ Restore Optimal Baseline
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Resets health to 94%, clears fault conditions
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsFaultModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Close Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
