import React, { useEffect, useState } from 'react';
import { Cpu, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onFinish(), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col justify-between p-6 overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Animated Grid & Pulse Ring */}
      <div className="absolute inset-0 bg-grid-animated opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Top Header info */}
      <div className="relative z-10 flex justify-between items-center text-xs font-mono text-cyan-400/70 uppercase tracking-widest pt-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          IoT Edge Node v2.4
        </span>
        <span>PSG POLYTECHNIC</span>
      </div>

      {/* Main Center Branding */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4">
        {/* Animated Icon Ring */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 p-0.5 shadow-2xl shadow-cyan-500/20 animate-pulse-glow">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative">
              <Cpu className="w-12 h-12 text-cyan-400 animate-pulse" />
              <Activity className="w-6 h-6 text-emerald-400 absolute -bottom-1 -right-1" />
            </div>
          </div>
          {/* Circular Radar Scan line effect */}
          <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-spin duration-10000" />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          OMNI<span className="text-cyan-400">SIGHT</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xs sm:max-w-sm mb-6 leading-relaxed">
          AI-Driven Predictive Maintenance & AR Digital Twin
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> ESP32 + MPU6050
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" /> Random Forest ML
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Vuforia AR
          </span>
        </div>
      </div>

      {/* Bottom Loading Progress */}
      <div className="relative z-10 w-full max-w-xs mx-auto pb-6">
        <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
          <span>INITIALIZING SENSOR TELEMETRY</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onFinish}
          className="mt-6 w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
        >
          <span>Enter Application</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};
