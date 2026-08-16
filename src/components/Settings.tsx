import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Radio,
  Sliders,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetAllData, showToast } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <h2 className="text-xl font-bold text-slate-100 font-display">System & Edge Gateway Configuration</h2>
        <p className="text-xs text-slate-400">
          Telemetry polling intervals, local MQTT broker routing, and ISO 10816 alarm thresholds
        </p>
      </div>

      {/* MQTT Broker Settings */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          MQTT Broker Gateway Connectivity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 block mb-1">Local Broker URL / Port</label>
            <input
              type="text"
              value={settings.mqttBrokerUrl}
              onChange={(e) => updateSettings({ mqttBrokerUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Telemetry Polling Stream Rate ({settings.telemetryUpdateMs}ms)</label>
            <input
              type="range"
              min={500}
              max={5000}
              step={250}
              value={settings.telemetryUpdateMs}
              onChange={(e) => updateSettings({ telemetryUpdateMs: Number(e.target.value) })}
              className="w-full mt-2 accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.5s (High Load)</span>
              <span>1.5s (Default)</span>
              <span>5.0s (Power Save)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alarm Thresholds & Notifications */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Alarm Threshold Rules & Audio Alerts
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Audible Siren on Critical Faults</span>
              <span className="text-slate-400 text-[11px]">Triggers synthetic audio tone when Kurtosis &gt; 6.5 or Temp &gt; 70°C</span>
            </div>
            <input
              type="checkbox"
              checked={settings.audioAlarms}
              onChange={(e) => updateSettings({ audioAlarms: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Critical Asset Anomaly Push Notifications</span>
              <span className="text-slate-400 text-[11px]">Immediate browser toast alert upon machine health drop below 50%</span>
            </div>
            <input
              type="checkbox"
              checked={settings.criticalMachineAlerts}
              onChange={(e) => updateSettings({ criticalMachineAlerts: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Factory Reset */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-900/40 space-y-3">
        <h3 className="font-bold text-sm text-rose-300 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-400" />
          System Demonstration Reset
        </h3>
        <p className="text-xs text-slate-400">
          Clear injected faults, reset work orders, and restore initial factory baseline calibration dataset.
        </p>
        <button
          onClick={resetAllData}
          className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700/60 text-xs font-bold text-rose-300 transition-colors"
        >
          Reset All Simulation Data
        </button>
      </div>
    </div>
  );
};
