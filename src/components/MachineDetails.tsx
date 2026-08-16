import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Activity,
  Layers,
  Sparkles,
  Flame,
  Radio,
  Wifi,
  Battery,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Shield,
  Gauge
} from 'lucide-react';

export const MachineDetails: React.FC = () => {
  const {
    machines,
    selectedMachineId,
    setActiveTab,
    addMaintenanceOrder,
    showToast,
    triggerFaultSimulation
  } = useApp();

  const machine = machines.find((m) => m.id === selectedMachineId) || machines[0];
  const [activeHistoryTab, setActiveHistoryTab] = useState<'1h' | '24h' | '7d'>('1h');

  const historyData =
    activeHistoryTab === '1h'
      ? machine.history1H
      : activeHistoryTab === '24h'
      ? machine.history24H
      : machine.history7D;

  const handleCreateWorkOrder = () => {
    addMaintenanceOrder({
      machineId: machine.id,
      machineName: machine.name,
      issue: `AI Alert: ${machine.aiPrediction.condition}`,
      priority: machine.status === 'critical' ? 'critical' : 'high',
      dueDate: 'Within 24 Hours',
      status: 'pending',
      assignedTo: 'Muffadal (Vibration Specialist)',
      notes: `Automated dispatch from telemetry diagnostics. Crest Factor: ${machine.telemetry.crestFactor}, Kurtosis: ${machine.telemetry.kurtosis}`,
      estimatedHours: 2.0,
      spareParts: ['Inspection Gasket', 'Bearing Lubricant']
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── BREADCRUMB & TOP ACTIONS ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('machines')}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {machine.id}
              </span>
              <span className="text-xs font-mono text-slate-400">{machine.location}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-0.5 font-display">{machine.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('digital_twin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Launch 3D Digital Twin</span>
          </button>

          <button
            onClick={handleCreateWorkOrder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Dispatch Work Order</span>
          </button>
        </div>
      </div>

      {/* ── HARDWARE SENSOR NODE STATUS & HEALTH SCORE ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Machine Health Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Health Index</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                machine.status === 'healthy'
                  ? 'bg-emerald-950 text-emerald-300'
                  : machine.status === 'warning'
                  ? 'bg-amber-950 text-amber-300'
                  : 'bg-rose-950 text-rose-300'
              }`}
            >
              {machine.status}
            </span>
          </div>
          <div className="my-3">
            <span className="text-4xl font-black text-slate-100 font-mono">{machine.healthScore}%</span>
            <div className="w-full h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  machine.healthScore > 80 ? 'bg-emerald-500' : machine.healthScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${machine.healthScore}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Operating Speed: {machine.rpm} RPM</div>
        </div>

        {/* ESP32 Edge Node Hardware Status */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs text-slate-200">ESP32 + MPU6050 Hardware Telemetry</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              ● {machine.sensor.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">NODE ID</span>
              <span className="font-bold text-slate-200">{machine.sensor.nodeId}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">BATTERY</span>
              <span className="font-bold text-emerald-400">{machine.sensor.battery}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">WI-FI RSSI</span>
              <span className="font-bold text-cyan-400">{machine.sensor.signalDbm} dBm</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SAMPLING</span>
              <span className="font-bold text-indigo-300">{machine.sensor.samplingRateHz} Hz</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8 TIME-DOMAIN PARAMETERS BREAKDOWN ────────────────────────── */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-display">
          <Activity className="w-4 h-4 text-cyan-400" />
          Live 8-Feature Time-Domain Acceleration & Thermal Telemetry
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">RMS ENERGY</span>
            <span className="font-bold text-lg text-slate-100">{machine.telemetry.rms} mm/s</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">PEAK SHOCK</span>
            <span className="font-bold text-lg text-cyan-400">{machine.telemetry.peakShock} g</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">CREST FACTOR</span>
            <span className="font-bold text-lg text-amber-400">{machine.telemetry.crestFactor}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">KURTOSIS</span>
            <span className="font-bold text-lg text-purple-400">{machine.telemetry.kurtosis}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">SKEWNESS</span>
            <span className="font-bold text-lg text-slate-200">{machine.telemetry.skewness}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">VARIANCE (σ²)</span>
            <span className="font-bold text-lg text-slate-200">{machine.telemetry.variance}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MAV AMPLITUDE</span>
            <span className="font-bold text-lg text-slate-200">{machine.telemetry.mav}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">BEARING TEMP</span>
            <span className="font-bold text-lg text-rose-400">{machine.telemetry.temperature}°C</span>
          </div>
        </div>
      </div>

      {/* ── HISTORICAL HEALTH DEGRADATION TREND SPARKLINE ─────────────── */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Historical Health Trend
          </h3>
          <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            {(['1h', '24h', '7d'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveHistoryTab(tab)}
                className={`px-2.5 py-1 rounded uppercase ${
                  activeHistoryTab === tab ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="h-28 flex items-end gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          {historyData.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {val}%
              </span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all"
                style={{ height: `${val}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
