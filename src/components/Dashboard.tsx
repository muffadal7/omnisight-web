import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Radio,
  ArrowUpRight,
  Shield,
  Clock,
  Wrench,
  ChevronRight,
  Gauge,
  Sliders,
  Award,
  Play,
  Pause,
  ExternalLink,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { industrialAudio } from '../utils/audio';

export const Dashboard: React.FC = () => {
  const {
    machines,
    alerts,
    maintenance,
    userProfile,
    setActiveTab,
    navigateToMachine,
    mqttPackets,
    telemetryLive,
    setTelemetryLive,
    triggerFaultSimulation,
    showToast
  } = useApp();

  const [oscilloscopeChannel, setOscilloscopeChannel] = useState<'xyz' | 'rms' | 'crest'>('xyz');
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0]?.id || 'M-01');
  const [timebase, setTimebase] = useState<'10s' | '1m' | '5m'>('10s');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];
  const healthyCount = machines.filter((m) => m.status === 'healthy').length;
  const warningCount = machines.filter((m) => m.status === 'warning').length;
  const criticalCount = machines.filter((m) => m.status === 'critical').length;
  const plantHealthAvg = Math.round(
    machines.reduce((acc, m) => acc + m.healthScore, 0) / machines.length
  );

  // ISO 10816-3 Vibration Severity Classification
  const getISOZone = (totalVib: number) => {
    if (totalVib < 2.3) return { zone: 'Zone A (Good)', color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' };
    if (totalVib < 4.5) return { zone: 'Zone B (Acceptable)', color: 'text-cyan-400', bg: 'bg-cyan-950 border-cyan-800' };
    if (totalVib < 7.1) return { zone: 'Zone C (Warning Alert)', color: 'text-amber-400', bg: 'bg-amber-950 border-amber-800' };
    return { zone: 'Zone D (Unacceptable Damage)', color: 'text-rose-400', bg: 'bg-rose-950 border-rose-800' };
  };

  const isoStatus = getISOZone(activeMachine.telemetry.totalVibration);

  // Live Oscilloscope Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let offset = 0;

    const renderWaveform = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Scada Reticle Crosshairs
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();

      const centerY = height / 2;
      const freq = (activeMachine.rpm / 60) * 0.08;

      if (oscilloscopeChannel === 'xyz') {
        // Channel X (Cyan)
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin((x + offset) * freq * 0.05) * (activeMachine.telemetry.vibrationXYZ.x * 12);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Channel Y (Indigo)
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.cos((x + offset * 1.1) * freq * 0.06) * (activeMachine.telemetry.vibrationXYZ.y * 12);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Channel Z (Emerald)
        ctx.strokeStyle = '#00e676';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin((x + offset * 0.9) * freq * 0.04 + 1.2) * (activeMachine.telemetry.vibrationXYZ.z * 12);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#ffab00';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin((x + offset) * 0.04) * (activeMachine.telemetry.crestFactor * 7) + Math.cos((x + offset) * 0.1) * (activeMachine.telemetry.peakShock * 3.5);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (telemetryLive) {
        offset += timebase === '10s' ? 3.0 : timebase === '1m' ? 1.5 : 0.8;
      }

      animationFrame = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();
    return () => cancelAnimationFrame(animationFrame);
  }, [selectedMachineId, activeMachine, oscilloscopeChannel, telemetryLive, timebase]);

  const handleExportCSV = () => {
    industrialAudio.playClick();
    const csvContent = "data:text/csv;charset=utf-8," +
      "Timestamp,NodeId,RMS,PeakShock,CrestFactor,Kurtosis,Temp,TotalVib\n" +
      mqttPackets.map(p => {
        const d = JSON.parse(p.payload);
        return `${p.timestamp},${p.nodeId},${d.rms},${d.peak},${d.crest},${d.kurt},${d.temp},${d.total}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OmniSight_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Real-time telemetry exported to CSV file!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── ACADEMIC PROJECT HIGHLIGHT BAR ─────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-xl scada-panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                PSG POLYTECHNIC COLLEGE (C24653)
              </span>
              <span className="text-cyan-400 font-bold">AY 2026 - 2027</span>
              <span className="text-slate-400">• Dept of Computer Networking</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 mt-1 font-display">
              OMNISIGHT: AI-Driven Predictive Maintenance and AR Digital Twin System
            </h2>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              Guide: <span className="text-slate-200">Ms. K. Thamaraiselvi</span> • Team: <span className="text-slate-200">Adnaan Khan M, Ashwin R, Muffadal, Pranuth M V</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => { setActiveTab('academic_review'); industrialAudio.playClick(); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-bold text-white shadow transition-all"
          >
            <span>Defense Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── SCADA PLANT METRICS TILES ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-xl scada-panel font-mono">
          <div className="flex justify-between text-slate-400 text-xs mb-1">
            <span>PLANT HEALTH</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">{plantHealthAvg}%</div>
          <div className="w-full h-1.5 rounded bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${plantHealthAvg}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl scada-panel font-mono">
          <div className="flex justify-between text-slate-400 text-xs mb-1">
            <span>FLEET STATUS</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <span className="text-emerald-400 font-bold">{healthyCount} OK</span>
            <span className="text-amber-400 font-bold">{warningCount} WARN</span>
            <span className="text-rose-400 font-bold">{criticalCount} CRIT</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">6 ESP32 nodes active</div>
        </div>

        <div className="p-3.5 rounded-xl scada-panel font-mono">
          <div className="flex justify-between text-slate-400 text-xs mb-1">
            <span>OEE EFFICIENCY</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">88.6%</div>
          <div className="text-[10px] text-slate-500 mt-2">Avail: 94.2% • Qual: 99.1%</div>
        </div>

        <div onClick={() => { setActiveTab('alerts'); industrialAudio.playClick(); }} className="p-3.5 rounded-xl scada-panel font-mono cursor-pointer hover:border-rose-500/50">
          <div className="flex justify-between text-slate-400 text-xs mb-1">
            <span>UNRESOLVED ALARMS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">
            {alerts.filter((a) => a.status === 'unread').length}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-2">View Alarm Center &rarr;</div>
        </div>

        <div className="p-3.5 rounded-xl scada-panel font-mono col-span-2 lg:col-span-1">
          <div className="flex justify-between text-slate-400 text-xs mb-1">
            <span>EST. MTBF</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">485 hrs</div>
          <div className="text-[10px] text-emerald-400 mt-2">Cost Saved: ₹42,500</div>
        </div>
      </div>

      {/* ── REAL-TIME OSCILLOSCOPE & ISO 10816 SEVERITY ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-5 rounded-xl scada-panel flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-200">Tri-Axial High-Speed Waveform Oscilloscope</h3>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">500Hz Stream ({activeMachine.sensor.nodeId})</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedMachineId}
                onChange={(e) => { setSelectedMachineId(e.target.value); industrialAudio.playClick(); }}
                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>{m.id} ({m.name})</option>
                ))}
              </select>

              <div className="flex items-center p-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                <button
                  onClick={() => { setOscilloscopeChannel('xyz'); industrialAudio.playClick(); }}
                  className={`px-2 py-0.5 rounded ${oscilloscopeChannel === 'xyz' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  XYZ
                </button>
                <button
                  onClick={() => { setOscilloscopeChannel('crest'); industrialAudio.playClick(); }}
                  className={`px-2 py-0.5 rounded ${oscilloscopeChannel === 'crest' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Cf
                </button>
              </div>

              <div className="flex items-center p-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                {(['10s', '1m', '5m'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTimebase(t); industrialAudio.playClick(); }}
                    className={`px-1.5 py-0.5 rounded ${timebase === t ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Waveform */}
          <div className="my-3 bg-slate-950 rounded-lg border border-slate-800 p-2 relative overflow-hidden">
            <canvas ref={canvasRef} width={640} height={180} className="w-full h-44 block" />
            <div className="absolute top-3 left-4 flex items-center gap-3 text-[10px] font-mono bg-slate-950/90 px-2.5 py-1 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold">● Accel-X: {activeMachine.telemetry.vibrationXYZ.x} mm/s</span>
              <span className="text-indigo-400 font-bold">● Accel-Y: {activeMachine.telemetry.vibrationXYZ.y} mm/s</span>
              <span className="text-emerald-400 font-bold">● Accel-Z: {activeMachine.telemetry.vibrationXYZ.z} mm/s</span>
            </div>
          </div>

          {/* ISO 10816-3 Status Bar Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">ISO 10816-3 Severity:</span>
              <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${isoStatus.bg} ${isoStatus.color}`}>
                {isoStatus.zone} ({activeMachine.telemetry.totalVibration} mm/s RMS)
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Kurtosis: <strong className="text-slate-200">{activeMachine.telemetry.kurtosis}</strong></span>
              <span>Crest Factor: <strong className="text-slate-200">{activeMachine.telemetry.crestFactor}</strong></span>
              <span>Bearing Temp: <strong className="text-slate-200">{activeMachine.telemetry.temperature}°C</strong></span>
            </div>
          </div>
        </div>

        {/* AI Prognosis & RUL */}
        <div className="p-5 rounded-xl scada-panel flex flex-col justify-between font-mono text-xs space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-slate-200">Random Forest Classifier</h3>
              </div>
              <span className="text-indigo-300 font-bold">{activeMachine.aiPrediction.confidence}% CONF</span>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Diagnosed Mechanical Condition</span>
              <span className="font-bold text-cyan-300 block">{activeMachine.aiPrediction.condition}</span>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">AI Prescribed Action</span>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{activeMachine.aiPrediction.recommendedAction}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">TIME TO FAILURE</span>
                <span className="font-bold text-amber-400">{activeMachine.aiPrediction.timeToFailureEst}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">EST. RUL HOURS</span>
                <span className="font-bold text-slate-200">{activeMachine.aiPrediction.rulHours} hrs</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              navigateToMachine(activeMachine.id);
              setActiveTab('digital_twin');
              industrialAudio.playClick();
            }}
            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <Layers className="w-4 h-4" />
            <span>Launch 3D Digital Twin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
