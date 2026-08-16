export type MachineStatus = 'healthy' | 'warning' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high';
export type SeverityLevel = 'critical' | 'warning' | 'info';
export type MaintenanceStatus = 'scheduled' | 'pending' | 'in_progress' | 'completed';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export type RoleCategory =
  | 'lead_engineer'
  | 'evaluator'
  | 'vibration_specialist'
  | 'ar_engineer'
  | 'plant_manager'
  | 'technician';

export type ScreenTab =
  | 'home'
  | 'machines'
  | 'machine_details'
  | 'analytics'
  | 'digital_twin'
  | 'factory_map'
  | 'maintenance'
  | 'alerts'
  | 'academic_review'
  | 'profile'
  | 'settings';

export interface TriAxialVibration {
  x: number; // mm/s
  y: number; // mm/s
  z: number; // mm/s
}

export interface TimeDomainFeatures {
  crestFactor: number;    // Peak / RMS (ratio)
  peakShock: number;      // Max peak acceleration (g or mm/s)
  rms: number;            // Root Mean Square energy (mm/s)
  kurtosis: number;       // Measure of peak impulsiveness / bearing wear
  skewness: number;       // Waveform asymmetry
  variance: number;       // Signal power spread
  mav: number;            // Mean Absolute Value
  temperature: number;    // °C from MPU6050
  vibrationXYZ: TriAxialVibration;
  totalVibration: number; // sqrt(X^2 + Y^2 + Z^2)
}

export interface FFTPeak {
  freqHz: number;
  amplitude: number;
  label?: string;
}

export interface FFTSpectrumData {
  frequencies: number[];
  amplitudes: number[];
  dominantHarmonic: number;
  peaks: FFTPeak[];
}

export interface AIPrediction {
  condition: string;
  faultClass: 'normal' | 'bearing_wear' | 'shaft_misalignment' | 'rotor_imbalance' | 'thermal_overload' | 'gear_pitting';
  risk: RiskLevel;
  confidence: number;
  recommendedAction: string;
  detectedAt: string;
  timeToFailureEst: string;
  rulHours: number;
  randomForestWeights?: {
    crestFactor: number;
    kurtosis: number;
    peakShock: number;
    rms: number;
    temperature: number;
  };
}

export interface SensorStatus {
  nodeId: string;
  sensorModel: string;
  status: 'online' | 'degraded' | 'offline';
  battery: number;
  signalDbm: number;
  lastPing: string;
  samplingRateHz: number;
  ipAddress: string;
  mqttTopic: string;
}

export interface ARNode {
  id: string;
  name: string;
  status: MachineStatus;
  temp: number;
  vibration: number;
  faultTag?: string;
  position2D: { x: number; y: number };
  position3D?: [number, number, number];
  description?: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  category: 'Manufacturing' | 'Conveyors' | 'HVAC' | 'Packaging';
  location: string;
  bayId: 'bay-1' | 'bay-2' | 'bay-3' | 'bay-4';
  healthScore: number;
  status: MachineStatus;
  rpm: number;
  loadPercent: number;
  telemetry: TimeDomainFeatures;
  fftSpectrum?: FFTSpectrumData;
  sensor: SensorStatus;
  aiPrediction: AIPrediction;
  history1H: number[];
  history24H: number[];
  history7D: number[];
  arComponentNodes: ARNode[];
  coordinates: { x: number; y: number }; // Factory floor map position (0-100%)
  modelType: 'lathe' | 'cnc' | 'milling' | 'conveyor' | 'compressor' | 'hvac';
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  timestamp: string;
  status: 'unread' | 'read' | 'resolved';
  recommendedAction: string;
  featureTriggered: string;
}

export interface MaintenanceOrder {
  id: string;
  machineId: string;
  machineName: string;
  issue: string;
  priority: PriorityLevel;
  dueDate: string;
  status: MaintenanceStatus;
  assignedTo: string;
  notes: string;
  createdDate: string;
  estimatedHours: number;
  spareParts: string[];
}

export interface MQTTPacket {
  id: string;
  timestamp: string;
  topic: string;
  nodeId: string;
  payload: string;
  qos: number;
  latencyMs: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  roleCategory: RoleCategory;
  department: string;
  employeeId: string;
  phone: string;
  password?: string;
  specializedDuties?: string[];
  stats: {
    alertsResolved: number;
    tasksCompleted: number;
    uptimePercent: number;
  };
}

export interface AppSettings {
  theme: 'dark' | 'light';
  telemetryUpdateMs: number;
  telemetryPaused: boolean;
  alertNotifications: boolean;
  maintenanceReminders: boolean;
  criticalMachineAlerts: boolean;
  audioAlarms: boolean;
  rememberMe: boolean;
  appLock: boolean;
  mqttBrokerUrl: string;
  samplingFrequencyHz: number;
}
