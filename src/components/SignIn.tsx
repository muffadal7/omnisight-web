import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';

export const SignIn: React.FC = () => {
  const { login, userAccounts } = useApp();

  const [email, setEmail] = useState('24dr02@psgpolytech.ac.in');
  const [password, setPassword] = useState('omnisight2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleQuickLogin = (userEmail: string) => {
    login(userEmail);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 bg-grid-industrial relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl relative z-10">
        {/* Left: Branding & Academic Showcase */}
        <div className="p-8 lg:p-10 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-cyan-950/80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-7 h-7 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-wider text-slate-100 font-display">
                  OMNI<span className="text-cyan-400">SIGHT</span>
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Industrial AI & AR Twin
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/40 inline-block mb-2">
                PSG POLYTECHNIC COLLEGE (C24653)
              </span>
              <h2 className="text-lg font-bold text-slate-100 leading-snug">
                AI-Driven Predictive Maintenance and AR Digital Twin System
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Democratizing Industry 4.0 diagnostics for MSME factories with ESP32 edge sensors, MQTT streams, and 8-feature machine learning.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sub-20ms Tri-Axial Vibration Telemetry</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Random Forest 8-Feature ML Diagnostics</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Vuforia Point-and-See Spatial AR Overlay</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-4 border-t border-slate-800">
            Guide: Ms. K. Thamaraiselvi • Dept of Computer Networking
          </div>
        </div>

        {/* Right: Sign In Form & 1-Click Role Logins */}
        <div className="p-8 lg:p-10 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-100">Sign In to Control Room</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a demo persona or enter credentials</p>

            {/* Quick Demo Persona Switcher */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                Instant 1-Click Role Portals
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userAccounts.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u.email)}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[11px] text-slate-200 group-hover:text-cyan-300 truncate">
                        {u.name.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">{u.role.split(' ')[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email / Student ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
              >
                <span>Authorize & Enter Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-[11px] text-slate-500 font-mono">
            OmniSight v2.4 • PSG Polytechnic College
          </div>
        </div>
      </div>
    </div>
  );
};
