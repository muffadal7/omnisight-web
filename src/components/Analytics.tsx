import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Activity,
  Waves,
  Cpu,
  BarChart3,
  TrendingDown,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Target,
  GitBranch,
  ShieldCheck
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { machines, selectedMachineId, setSelectedMachineId } = useApp();

  const [activeMachineId, setActiveMachineId] = useState<string>(selectedMachineId || machines[0]?.id || 'M-01');
  const [activeAnalysisView, setActiveAnalysisView] = useState<'8_features' | 'fft_spectrum' | 'random_forest' | 'rul_curve'>('8_features');

  const machine = machines.find((m) => m.id === activeMachineId) || machines[0];

  const features = [
    {
      id: 'rms',
      name: 'Root Mean Square (RMS)',
      value: machine.telemetry.rms,
      unit: 'mm/s',
      threshold: 'Normal < 2.5 mm/s',
      formula: 'RMS = √( 1/N ∑ x_i² )',
      desc: 'Reflects total continuous vibrational kinetic energy. Primary ISO 10816 baseline standard.',
      status: machine.telemetry.rms > 4.5 ? 'critical' : machine.telemetry.rms > 3.0 ? 'warning' : 'healthy'
    },
    {
      id: 'peak',
      name: 'Peak Shock Acceleration',
      value: machine.telemetry.peakShock,
      unit: 'g',
      threshold: 'Normal < 3.5 g',
      formula: 'Peak = max |x_i|',
      desc: 'Captures maximum instantaneous mechanical shock impact from spalled surfaces.',
      status: machine.telemetry.peakShock > 6.0 ? 'critical' : machine.telemetry.peakShock > 4.0 ? 'warning' : 'healthy'
    },
    {
      id: 'crest',
      name: 'Crest Factor (Cf)',
      value: machine.telemetry.crestFactor,
      unit: 'ratio',
      threshold: 'Normal < 3.0',
      formula: 'Cf = Peak Shock / RMS',
      desc: 'Ratio of peak to continuous RMS energy. Spikes dramatically in early bearing spalling before overall RMS rises.',
      status: machine.telemetry.crestFactor > 5.0 ? 'critical' : machine.telemetry.crestFactor > 3.5 ? 'warning' : 'healthy'
    },
    {
      id: 'kurtosis',
      name: 'Kurtosis (Bearing Impulsiveness)',
      value: machine.telemetry.kurtosis,
      unit: 'dimless',
      threshold: 'Normal < 3.2',
      formula: 'Kurt = (1/N ∑(x_i - μ)⁴) / σ⁴',
      desc: '4th statistical moment measuring the peakedness and impulsiveness of roller impact events.',
      status: machine.telemetry.kurtosis > 6.0 ? 'critical' : machine.telemetry.kurtosis > 4.0 ? 'warning' : 'healthy'
    },
    {
      id: 'skewness',
      name: 'Skewness (Waveform Asymmetry)',
      value: machine.telemetry.skewness,
      unit: 'dimless',
      threshold: 'Normal < 0.4',
      formula: 'Skew = (1/N ∑(x_i - μ)³) / σ³',
      desc: '3rd moment describing waveform directional bias, common in gear tooth pitting and rubs.',
      status: machine.telemetry.skewness > 0.9 ? 'critical' : machine.telemetry.skewness > 0.5 ? 'warning' : 'healthy'
    },
    {
      id: 'variance',
      name: 'Signal Variance (σ²)',
      value: machine.telemetry.variance,
      unit: 'mm²/s²',
      threshold: 'Normal < 2.0',
      formula: 'σ² = 1/N ∑(x_i - μ)²',
      desc: 'Statistical dispersion of dynamic acceleration fluctuations around the mean.',
      status: machine.telemetry.variance > 4.5 ? 'critical' : machine.telemetry.variance > 2.5 ? 'warning' : 'healthy'
    },
    {
      id: 'mav',
      name: 'Mean Absolute Value (MAV)',
      value: machine.telemetry.mav,
      unit: 'mm/s',
      threshold: 'Normal < 2.0',
      formula: 'MAV = 1/N ∑ |x_i|',
      desc: 'Linear rectified average amplitude, providing robust sensitivity without outlier exaggeration.',
      status: machine.telemetry.mav > 3.5 ? 'critical' : machine.telemetry.mav > 2.2 ? 'warning' : 'healthy'
    },
    {
      id: 'triaxial',
      name: 'Tri-Axial Energy Vector (|XYZ|)',
      value: machine.telemetry.totalVibration,
      unit: 'mm/s',
      threshold: 'Normal < 2.5',
      formula: '|XYZ| = √( X² + Y² + Z² )',
      desc: 'Euclidean norm across X (radial), Y (vertical), and Z (axial) accelerations from MPU6050.',
      status: machine.telemetry.totalVibration > 5.0 ? 'critical' : machine.telemetry.totalVibration > 3.2 ? 'warning' : 'healthy'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── HEADER & MACHINE SELECTOR ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
              AI Predictive Diagnostics & 8-Feature Signal Engine
            </h2>
            <p className="text-xs text-slate-400">
              Supervised Random Forest Classifier trained on MPU6050 500Hz time-domain & FFT spectral features
            </p>
          </div>
        </div>

        {/* Machine Picker & View Modes */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeMachineId}
            onChange={(e) => setActiveMachineId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} - {m.name} ({m.status.toUpperCase()})
              </option>
            ))}
          </select>

          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setActiveAnalysisView('8_features')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeAnalysisView === '8_features' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              8 Time-Domain Features
            </button>
            <button
              onClick={() => setActiveAnalysisView('fft_spectrum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeAnalysisView === 'fft_spectrum' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FFT Spectrum
            </button>
            <button
              onClick={() => setActiveAnalysisView('random_forest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeAnalysisView === 'random_forest' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Random Forest ML
            </button>
            <button
              onClick={() => setActiveAnalysisView('rul_curve')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeAnalysisView === 'rul_curve' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RUL Trajectory
            </button>
          </div>
        </div>
      </div>

      {/* ── VIEW 1: 8 TIME-DOMAIN FEATURES MATRIX ────────────────────── */}
      {activeAnalysisView === '8_features' && (
        <div className="space-y-6">
          {/* Machine AI Diagnosis Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">ASSET // {machine.id}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                    machine.status === 'healthy'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : machine.status === 'warning'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                  }`}
                >
                  {machine.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-1">{machine.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                AI Condition: <span className="text-slate-200 font-semibold">{machine.aiPrediction.condition}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">HEALTH SCORE</span>
                <span className="font-bold text-slate-100 text-base">{machine.healthScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TIME TO FAILURE</span>
                <span className="font-bold text-amber-400 text-base">{machine.aiPrediction.timeToFailureEst}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ML CONFIDENCE</span>
                <span className="font-bold text-cyan-400 text-base">{machine.aiPrediction.confidence}%</span>
              </div>
            </div>
          </div>

          {/* 8 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {features.map((feat) => (
              <div
                key={feat.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-300 truncate">{feat.name}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        feat.status === 'healthy'
                          ? 'bg-emerald-400'
                          : feat.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 my-2">
                    {feat.formula}
                  </div>

                  <div className="flex items-baseline gap-1.5 my-2">
                    <span className="text-2xl font-black text-slate-100 font-mono">{feat.value}</span>
                    <span className="text-xs font-mono text-slate-400">{feat.unit}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Limit:</span>
                  <span className="font-bold text-slate-300">{feat.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW 2: FFT FREQUENCY SPECTRUM WATERFALL ──────────────────── */}
      {activeAnalysisView === 'fft_spectrum' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                FFT Frequency Spectrum Analysis (0 - 500 Hz)
              </h3>
              <p className="text-xs text-slate-400">
                Fast Fourier Transform decomposition showing harmonic fault spectral bins
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Dominant Peak: <span className="text-cyan-300 font-bold">{machine.fftSpectrum?.dominantHarmonic || 120} Hz</span>
            </div>
          </div>

          {/* SVG FFT Spectrum Graph */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative">
            <div className="h-64 flex items-end justify-between gap-2 pt-6 px-4">
              {machine.fftSpectrum?.frequencies.map((freq, idx) => {
                const amp = machine.fftSpectrum?.amplitudes[idx] || 0.1;
                const maxAmp = 5.0;
                const heightPercent = Math.min(100, (amp / maxAmp) * 100);
                const isDominant = freq === machine.fftSpectrum?.dominantHarmonic;

                return (
                  <div key={freq} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {amp.toFixed(2)}g
                    </div>
                    <div className="w-full bg-slate-800 rounded-t-md relative flex flex-col justify-end overflow-hidden" style={{ height: `${heightPercent}%` }}>
                      <div
                        className={`w-full h-full rounded-t-md transition-all ${
                          isDominant
                            ? 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-indigo-400 shadow-lg shadow-cyan-500/30'
                            : amp > 2.0
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                            : 'bg-gradient-to-t from-slate-700 to-slate-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{freq}Hz</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Identified Harmonic Peaks Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Identified Mechanical Fault Peaks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {machine.fftSpectrum?.peaks.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-cyan-300">{p.label}</span>
                    <span className="text-slate-400 block text-[11px]">Frequency: {p.freqHz} Hz</span>
                  </div>
                  <span className="font-bold text-slate-200 text-sm">{p.amplitude.toFixed(2)} g</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 3: RANDOM FOREST ML EXPLAINER ────────────────────────── */}
      {activeAnalysisView === 'random_forest' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Feature Importance Bar Weights */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Random Forest Feature Importance Weights
              </h3>
              <p className="text-xs text-slate-400">Gini impurity reduction across 120 trained decision trees</p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Kurtosis (Impulsive Spall Impacts)</span>
                  <span className="text-indigo-400 font-bold">34%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Crest Factor (Cf Peak/RMS)</span>
                  <span className="text-cyan-400 font-bold">28%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">RMS Energy (Continuous Vibration)</span>
                  <span className="text-emerald-400 font-bold">18%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Peak Shock Acceleration (max g)</span>
                  <span className="text-amber-400 font-bold">12%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Thermal Drift (°C)</span>
                  <span className="text-rose-400 font-bold">8%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Confusion Matrix & Model Evaluation */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Model Classification Accuracy (96.8%)
              </h3>
              <p className="text-xs text-slate-400">Validated against industrial bearing wear & misalignment dataset</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TRAINING ACCURACY</span>
                <span className="text-lg font-bold text-emerald-400">98.2%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TEST F1-SCORE</span>
                <span className="text-lg font-bold text-cyan-400">0.968</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">INFERENCE LATENCY</span>
                <span className="text-lg font-bold text-indigo-300">4.2 ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ESTIMATOR TREES</span>
                <span className="text-lg font-bold text-slate-200">120 Trees</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 4: RUL DEGRADATION TRAJECTORY ────────────────────────── */}
      {activeAnalysisView === 'rul_curve' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-400" />
              Remaining Useful Life (RUL) Health Degradation Trajectory
            </h3>
            <p className="text-xs text-slate-400">
              Proactive forecasting curve predicting asset failure threshold intersection
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Current Health: <strong className="text-slate-100">{machine.healthScore}%</strong></span>
              <span className="text-amber-400 font-bold">Predicted RUL: {machine.aiPrediction.timeToFailureEst} ({machine.aiPrediction.rulHours} hrs)</span>
            </div>

            <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all ${
                  machine.healthScore > 80
                    ? 'bg-emerald-500'
                    : machine.healthScore > 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${machine.healthScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
              <span>0h (Now)</span>
              <span className="text-center">Warning Line: 65%</span>
              <span className="text-right">Failure Line: 40%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
