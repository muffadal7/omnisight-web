import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Layers,
  Cpu,
  Flame,
  Activity,
  User,
  Zap,
  Info,
  Maximize2,
  X,
  ExternalLink,
  Thermometer,
  Wind
} from 'lucide-react';
import { Machine } from '../types';

export const FactoryMap: React.FC = () => {
  const { machines, navigateToMachine, setActiveTab } = useApp();

  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(machines[0] || null);
  const [showHeatmapLayer, setShowHeatmapLayer] = useState(true);
  const [showWorkerLayer, setShowWorkerLayer] = useState(true);
  const [activeBayFilter, setActiveBayFilter] = useState<'all' | 'bay-1' | 'bay-2' | 'bay-3' | 'bay-4'>('all');

  const bays = [
    { id: 'bay-1', name: 'Bay 1: Tooling & CNC Cell', bounds: 'col-span-1 row-span-1', machinesCount: 2, ambientTemp: '24.2°C', power: '28.4 kW' },
    { id: 'bay-2', name: 'Bay 2: Heavy Turning Station', bounds: 'col-span-1 row-span-1', machinesCount: 1, ambientTemp: '26.8°C', power: '18.2 kW' },
    { id: 'bay-3', name: 'Bay 3: Automated Assembly Line', bounds: 'col-span-1 row-span-1', machinesCount: 1, ambientTemp: '25.1°C', power: '14.6 kW' },
    { id: 'bay-4', name: 'Bay 4: Central Utility & HVAC', bounds: 'col-span-1 row-span-1', machinesCount: 2, ambientTemp: '29.5°C', power: '32.0 kW' }
  ];

  const workers = [
    { id: 'w1', name: 'Adnaan Khan M (Lead)', role: 'Lead Engineer', x: 28, y: 35, bay: 'Bay 1' },
    { id: 'w2', name: 'Muffadal (Vib Spec)', role: 'Vibration Specialist', x: 74, y: 68, bay: 'Bay 3' },
    { id: 'w3', name: 'Ashwin R (AR Eng)', role: 'AR Engineer', x: 55, y: 38, bay: 'Bay 2' },
  ];

  const filteredMachines = activeBayFilter === 'all' ? machines : machines.filter((m) => m.bayId === activeBayFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
              Interactive Factory Floor & Spatial Asset Layout
            </h2>
            <p className="text-xs text-slate-400">
              Live spatial coordinates, multi-bay thermal distribution, and real-time worker telemetry
            </p>
          </div>
        </div>

        {/* Filters & Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['all', 'bay-1', 'bay-2', 'bay-3', 'bay-4'] as const).map((bay) => (
              <button
                key={bay}
                onClick={() => setActiveBayFilter(bay)}
                className={`px-3 py-1.5 rounded-lg font-mono uppercase transition-all ${
                  activeBayFilter === bay
                    ? 'bg-amber-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {bay === 'all' ? 'All Bays' : bay.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowHeatmapLayer(!showHeatmapLayer)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showHeatmapLayer
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap Overlay</span>
          </button>

          <button
            onClick={() => setShowWorkerLayer(!showWorkerLayer)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showWorkerLayer
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Field Personnel</span>
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE 2D/ISOMETRIC FLOOR PLAN ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Floor Plan Canvas Container (2 cols) */}
        <div className="xl:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative flex flex-col justify-between min-h-[560px] overflow-hidden">
          {/* Bay Background Grid Layout */}
          <div className="relative w-full flex-1 rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden bg-grid-industrial min-h-[460px]">
            {/* Bay Zones Grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-4 gap-4 pointer-events-none">
              {bays.map((bay) => (
                <div
                  key={bay.id}
                  className={`rounded-xl border border-dashed border-slate-800/80 bg-slate-900/20 p-3 flex flex-col justify-between transition-colors ${
                    activeBayFilter === bay.id ? 'border-amber-500/50 bg-amber-950/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      {bay.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{bay.machinesCount} Assets</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                    <span>Temp: {bay.ambientTemp}</span>
                    <span>Power: {bay.power}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Thermal Heatmap Glowing Zones */}
            {showHeatmapLayer && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[60%] left-[70%] w-48 h-48 rounded-full bg-rose-500/20 blur-3xl" />
                <div className="absolute top-[20%] left-[20%] w-40 h-40 rounded-full bg-emerald-500/15 blur-2xl" />
                <div className="absolute top-[20%] left-[55%] w-36 h-36 rounded-full bg-cyan-500/15 blur-2xl" />
                <div className="absolute top-[50%] left-[20%] w-44 h-44 rounded-full bg-amber-500/20 blur-2xl" />
              </div>
            )}

            {/* Machine Interactive Nodes */}
            {filteredMachines.map((m) => {
              const isSelected = selectedMachine?.id === m.id;
              return (
                <div
                  key={m.id}
                  style={{ top: `${m.coordinates.y}%`, left: `${m.coordinates.x}%` }}
                  onClick={() => setSelectedMachine(m)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  {/* Pulsing ring on warning/critical */}
                  {m.status !== 'healthy' && (
                    <span
                      className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                        m.status === 'critical' ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                    />
                  )}

                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-2 shadow-2xl transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/50 scale-110'
                        : 'bg-slate-950/90 border-slate-700 hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        m.status === 'healthy'
                          ? 'bg-emerald-400'
                          : m.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                    />
                    <div className="text-left font-mono">
                      <div className="text-[11px] font-bold text-slate-100 flex items-center gap-1">
                        {m.id}
                      </div>
                      <div className="text-[9px] text-slate-400">{m.telemetry.peakShock}g • {m.telemetry.temperature}°C</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Field Personnel Worker Pins */}
            {showWorkerLayer &&
              workers.map((w) => (
                <div
                  key={w.id}
                  style={{ top: `${w.y}%`, left: `${w.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                >
                  <div className="flex items-center gap-1 bg-indigo-950/90 border border-indigo-500/50 px-2 py-1 rounded-full text-[10px] font-mono text-indigo-300 shadow-lg">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span>{w.name.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Bottom Floor Legend */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 border-t border-slate-800/80 mt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Optimal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Warning (Laser/Suction)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical (Bearing Wear)</span>
            </div>
            <span>Scale: 1:100 Industrial Metric Grid</span>
          </div>
        </div>

        {/* Selected Machine Quick Inspect Drawer */}
        <div className="space-y-4">
          {selectedMachine ? (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">{selectedMachine.id} // {selectedMachine.location}</span>
                  <h3 className="font-bold text-base text-slate-100 mt-0.5">{selectedMachine.name}</h3>
                  <p className="text-xs text-slate-400">{selectedMachine.type}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                    selectedMachine.status === 'healthy'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : selectedMachine.status === 'warning'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                  }`}
                >
                  {selectedMachine.status}
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">HEALTH SCORE</span>
                  <span className="font-bold text-base text-slate-100">{selectedMachine.healthScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">OPERATING RPM</span>
                  <span className="font-bold text-base text-cyan-400">{selectedMachine.rpm} RPM</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CREST FACTOR</span>
                  <span className="font-bold text-base text-amber-400">{selectedMachine.telemetry.crestFactor}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">BEARING TEMP</span>
                  <span className="font-bold text-base text-rose-400">{selectedMachine.telemetry.temperature}°C</span>
                </div>
              </div>

              {/* AI Prediction */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">AI Diagnostic Insight</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {selectedMachine.aiPrediction.recommendedAction}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Time-to-Failure:</span>
                  <span className="font-bold text-amber-400">{selectedMachine.aiPrediction.timeToFailureEst}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    navigateToMachine(selectedMachine.id);
                    setActiveTab('digital_twin');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D Digital Twin</span>
                </button>

                <button
                  onClick={() => navigateToMachine(selectedMachine.id)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Deep Telemetry</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              Click any machine marker on the floor plan to inspect telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
