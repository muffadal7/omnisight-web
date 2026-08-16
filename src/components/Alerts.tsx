import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Filter,
  CheckCheck,
  Wrench,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  ExternalLink
} from 'lucide-react';
import { SeverityLevel } from '../types';

export const Alerts: React.FC = () => {
  const { alerts, resolveAlert, markAlertRead, navigateToMachine, setActiveTab, settings, updateSettings, showToast } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'unread' | SeverityLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.featureTriggered.toLowerCase().includes(searchQuery.toLowerCase());

    if (severityFilter === 'all') return matchesSearch;
    if (severityFilter === 'unread') return matchesSearch && a.status === 'unread';
    return matchesSearch && a.severity === severityFilter;
  });

  const unreadCount = alerts.filter((a) => a.status === 'unread').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
              Industrial Alarm & Anomaly Center
            </h2>
            <p className="text-xs text-slate-400">
              Tri-axial ISO threshold violations, Kurtosis spikes, and AI fault alerts
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Toggle & Quick Filter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              updateSettings({ audioAlarms: !settings.audioAlarms });
              showToast(settings.audioAlarms ? 'Audio alarms muted' : 'Audio alarms enabled', 'info');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              settings.audioAlarms
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {settings.audioAlarms ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{settings.audioAlarms ? 'Audio Alarms Active' : 'Audio Muted'}</span>
          </button>
        </div>
      </div>

      {/* ── FILTER TABS ─────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-lg uppercase ${
              severityFilter === 'all' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            All Alarms ({alerts.length})
          </button>
          <button
            onClick={() => setSeverityFilter('unread')}
            className={`px-3 py-1.5 rounded-lg uppercase ${
              severityFilter === 'unread' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-3 py-1.5 rounded-lg uppercase ${
              severityFilter === 'critical' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSeverityFilter('warning')}
            className={`px-3 py-1.5 rounded-lg uppercase ${
              severityFilter === 'warning' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            Warning
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter alarms..."
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      {/* ── ALARM CARDS LIST ────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alert.status === 'unread'
                ? alert.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-950/30'
                  : 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/30'
                : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                }`}
              >
                {alert.severity === 'critical' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : alert.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {alert.id}
                  </span>
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    {alert.machineName} ({alert.machineId})
                  </span>
                  <span className="text-xs text-slate-500 font-mono">• {alert.timestamp}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-100">{alert.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{alert.description}</p>

                <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    Trigger: <strong className="text-slate-200">{alert.featureTriggered}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    Action: {alert.recommendedAction}
                  </span>
                </div>
              </div>
            </div>

            {/* Alarm Actions */}
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <button
                onClick={() => {
                  navigateToMachine(alert.machineId);
                  setActiveTab('digital_twin');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>3D Inspect</span>
              </button>

              {alert.status === 'unread' && (
                <button
                  onClick={() => markAlertRead(alert.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Acknowledge
                </button>
              )}

              {alert.status !== 'resolved' ? (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-slate-950 flex items-center gap-1 shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
