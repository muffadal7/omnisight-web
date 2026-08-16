import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenTab } from '../types';
import {
  Search,
  Cpu,
  Layers,
  Activity,
  MapPin,
  Wrench,
  Bell,
  Award,
  Settings,
  User,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    machines,
    navigateToMachine,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.id.toLowerCase().includes(query.toLowerCase()) ||
      m.location.toLowerCase().includes(query.toLowerCase()) ||
      m.type.toLowerCase().includes(query.toLowerCase())
  );

  const quickNavItems: { id: ScreenTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'home', label: 'Executive Command Center', icon: <Activity className="w-4 h-4 text-cyan-400" />, desc: 'Plant overview, OEE, real-time oscilloscope' },
    { id: 'digital_twin', label: '3D Digital Twin & AR Studio', icon: <Layers className="w-4 h-4 text-indigo-400" />, desc: 'Interactive Three.js 3D model, exploded view & AR HUD' },
    { id: 'analytics', label: 'AI & 8-Feature Signal Analytics', icon: <Sparkles className="w-4 h-4 text-emerald-400" />, desc: 'FFT spectrum, Random Forest ML, Crest Factor & Kurtosis' },
    { id: 'factory_map', label: 'Interactive Factory Floor Map', icon: <MapPin className="w-4 h-4 text-amber-400" />, desc: 'Bay 1-4 machine layout & thermal heatmap' },
    { id: 'machines', label: 'Asset Fleet Directory', icon: <Cpu className="w-4 h-4 text-sky-400" />, desc: 'High-density multi-machine matrix' },
    { id: 'maintenance', label: 'Smart Maintenance Kanban', icon: <Wrench className="w-4 h-4 text-orange-400" />, desc: 'Work orders, spare parts & MTBF' },
    { id: 'alerts', label: 'Alarm & Anomaly Center', icon: <Bell className="w-4 h-4 text-rose-400" />, desc: 'Tri-axial threshold violations' },
    { id: 'academic_review', label: 'PSG College Defense Mode', icon: <Award className="w-4 h-4 text-purple-400" />, desc: 'Project C24653 review, hardware BOM & evaluator sandbox' },
  ];

  const handleSelectTab = (tab: ScreenTab) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  const handleSelectMachine = (id: string) => {
    navigateToMachine(id);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search machines, sensor telemetry, views, or commands... (e.g. 'CNC', 'Kurtosis', 'Bay 1')"
            autoFocus
            className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm font-medium"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 text-sm">
          {/* Machines Match */}
          {filteredMachines.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Industrial Assets ({filteredMachines.length})
              </div>
              <div className="space-y-1">
                {filteredMachines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMachine(m.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          m.status === 'healthy'
                            ? 'bg-emerald-400'
                            : m.status === 'warning'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          {m.name}
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {m.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {m.location} • Health {m.healthScore}% • {m.aiPrediction.condition}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Sections */}
          <div>
            <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Platform Views & Workspaces
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 group-hover:bg-slate-700">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200 text-xs sm:text-sm group-hover:text-cyan-300">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {item.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Press ESC to exit</span>
          <span>OmniSight Industrial v2.4</span>
        </div>
      </div>
    </div>
  );
};
