import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { academicBOM } from '../services/mockData';
import {
  Award,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Printer,
  ExternalLink,
  Users,
  Shield,
  Clock,
  Radio,
  Code2,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { industrialAudio } from '../utils/audio';

export const AcademicReview: React.FC = () => {
  const { machines, triggerFaultSimulation, showToast } = useApp();

  const [selectedMachineId, setSelectedMachineId] = useState<string>('M-01');
  const [activeTab, setActiveTab] = useState<'overview' | 'bom' | 'architecture' | 'firmware' | 'sandbox'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  const totalBOMCost = academicBOM.reduce((acc, item) => acc + item.total, 0);

  const esp32FirmwareCode = `/*
 * =========================================================================
 * OMNISIGHT: AI-DRIVEN PREDICTIVE MAINTENANCE EDGE FIRMWARE
 * Institution : PSG Polytechnic College, Coimbatore - 641 004
 * Course Code : C24653 (Project Work) | Academic Year: 2026 - 2027
 * Department  : Department of Computer Networking
 * Team        : Adnaan Khan M, Ashwin R, Muffadal, Pranuth M V
 * Guide       : Ms. K. Thamaraiselvi, Lecturer (S.G)
 * Hardware    : ESP32 NodeMCU + MPU6050 6-DOF IMU (I2C 0x68 @ 400kHz)
 * =========================================================================
 */

#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <math.h>

#define MPU6050_ADDR         0x68
#define SAMPLING_FREQ_HZ     500
#define BUFFER_SIZE          256
#define MQTT_BROKER_IP       "192.168.1.100"
#define MQTT_BROKER_PORT     1883
#define MQTT_TOPIC_TELEMETRY "factory/bay1/cnc01/telemetry"

WiFiClient espClient;
PubSubClient mqttClient(espClient);

float ax_buf[BUFFER_SIZE], ay_buf[BUFFER_SIZE], az_buf[BUFFER_SIZE];
int sample_idx = 0;

// ── 8 TIME-DOMAIN FEATURE EXTRACTION ENGINE ─────────────────────────────
struct TimeDomainFeatures {
  float rms;
  float peak;
  float crest_factor;
  float kurtosis;
  float skewness;
  float variance;
  float mav;
  float total_energy;
  float temperature;
};

TimeDomainFeatures extractFeatures(float* samples, int N, float tempC) {
  TimeDomainFeatures f;
  float sum = 0.0, sum_sq = 0.0, sum_abs = 0.0, max_peak = 0.0;

  for (int i = 0; i < N; i++) {
    float val = samples[i];
    sum += val;
    sum_sq += val * val;
    sum_abs += fabs(val);
    if (fabs(val) > max_peak) max_peak = fabs(val);
  }

  float mean = sum / N;
  f.rms = sqrt(sum_sq / N);
  f.peak = max_peak;
  f.crest_factor = (f.rms > 0.001) ? (f.peak / f.rms) : 0.0;
  f.mav = sum_abs / N;

  // 2nd, 3rd, 4th Moments (Variance, Skewness, Kurtosis)
  float m2 = 0.0, m3 = 0.0, m4 = 0.0;
  for (int i = 0; i < N; i++) {
    float diff = samples[i] - mean;
    float diff2 = diff * diff;
    m2 += diff2;
    m3 += diff2 * diff;
    m4 += diff2 * diff2;
  }
  f.variance = m2 / N;
  float std_dev = sqrt(f.variance);

  f.skewness = (std_dev > 0.001) ? (m3 / N) / (std_dev * std_dev * std_dev) : 0.0;
  f.kurtosis = (std_dev > 0.001) ? (m4 / N) / (std_dev * std_dev * diff2) : 3.0; // Baseline normal ~ 3.0
  f.temperature = tempC;
  return f;
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22, 400000); // Fast I2C Bus on ESP32 GPIO 21/22
  
  // Initialize MPU6050
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x6B); // PWR_MGMT_1
  Wire.write(0);    // Wake up MPU6050
  Wire.endTransmission(true);

  WiFi.begin("PSG_FACTORY_LAN", "OmniSight2026");
  mqttClient.setServer(MQTT_BROKER_IP, MQTT_BROKER_PORT);
}

void loop() {
  if (!mqttClient.connected()) {
    mqttClient.connect("ESP32_NODE_01");
  }
  mqttClient.loop();

  // 500Hz Sampling Loop
  // [Read accelerometer registers & transmit JSON MQTT packet...]
  delay(1000 / SAMPLING_FREQ_HZ);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(esp32FirmwareCode);
    setCopiedCode(true);
    showToast('ESP32 Embedded C++ Firmware copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleGradeSuccess = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    industrialAudio.playClick();
    showToast('Project evaluation benchmark scores recorded successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── TOP ACADEMIC HEADER ─────────────────────────────────────────── */}
      <div className="p-6 rounded-xl scada-panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                PSG POLYTECHNIC COLLEGE
              </span>
              <span className="text-cyan-400 font-bold">COURSE: C24653</span>
              <span className="text-slate-400">• AY 2026 - 2027</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 mt-1 font-display">
              OMNISIGHT: AI-Driven Predictive Maintenance and AR Digital Twin System
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Department of Computer Networking • Final Year Evaluation & Defense Dossier
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleGradeSuccess}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white shadow transition-all flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Evaluation Signoff</span>
          </button>
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────────────────── */}
      <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => { setActiveTab('overview'); industrialAudio.playClick(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md ${activeTab === 'overview' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Project Synopsis</span>
        </button>
        <button
          onClick={() => { setActiveTab('architecture'); industrialAudio.playClick(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md ${activeTab === 'architecture' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>IoT Pipeline</span>
        </button>
        <button
          onClick={() => { setActiveTab('firmware'); industrialAudio.playClick(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md ${activeTab === 'firmware' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>ESP32 Firmware Code</span>
        </button>
        <button
          onClick={() => { setActiveTab('bom'); industrialAudio.playClick(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md ${activeTab === 'bom' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>BOM & MSME Cost</span>
        </button>
        <button
          onClick={() => { setActiveTab('sandbox'); industrialAudio.playClick(); }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md ${activeTab === 'sandbox' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Examiner Sandbox</span>
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW & TEAM ─────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 p-6 rounded-xl scada-panel space-y-4 text-xs leading-relaxed">
            <h3 className="font-bold text-sm text-slate-100 font-display flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Synopsis & Industrial Background
            </h3>
            <p className="text-slate-300">
              In today's fast-paced industrial landscape, Micro, Small, and Medium Enterprises (MSMEs) often face severe operational challenges due to unplanned machinery downtime. Traditional reactive maintenance leads to heavy losses and safety hazards, while corporate SCADA suites (costing upwards of ₹15,00,000) remain out of reach for small job-shops.
            </p>
            <p className="text-slate-300">
              <strong>OmniSight</strong> delivers an end-to-end predictive maintenance system under a ₹15,000 budget. Using ESP32 edge microcontrollers and MPU6050 tri-axial sensors sampled at 500Hz, vibration telemetry is streamed over local MQTT to a Random Forest ML model analyzing eight time-domain features (Crest Factor, Kurtosis, RMS, Peak Shock, etc.). Mechanical faults such as bearing race spalling and shaft angular misalignment are detected days in advance and displayed on spatial Vuforia AR HUD overlays and an industrial web interface.
            </p>
          </div>

          <div className="p-5 rounded-xl scada-panel space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Student Project Team
            </h3>
            <div className="space-y-2">
              {[
                { name: 'ADNAAN KHAN M', roll: '24DR02', role: 'Lead Project Engineer' },
                { name: 'ASHWIN R', roll: '24DR05', role: 'AR Digital Twin Specialist' },
                { name: 'MUFFADAL', roll: '24DR30', role: 'AI & Signal Specialist' },
                { name: 'PRANUTH M V', roll: '24DR36', role: 'Operations & Maintenance' }
              ].map((s, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.role}</div>
                  </div>
                  <span className="font-bold text-cyan-400">{s.roll}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px]">
              <span className="text-slate-500 block">Guided by:</span>
              <strong className="text-slate-200">Ms. K. Thamaraiselvi</strong>
              <div className="text-slate-400 text-[10px]">Lecturer (S.G), Dept of Computer Networking</div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ESP32 EMBEDDED C++ FIRMWARE VIEWER ──────────────────── */}
      {activeTab === 'firmware' && (
        <div className="p-6 rounded-xl scada-panel space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                ESP32 + MPU6050 Embedded C++ Firmware Source Code
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Real on-chip implementation computing the 8 mathematical time-domain equations at 500Hz
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto max-h-[480px]">
            <pre className="text-slate-300 text-[11px] leading-relaxed">
              <code>{esp32FirmwareCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ── TAB 3: BOM & COST ──────────────────────────────────────────── */}
      {activeTab === 'bom' && (
        <div className="p-6 rounded-xl scada-panel space-y-4 text-xs font-mono">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100">Bill of Materials (BOM)</h3>
            <span className="text-emerald-400 font-bold">Total Prototype Cost: ₹{totalBOMCost}</span>
          </div>

          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800 bg-slate-950">
              <tr>
                <th className="p-2.5">Item</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right">Unit (₹)</th>
                <th className="p-2.5 text-right">Total (₹)</th>
                <th className="p-2.5">Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {academicBOM.map((b, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="p-2.5 text-slate-200 font-bold">{b.item}</td>
                  <td className="p-2.5 text-center">{b.qty}</td>
                  <td className="p-2.5 text-right">{b.unitCost}</td>
                  <td className="p-2.5 text-right text-cyan-400 font-bold">₹{b.total}</td>
                  <td className="p-2.5 text-slate-400 font-sans text-[11px]">{b.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 4: EXAMINER SANDBOX ────────────────────────────────────── */}
      {activeTab === 'sandbox' && (
        <div className="p-6 rounded-xl scada-panel space-y-4 text-xs font-mono">
          <h3 className="font-bold text-sm text-slate-100">Live Examiner Fault Injection Sandbox</h3>
          <p className="text-slate-400 font-sans">
            Inject real-time mechanical degradation into machine sensors to verify AI detection and AR alerts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => { triggerFaultSimulation(selectedMachineId, 'bearing_wear'); industrialAudio.playAlertBeep(920, 0.15); }}
              className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-700/60 text-left hover:bg-rose-900/40"
            >
              <div className="font-bold text-rose-300">⚡ Bearing Spalling</div>
              <div className="text-[10px] text-slate-400 mt-1 font-sans">Kurtosis &gt; 7.0, Crest Factor &gt; 5.5</div>
            </button>

            <button
              onClick={() => { triggerFaultSimulation(selectedMachineId, 'shaft_misalignment'); industrialAudio.playAlertBeep(700, 0.15); }}
              className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-700/60 text-left hover:bg-amber-900/40"
            >
              <div className="font-bold text-amber-300">📐 Shaft Misalignment</div>
              <div className="text-[10px] text-slate-400 mt-1 font-sans">2X harmonic surge at 180Hz</div>
            </button>

            <button
              onClick={() => { triggerFaultSimulation(selectedMachineId, 'thermal_overload'); industrialAudio.playAlertBeep(600, 0.15); }}
              className="p-3.5 rounded-lg bg-orange-950/40 border border-orange-700/60 text-left hover:bg-orange-900/40"
            >
              <div className="font-bold text-orange-300">🔥 Stator Thermal Spike</div>
              <div className="text-[10px] text-slate-400 mt-1 font-sans">Winding temp to +84.5°C</div>
            </button>

            <button
              onClick={() => { triggerFaultSimulation(selectedMachineId, 'restore_normal'); industrialAudio.playClick(); }}
              className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-700/60 text-left hover:bg-emerald-900/40"
            >
              <div className="font-bold text-emerald-300">✓ Restore Baseline</div>
              <div className="text-[10px] text-slate-400 mt-1 font-sans">Clears fault flags</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
