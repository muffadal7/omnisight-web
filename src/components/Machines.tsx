import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpDown,
  Layers,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  ExternalLink
} from 'lucide-react';
import { MachineStatus, Machine } from '../types';

export const Machines: React.FC = () => {
  const { machines, navigateToMachine, setSelectedMachineId, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MachineStatus>('all');
  const [bayFilter, setBayFilter] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'health_desc' | 'health_asc' | 'vib_desc' | 'temp_desc'>('health_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filteredMachines = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesBay = bayFilter === 'all' || m.bayId === bayFilter;

    return matchesSearch && matchesStatus && matchesBay;
  });

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    switch (sortBy) {
      case 'health_asc':
        return a.healthScore - b.healthScore;
      case 'health_desc':
        return b.healthScore - a.healthScore;
      case 'vib_desc':
        return b.telemetry.totalVibration - a.telemetry.totalVibration;
      case 'temp_desc':
        return b.telemetry.temperature - a.telemetry.temperature;
      default:
        return 0;
    }
  });

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const comparedMachines = machines.filter((m) => compareIds.includes(m.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
              Industrial Asset Fleet Directory
            </h2>
            <p className="text-xs text-slate-400">
              6 Tri-Axial ESP32 + MPU6050 vibration telemetry nodes across factory bays
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Comparison Badge */}
        <div className="flex items-center gap-3">
          {compareIds.length > 0 && (
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300">
              Comparing {compareIds.length} Assets
            </span>
          )}

          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ───────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search asset name, node ID, location, or condition..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {(['all', 'healthy', 'warning', 'critical'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                statusFilter === st
                  ? st === 'healthy'
                    ? 'bg-emerald-600 text-white font-bold'
                    : st === 'warning'
                    ? 'bg-amber-600 text-white font-bold'
                    : st === 'critical'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="health_desc">Health: High to Low</option>
            <option value="health_asc">Health: Low to High</option>
            <option value="vib_desc">Vibration: Highest</option>
            <option value="temp_desc">Temperature: Highest</option>
          </select>
        </div>
      </div>

      {/* ── GRID VIEW ─────────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedMachines.map((m) => (
            <div
              key={m.id}
              onClick={() => navigateToMachine(m.id)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {m.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{m.sensor.nodeId}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-100 mt-1 group-hover:text-cyan-300 transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.location}</p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      m.status === 'healthy'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        : m.status === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                        : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {/* Telemetry Matrix Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">HEALTH</span>
                    <span className="font-bold text-slate-100">{m.healthScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">CREST FACTOR</span>
                    <span className="font-bold text-cyan-400">{m.telemetry.crestFactor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">TEMPERATURE</span>
                    <span className="font-bold text-rose-400">{m.telemetry.temperature}°C</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/40 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">AI Diagnosis</span>
                  <div className="text-slate-300 font-medium text-[11px] line-clamp-1">
                    {m.aiPrediction.condition}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => toggleCompare(m.id, e)}
                  className={`text-[11px] font-mono px-2 py-1 rounded transition-colors ${
                    compareIds.includes(m.id)
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {compareIds.includes(m.id) ? '✓ Comparing' : '+ Compare'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMachineId(m.id);
                      setActiveTab('digital_twin');
                    }}
                    className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 transition-colors"
                    title="View 3D Digital Twin"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-cyan-400 font-medium flex items-center group-hover:translate-x-0.5 transition-transform">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TABLE VIEW ─────────────────────────────────────────────────── */}
      {viewMode === 'table' && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Asset & Node</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Health</th>
                <th className="p-3 text-right">RMS (mm/s)</th>
                <th className="p-3 text-right">Peak (g)</th>
                <th className="p-3 text-right">Crest Factor</th>
                <th className="p-3 text-right">Temp (°C)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedMachines.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => navigateToMachine(m.id)}
                  className="hover:bg-slate-950/60 cursor-pointer"
                >
                  <td className="p-3 font-medium text-slate-200">
                    <div className="font-bold">{m.name}</div>
                    <div className="text-[10px] text-slate-500">{m.id} • {m.sensor.nodeId}</div>
                  </td>
                  <td className="p-3 text-slate-400 font-sans">{m.location}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        m.status === 'healthy'
                          ? 'bg-emerald-950 text-emerald-300'
                          : m.status === 'warning'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-100">{m.healthScore}%</td>
                  <td className="p-3 text-right text-slate-300">{m.telemetry.rms}</td>
                  <td className="p-3 text-right text-cyan-400 font-bold">{m.telemetry.peakShock}</td>
                  <td className="p-3 text-right text-amber-400 font-bold">{m.telemetry.crestFactor}</td>
                  <td className="p-3 text-right text-rose-400 font-bold">{m.telemetry.temperature}°C</td>
                  <td className="p-3 text-right">
                    <span className="text-cyan-400 font-sans hover:underline">View &rarr;</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MULTI-MACHINE COMPARISON DRAWER ────────────────────────────── */}
      {comparedMachines.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              Side-by-Side Asset Comparison ({comparedMachines.length})
            </h3>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {comparedMachines.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="font-bold text-sm text-cyan-300">{m.name}</div>
                <div className="text-[11px] text-slate-400">{m.location}</div>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="flex justify-between"><span>Health:</span><strong className="text-white">{m.healthScore}%</strong></div>
                  <div className="flex justify-between"><span>RMS Energy:</span><span>{m.telemetry.rms} mm/s</span></div>
                  <div className="flex justify-between"><span>Peak Shock:</span><span className="text-cyan-400">{m.telemetry.peakShock} g</span></div>
                  <div className="flex justify-between"><span>Crest Factor:</span><span className="text-amber-400">{m.telemetry.crestFactor}</span></div>
                  <div className="flex justify-between"><span>Kurtosis:</span><span className="text-purple-400">{m.telemetry.kurtosis}</span></div>
                  <div className="flex justify-between"><span>Temperature:</span><span className="text-rose-400">{m.telemetry.temperature}°C</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
