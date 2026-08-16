import { Machine, Alert, MaintenanceOrder, UserProfile, AppSettings, MQTTPacket } from '../types';

export const initialMachines: Machine[] = [
  {
    id: 'M-01',
    name: 'CNC Spindle Center 01',
    type: 'High-Precision 4-Axis Milling Center',
    category: 'Manufacturing',
    location: 'Bay 1 - Tooling & Spindle Line',
    bayId: 'bay-1',
    healthScore: 94,
    status: 'healthy',
    rpm: 7200,
    loadPercent: 78,
    coordinates: { x: 22, y: 30 },
    modelType: 'cnc',
    telemetry: {
      crestFactor: 2.1,
      peakShock: 2.3,
      rms: 1.8,
      kurtosis: 2.9,
      skewness: 0.12,
      variance: 0.85,
      mav: 1.42,
      temperature: 38.5,
      vibrationXYZ: { x: 0.9, y: 1.1, z: 1.2 },
      totalVibration: 1.87
    },
    fftSpectrum: {
      frequencies: [10, 25, 50, 75, 100, 120, 150, 200, 250, 300, 400, 500],
      amplitudes: [0.15, 0.22, 0.85, 0.31, 0.45, 1.20, 0.28, 0.19, 0.14, 0.09, 0.05, 0.03],
      dominantHarmonic: 120,
      peaks: [
        { freqHz: 120, amplitude: 1.20, label: '1X Running Speed' },
        { freqHz: 50, amplitude: 0.85, label: 'Coolant Pump Line' }
      ]
    },
    sensor: {
      nodeId: 'ESP32-NODE-01',
      sensorModel: 'MPU6050 6-DOF IMU',
      status: 'online',
      battery: 98,
      signalDbm: -58,
      lastPing: '1s ago',
      samplingRateHz: 500,
      ipAddress: '192.168.1.101',
      mqttTopic: 'factory/bay1/cnc01/telemetry'
    },
    aiPrediction: {
      condition: 'Optimal Baseline Operation',
      faultClass: 'normal',
      risk: 'low',
      confidence: 96.4,
      recommendedAction: 'Maintain current cutting feed rates. Scheduled baseline check in 280 operating hours.',
      detectedAt: 'Real-time telemetry stream active',
      timeToFailureEst: '> 1,200 hrs',
      rulHours: 1250,
      randomForestWeights: {
        crestFactor: 0.18,
        kurtosis: 0.22,
        peakShock: 0.15,
        rms: 0.31,
        temperature: 0.14
      }
    },
    history1H: [95, 94, 94, 95, 93, 94, 94, 95, 94],
    history24H: [96, 95, 95, 94, 94, 94, 94],
    history7D: [98, 97, 96, 95, 95, 94, 94],
    arComponentNodes: [
      { id: 'n1', name: 'Ceramic Spindle Bearing', status: 'healthy', temp: 38.2, vibration: 1.2, position2D: { x: 35, y: 38 }, position3D: [0, 1.2, 0], description: 'High-speed angular contact bearing pair' },
      { id: 'n2', name: 'AC Servo Drive Motor', status: 'healthy', temp: 39.1, vibration: 1.5, position2D: { x: 65, y: 35 }, position3D: [-1.2, 0.8, 0], description: 'Brushless permanent magnet direct drive' },
      { id: 'n3', name: 'Cyclonic Coolant Pump', status: 'healthy', temp: 34.8, vibration: 0.8, position2D: { x: 50, y: 75 }, position3D: [0.8, -0.6, 0.8], description: 'Centrifugal flood coolant circulation' }
    ]
  },
  {
    id: 'M-02',
    name: 'Rotary Lathe Machine 02',
    type: 'Heavy-Duty CNC Turning Center',
    category: 'Manufacturing',
    location: 'Bay 2 - Turning & Boring Cell',
    bayId: 'bay-2',
    healthScore: 87,
    status: 'healthy',
    rpm: 3600,
    loadPercent: 82,
    coordinates: { x: 58, y: 32 },
    modelType: 'lathe',
    telemetry: {
      crestFactor: 2.7,
      peakShock: 3.1,
      rms: 2.4,
      kurtosis: 3.2,
      skewness: 0.28,
      variance: 1.34,
      mav: 1.95,
      temperature: 44.2,
      vibrationXYZ: { x: 1.4, y: 1.5, z: 1.3 },
      totalVibration: 2.43
    },
    fftSpectrum: {
      frequencies: [10, 30, 60, 90, 120, 180, 240, 300, 360, 420, 480, 540],
      amplitudes: [0.20, 0.35, 1.45, 0.52, 0.88, 0.40, 0.25, 0.18, 0.11, 0.08, 0.05, 0.04],
      dominantHarmonic: 60,
      peaks: [
        { freqHz: 60, amplitude: 1.45, label: '1X Chuck Rotation' },
        { freqHz: 120, amplitude: 0.88, label: '2X Harmonic' }
      ]
    },
    sensor: {
      nodeId: 'ESP32-NODE-02',
      sensorModel: 'MPU6050 6-DOF IMU',
      status: 'online',
      battery: 92,
      signalDbm: -62,
      lastPing: '2s ago',
      samplingRateHz: 500,
      ipAddress: '192.168.1.102',
      mqttTopic: 'factory/bay2/lathe02/telemetry'
    },
    aiPrediction: {
      condition: 'Minor Harmonic Ripple on Chuck',
      faultClass: 'normal',
      risk: 'low',
      confidence: 91.2,
      recommendedAction: 'Monitor vibration peaks during roughing cycle with large diameter workpieces.',
      detectedAt: 'Live telemetry active',
      timeToFailureEst: '> 850 hrs',
      rulHours: 890,
      randomForestWeights: {
        crestFactor: 0.24,
        kurtosis: 0.20,
        peakShock: 0.22,
        rms: 0.21,
        temperature: 0.13
      }
    },
    history1H: [89, 88, 87, 87, 88, 87, 87, 87],
    history24H: [92, 90, 89, 88, 87, 87],
    history7D: [95, 93, 91, 89, 88, 87],
    arComponentNodes: [
      { id: 'n1', name: 'Main 3-Jaw Chuck Gearbox', status: 'healthy', temp: 44.5, vibration: 2.2, position2D: { x: 28, y: 45 }, position3D: [-0.9, 0.5, 0], description: 'Spur gear reduction system' },
      { id: 'n2', name: 'Hydraulic Tailstock Guide', status: 'healthy', temp: 40.1, vibration: 1.6, position2D: { x: 72, y: 45 }, position3D: [1.1, 0.2, 0], description: 'Hardened linear roller slideways' }
    ]
  },
  {
    id: 'M-03',
    name: '5-Axis Milling Center 03',
    type: '5-Axis High-Torque Vertical Mill',
    category: 'Manufacturing',
    location: 'Bay 1 - Heavy Tooling Cell',
    bayId: 'bay-1',
    healthScore: 68,
    status: 'warning',
    rpm: 5400,
    loadPercent: 91,
    coordinates: { x: 26, y: 65 },
    modelType: 'milling',
    telemetry: {
      crestFactor: 3.8,
      peakShock: 4.9,
      rms: 3.6,
      kurtosis: 4.5,
      skewness: 0.64,
      variance: 2.89,
      mav: 2.85,
      temperature: 52.8,
      vibrationXYZ: { x: 2.8, y: 2.1, z: 1.5 },
      totalVibration: 3.81
    },
    fftSpectrum: {
      frequencies: [15, 30, 45, 90, 135, 180, 225, 270, 315, 360, 450, 500],
      amplitudes: [0.35, 0.60, 0.95, 2.80, 1.95, 1.40, 0.85, 0.60, 0.40, 0.28, 0.15, 0.10],
      dominantHarmonic: 90,
      peaks: [
        { freqHz: 90, amplitude: 2.80, label: '1X Radial Misalignment' },
        { freqHz: 180, amplitude: 1.40, label: '2X Axial Coupling Runout' }
      ]
    },
    sensor: {
      nodeId: 'ESP32-NODE-03',
      sensorModel: 'MPU6050 6-DOF IMU',
      status: 'online',
      battery: 84,
      signalDbm: -67,
      lastPing: '1s ago',
      samplingRateHz: 500,
      ipAddress: '192.168.1.103',
      mqttTopic: 'factory/bay1/mill03/telemetry'
    },
    aiPrediction: {
      condition: 'Shaft Angular Misalignment Detected',
      faultClass: 'shaft_misalignment',
      risk: 'medium',
      confidence: 89.6,
      recommendedAction: 'Laser dial gauge alignment recommended on flexible coupling within 72 hours.',
      detectedAt: 'Fault detected 34 mins ago',
      timeToFailureEst: '5 Days (120 hrs)',
      rulHours: 120,
      randomForestWeights: {
        crestFactor: 0.29,
        kurtosis: 0.33,
        peakShock: 0.18,
        rms: 0.12,
        temperature: 0.08
      }
    },
    history1H: [72, 70, 69, 68, 68, 68, 67, 68],
    history24H: [78, 75, 73, 70, 69, 68],
    history7D: [88, 84, 80, 76, 72, 68],
    arComponentNodes: [
      { id: 'n1', name: 'Flexible Spider Coupling', status: 'warning', temp: 53.4, vibration: 3.8, faultTag: 'Angular Offset 0.42°', position2D: { x: 48, y: 35 }, position3D: [0, 0.7, 0], description: 'Elastomer insert showing uneven load compression' },
      { id: 'n2', name: 'Z-Axis Ballscrew Drive', status: 'healthy', temp: 42.0, vibration: 1.8, position2D: { x: 62, y: 60 }, position3D: [0.6, 1.4, -0.3], description: 'Preloaded double nut recirculating ball assembly' }
    ]
  },
  {
    id: 'M-04',
    name: 'Belt Conveyor Drive 04',
    type: 'Variable Speed Assembly Feeder',
    category: 'Conveyors',
    location: 'Bay 3 - Packaging Transfer Line',
    bayId: 'bay-3',
    healthScore: 41,
    status: 'critical',
    rpm: 1450,
    loadPercent: 95,
    coordinates: { x: 78, y: 70 },
    modelType: 'conveyor',
    telemetry: {
      crestFactor: 5.6,
      peakShock: 7.2,
      rms: 5.8,
      kurtosis: 6.8,
      skewness: 1.15,
      variance: 6.42,
      mav: 4.88,
      temperature: 68.4,
      vibrationXYZ: { x: 4.2, y: 3.8, z: 4.6 },
      totalVibration: 7.28
    },
    fftSpectrum: {
      frequencies: [24, 48, 72, 120, 185, 240, 310, 370, 420, 480, 520, 600],
      amplitudes: [0.80, 1.20, 1.85, 2.40, 4.80, 3.20, 2.10, 1.60, 0.90, 0.60, 0.40, 0.25],
      dominantHarmonic: 185,
      peaks: [
        { freqHz: 185, amplitude: 4.80, label: 'BPFO Outer Race Defect' },
        { freqHz: 24, amplitude: 0.80, label: '1X Motor Speed' }
      ]
    },
    sensor: {
      nodeId: 'ESP32-NODE-04',
      sensorModel: 'MPU6050 6-DOF IMU',
      status: 'online',
      battery: 76,
      signalDbm: -71,
      lastPing: '1s ago',
      samplingRateHz: 500,
      ipAddress: '192.168.1.104',
      mqttTopic: 'factory/bay3/conv04/telemetry'
    },
    aiPrediction: {
      condition: 'Critical Roller Bearing Race Spalling',
      faultClass: 'bearing_wear',
      risk: 'high',
      confidence: 97.8,
      recommendedAction: 'URGENT: Replace SKF 6208 deep groove ball bearing immediately to prevent catastrophic seizure.',
      detectedAt: 'Triggered 12 mins ago',
      timeToFailureEst: '18 Hours',
      rulHours: 18,
      randomForestWeights: {
        crestFactor: 0.35,
        kurtosis: 0.38,
        peakShock: 0.14,
        rms: 0.08,
        temperature: 0.05
      }
    },
    history1H: [48, 45, 43, 42, 42, 41, 41, 41],
    history24H: [62, 58, 54, 49, 45, 41],
    history7D: [82, 75, 68, 59, 50, 41],
    arComponentNodes: [
      { id: 'n1', name: 'Drive Pulley Pillow Block Bearing', status: 'critical', temp: 69.2, vibration: 7.2, faultTag: 'BPFO Peak 4.8g', position2D: { x: 22, y: 50 }, position3D: [-1.4, 0.2, 0], description: 'Severe spalling on outer bearing race raceway' },
      { id: 'n2', name: 'Helical Reduction Gearbox', status: 'warning', temp: 58.0, vibration: 3.4, faultTag: 'Thermal Rise +18°C', position2D: { x: 55, y: 50 }, position3D: [0.2, 0.4, 0], description: 'Lubricant viscosity breakdown due to bearing friction' }
    ]
  },
  {
    id: 'M-05',
    name: 'Rotary Screw Compressor 05',
    type: 'Twin-Screw Industrial Air Compressor',
    category: 'HVAC',
    location: 'Bay 4 - Central Utility Room',
    bayId: 'bay-4',
    healthScore: 79,
    status: 'healthy',
    rpm: 2950,
    loadPercent: 74,
    coordinates: { x: 82, y: 25 },
    modelType: 'compressor',
    telemetry: {
      crestFactor: 2.9,
      peakShock: 3.4,
      rms: 2.6,
      kurtosis: 3.4,
      skewness: 0.32,
      variance: 1.68,
      mav: 2.10,
      temperature: 58.2,
      vibrationXYZ: { x: 1.8, y: 1.7, z: 1.2 },
      totalVibration: 2.76
    },
    fftSpectrum: {
      frequencies: [25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500],
      amplitudes: [0.30, 1.10, 0.45, 0.70, 0.50, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05, 0.03],
      dominantHarmonic: 50,
      peaks: [
        { freqHz: 50, amplitude: 1.10, label: '1X Motor Speed' },
        { freqHz: 100, amplitude: 0.70, label: '2X Rotor Mesh' }
      ]
    },
    sensor: {
      nodeId: 'ESP32-NODE-05',
      sensorModel: 'MPU6050 6-DOF IMU',
      status: 'online',
      battery: 89,
      signalDbm: -64,
      lastPing: '2s ago',
      samplingRateHz: 500,
      ipAddress: '192.168.1.105',
      mqttTopic: 'factory/bay4/comp05/telemetry'
    },
    aiPrediction: {
      condition: 'Normal Baseline with Slight Thermal Drift',
      faultClass: 'normal',
      risk: 'low',
      confidence: 93.0,
      recommendedAction: 'Check oil separator filter differential pressure at next shift change.',
      detectedAt: 'Live telemetry active',
      timeToFailureEst: '> 700 hrs',
      rulHours: 720,
      randomForestWeights: {
        crestFactor: 0.20,
        kurtosis: 0.19,
        peakShock: 0.21,
        rms: 0.22,
        temperature: 0.18
      }
    },
    history1H: [80, 80, 79, 79, 79, 79, 79],
    history24H: [82, 81, 80, 80, 79, 79],
    history7D: [86, 84, 83, 81, 80, 79],
    arComponentNodes: [
      { id: 'n1', name: 'Female Rotor Airend Bearings', status: 'healthy', temp: 59.1, vibration: 2.4, position2D: { x: 40, y: 40 }, position3D: [-0.4, 0.6, 0], description: 'Tapered roller thrust bearings' },
      { id: 'n2', name: 'Air-Cooled Aftercooler Fan', status: 'healthy', temp: 42.5, vibration: 1.4, position2D: { x: 75, y: 65 }, position3D: [0.8, -0.2, 0.4], description: 'Axial multi-blade cooling fan' }
    ]
  },
  {
    id: 'M-06',
    name: 'Centrifugal HVAC Chiller Pump 06',
    type: 'High-Volume Coolant Chiller Pump',
    category: 'HVAC',
    location: 'Bay 4 - Central Chiller Plant',
    bayId: 'bay-4',
    healthScore: 59,
    status: 'warning',
    rpm: 1750,
    loadPercent: 88,
    coordinates: { x: 86, y: 55 },
    modelType: 'hvac',
    telemetry: {
      crestFactor: 4.1,
      peakShock: 4.8,
      rms: 3.9,
      kurtosis: 4.9,
      skewness: 0.72,
      variance: 3.12,
      mav: 3.10,
      temperature: 56.4,
      vibrationXYZ: { x: 2.9, y: 2.7, z: 2.2 },
      totalVibration: 4.54
    },
    fftSpectrum: {
      frequencies: [15, 29, 58, 87, 116, 145, 200, 260, 320, 380, 440, 500],
      amplitudes: [0.40, 0.85, 2.65, 1.40, 1.10, 0.80, 0.55, 0.35, 0.22, 0.15, 0.10, 0.06],
      dominantHarmonic: 58,
      peaks: [
        { freqHz: 58, amplitude: 2.65, label: '2X Blade Pass Frequency' },
        { freqHz: 29, amplitude: 0.85, label: '1X Shaft Rotation' }
      ]
    },
    sensor: {
      nodeId: 'ESP32-NODE-06',
      sensorModel: 'MPU6050 6-DOF IMU',
      status: 'online',
      battery: 91,
      signalDbm: -60,
      lastPing: '1s ago',
      samplingRateHz: 500,
      ipAddress: '192.168.1.106',
      mqttTopic: 'factory/bay4/pump06/telemetry'
    },
    aiPrediction: {
      condition: 'Impeller Hydraulic Cavitation & Imbalance',
      faultClass: 'rotor_imbalance',
      risk: 'medium',
      confidence: 88.4,
      recommendedAction: 'Inspect pump suction strainer and check NPSH margin. Inspect bronze impeller for erosion.',
      detectedAt: 'Detected 1 hr ago',
      timeToFailureEst: '7 Days (168 hrs)',
      rulHours: 168,
      randomForestWeights: {
        crestFactor: 0.28,
        kurtosis: 0.31,
        peakShock: 0.22,
        rms: 0.11,
        temperature: 0.08
      }
    },
    history1H: [62, 61, 60, 60, 59, 59, 59],
    history24H: [68, 65, 63, 61, 60, 59],
    history7D: [78, 74, 70, 66, 62, 59],
    arComponentNodes: [
      { id: 'n1', name: 'Suction Impeller Volute', status: 'warning', temp: 54.2, vibration: 4.2, faultTag: 'Cavitation Turbulence', position2D: { x: 35, y: 55 }, position3D: [-0.5, 0, 0.3], description: 'Pressure pulsations causing broadband high-frequency noise' },
      { id: 'n2', name: 'Mechanical Face Seal', status: 'healthy', temp: 48.0, vibration: 2.1, position2D: { x: 65, y: 45 }, position3D: [0.4, 0.2, 0], description: 'Silicon carbide flush lubricated seal' }
    ]
  }
];

export const initialAlerts: Alert[] = [
  {
    id: 'ALT-101',
    machineId: 'M-04',
    machineName: 'Belt Conveyor Drive 04',
    severity: 'critical',
    title: 'Severe Roller Bearing Race Spalling',
    description: 'Kurtosis exceeded 6.8 (threshold: 3.5) with crest factor spike to 5.6. High risk of immediate bearing seizure.',
    timestamp: '12 mins ago',
    status: 'unread',
    recommendedAction: 'Replace SKF 6208 bearing on Bay 3 assembly feeder. Estimated RUL < 18 hours.',
    featureTriggered: 'Kurtosis (6.8) & Crest Factor (5.6)'
  },
  {
    id: 'ALT-102',
    machineId: 'M-03',
    machineName: '5-Axis Milling Center 03',
    severity: 'warning',
    title: 'Shaft Angular Misalignment',
    description: '2X rotational harmonic peak at 180Hz detected with temperature reaching 52.8°C.',
    timestamp: '34 mins ago',
    status: 'unread',
    recommendedAction: 'Schedule laser shaft alignment check on next tooling shift.',
    featureTriggered: 'Peak Shock (4.9g) & 2X Harmonics'
  },
  {
    id: 'ALT-103',
    machineId: 'M-06',
    machineName: 'Centrifugal HVAC Chiller Pump 06',
    severity: 'warning',
    title: 'Impeller Hydraulic Cavitation',
    description: 'Broadband vibration rise with crest factor at 4.1 in Bay 4 chiller loop.',
    timestamp: '1 hr ago',
    status: 'read',
    recommendedAction: 'Check suction pipe pressure and clean inlet basket strainer.',
    featureTriggered: 'Crest Factor (4.1) & Variance (3.12)'
  },
  {
    id: 'ALT-104',
    machineId: 'M-01',
    machineName: 'CNC Spindle Center 01',
    severity: 'info',
    title: 'Sensor Calibration Synced',
    description: 'ESP32-NODE-01 calibrated via MQTT over-the-air baseline packet.',
    timestamp: '3 hrs ago',
    status: 'read',
    recommendedAction: 'No action needed. Sensor healthy at 500Hz sampling.',
    featureTriggered: 'MQTT Baseline Sync'
  }
];

export const initialMaintenanceOrders: MaintenanceOrder[] = [
  {
    id: 'WO-801',
    machineId: 'M-04',
    machineName: 'Belt Conveyor Drive 04',
    issue: 'Emergency Bearing Replacement (SKF 6208)',
    priority: 'critical',
    dueDate: 'Today, 2:00 PM',
    status: 'in_progress',
    assignedTo: 'Muffadal (Vibration Specialist)',
    notes: 'AR digital twin step-by-step guide loaded. Replacement bearing ready in Storeroom B.',
    createdDate: '12-Aug-2026',
    estimatedHours: 2.5,
    spareParts: ['SKF 6208-2RS Deep Groove Bearing', 'Shell Gadus S2 V220 Grease', 'Snap Ring Set']
  },
  {
    id: 'WO-802',
    machineId: 'M-03',
    machineName: '5-Axis Milling Center 03',
    issue: 'Laser Coupling Alignment & Spider Bushing Inspection',
    priority: 'high',
    dueDate: 'Tomorrow, 10:00 AM',
    status: 'pending',
    assignedTo: 'Adnaan Khan M (Lead Engineer)',
    notes: 'Laser dial indicator kit reserved. Aim for < 0.05mm radial runout.',
    createdDate: '11-Aug-2026',
    estimatedHours: 3.0,
    spareParts: ['Rotex 28 Polyurethane Spider Insert', 'Shims Kit (0.05mm - 0.5mm)']
  },
  {
    id: 'WO-803',
    machineId: 'M-06',
    machineName: 'Centrifugal HVAC Chiller Pump 06',
    issue: 'Suction Strainer Flush & Cavitation Check',
    priority: 'medium',
    dueDate: '15-Aug-2026',
    status: 'scheduled',
    assignedTo: 'Ashwin R (AR Engineer)',
    notes: 'Verify NPSH margin and measure delta-P across inlet manifold.',
    createdDate: '10-Aug-2026',
    estimatedHours: 1.5,
    spareParts: ['EPDM Gasket Set', 'Suction Basket Filter 50-Mesh']
  },
  {
    id: 'WO-804',
    machineId: 'M-01',
    machineName: 'CNC Spindle Center 01',
    issue: 'Quarterly Spindle Taper Runout Calibration',
    priority: 'low',
    dueDate: '20-Aug-2026',
    status: 'completed',
    assignedTo: 'Pranuth M V (Operations Manager)',
    notes: 'Runout measured at 0.002mm. Well within ISO 1940 G1.0 tolerance.',
    createdDate: '05-Aug-2026',
    estimatedHours: 1.0,
    spareParts: ['IsoFlex NBU 15 High Speed Grease']
  }
];

export const initialMqttPackets: MQTTPacket[] = [
  {
    id: 'pkt-1',
    timestamp: '12:04:15.820',
    topic: 'factory/bay3/conv04/telemetry',
    nodeId: 'ESP32-NODE-04',
    payload: '{"rms":5.82,"peak":7.21,"crest":5.61,"kurt":6.82,"temp":68.4,"ax":4.2,"ay":3.8,"az":4.6}',
    qos: 1,
    latencyMs: 14
  },
  {
    id: 'pkt-2',
    timestamp: '12:04:15.610',
    topic: 'factory/bay1/cnc01/telemetry',
    nodeId: 'ESP32-NODE-01',
    payload: '{"rms":1.81,"peak":2.30,"crest":2.10,"kurt":2.91,"temp":38.5,"ax":0.9,"ay":1.1,"az":1.2}',
    qos: 0,
    latencyMs: 11
  },
  {
    id: 'pkt-3',
    timestamp: '12:04:15.350',
    topic: 'factory/bay1/mill03/telemetry',
    nodeId: 'ESP32-NODE-03',
    payload: '{"rms":3.62,"peak":4.91,"crest":3.80,"kurt":4.52,"temp":52.8,"ax":2.8,"ay":2.1,"az":1.5}',
    qos: 1,
    latencyMs: 18
  },
  {
    id: 'pkt-4',
    timestamp: '12:04:14.990',
    topic: 'factory/bay2/lathe02/telemetry',
    nodeId: 'ESP32-NODE-02',
    payload: '{"rms":2.41,"peak":3.10,"crest":2.72,"kurt":3.21,"temp":44.2,"ax":1.4,"ay":1.5,"az":1.3}',
    qos: 0,
    latencyMs: 12
  },
  {
    id: 'pkt-5',
    timestamp: '12:04:14.710',
    topic: 'factory/bay4/comp05/telemetry',
    nodeId: 'ESP32-NODE-05',
    payload: '{"rms":2.60,"peak":3.40,"crest":2.91,"kurt":3.40,"temp":58.2,"ax":1.8,"ay":1.7,"az":1.2}',
    qos: 0,
    latencyMs: 15
  },
  {
    id: 'pkt-6',
    timestamp: '12:04:14.420',
    topic: 'factory/bay4/pump06/telemetry',
    nodeId: 'ESP32-NODE-06',
    payload: '{"rms":3.90,"peak":4.80,"crest":4.12,"kurt":4.90,"temp":56.4,"ax":2.9,"ay":2.7,"az":2.2}',
    qos: 1,
    latencyMs: 16
  }
];

export const userAccounts: UserProfile[] = [
  {
    id: 'u-01',
    name: 'Adnaan Khan M',
    email: '24dr02@psgpolytech.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Project Engineer & IoT Architect',
    roleCategory: 'lead_engineer',
    department: 'Department of Computer Networking',
    employeeId: 'PSG-24DR02',
    phone: '+91 98422 10001',
    specializedDuties: [
      'ESP32 Hardware & MPU6050 Firmware Orchestration',
      'MQTT Broker Low-Latency Network Topology',
      'System Architecture & Core Integration'
    ],
    stats: { alertsResolved: 42, tasksCompleted: 88, uptimePercent: 99.8 }
  },
  {
    id: 'u-02',
    name: 'Ms. K. Thamaraiselvi',
    email: 'k.thamaraiselvi@psgpolytech.ac.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Project Guide & Academic Evaluator',
    roleCategory: 'evaluator',
    department: 'Dept of Computer Networking, PSG Polytechnic',
    employeeId: 'PSG-FAC-CN09',
    phone: '+91 422 257 2177',
    specializedDuties: [
      'Curriculum Verification (Course Code C24653)',
      'Rubric Grading & Architecture Compliance',
      'MSME Cost Feasibility Assessment'
    ],
    stats: { alertsResolved: 15, tasksCompleted: 120, uptimePercent: 100.0 }
  },
  {
    id: 'u-03',
    name: 'Muffadal',
    email: '24dr30@psgpolytech.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'AI & Vibration Feature Specialist',
    roleCategory: 'vibration_specialist',
    department: 'Department of Computer Networking',
    employeeId: 'PSG-24DR30',
    phone: '+91 98422 10030',
    specializedDuties: [
      '8 Time-Domain Feature Extraction Engine',
      'Random Forest Classifier Training & Tuning',
      'FFT Harmonic Peak Identification'
    ],
    stats: { alertsResolved: 38, tasksCompleted: 64, uptimePercent: 99.4 }
  },
  {
    id: 'u-04',
    name: 'Ashwin R',
    email: '24dr05@psgpolytech.ac.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'AR Digital Twin & Vuforia Specialist',
    roleCategory: 'ar_engineer',
    department: 'Department of Computer Networking',
    employeeId: 'PSG-24DR05',
    phone: '+91 98422 10005',
    specializedDuties: [
      'Spatial Holographic Overlay Calibration',
      'Point-and-See Camera Recognition Pipeline',
      '3D Exploded Diagnostic Meshes'
    ],
    stats: { alertsResolved: 29, tasksCompleted: 52, uptimePercent: 99.2 }
  },
  {
    id: 'u-05',
    name: 'Pranuth M V',
    email: '24dr36@psgpolytech.ac.in',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    role: 'Operations & Maintenance Manager',
    roleCategory: 'plant_manager',
    department: 'Department of Computer Networking',
    employeeId: 'PSG-24DR36',
    phone: '+91 98422 10036',
    specializedDuties: [
      'MSME Implementation & Cost Economics',
      'Work Order Kanban & Asset Inventory',
      'Downtime Reduction Tracking (OEE)'
    ],
    stats: { alertsResolved: 31, tasksCompleted: 77, uptimePercent: 99.6 }
  }
];

export const defaultSettings: AppSettings = {
  theme: 'dark',
  telemetryUpdateMs: 1500,
  telemetryPaused: false,
  alertNotifications: true,
  maintenanceReminders: true,
  criticalMachineAlerts: true,
  audioAlarms: false,
  rememberMe: true,
  appLock: false,
  mqttBrokerUrl: 'mqtt://192.168.1.100:1883',
  samplingFrequencyHz: 500
};

export const academicBOM = [
  { item: 'ESP32 Dual-Core Edge Microcontrollers (x6)', qty: 6, unitCost: 450, total: 2700, purpose: 'Tri-axial vibration sampling & MQTT Wi-Fi telemetry' },
  { item: 'MPU6050 6-DOF IMU Accelerometer + Temp (x6)', qty: 6, unitCost: 180, total: 1080, purpose: 'High-frequency 500Hz tri-axial acceleration & thermal monitoring' },
  { item: 'Industrial Magnetic Mounting Studs & Cables', qty: 6, unitCost: 250, total: 1500, purpose: 'Solid mechanical vibration coupling to machine casings' },
  { item: 'Local Wi-Fi Access Point & MQTT Gateway Node', qty: 1, unitCost: 2200, total: 2200, purpose: 'Sub-20ms private factory LAN telemetry streaming' },
  { item: 'Unity & Vuforia AR Tracking Target Calibrators', qty: 4, unitCost: 350, total: 1400, purpose: 'Spatial machine registration & Point-and-See HUD markers' },
  { item: 'Python ML Engine & Cloudflare Tunnel Broker Server', qty: 1, unitCost: 4500, total: 4500, purpose: 'Random Forest 8-feature inference & web hosting' },
  { item: 'Prototyping PCB Shields, 5V Regulators & Enclosures', qty: 1, unitCost: 1470, total: 1470, purpose: 'IP65-rated vibration-damped edge enclosure prototyping' }
];
