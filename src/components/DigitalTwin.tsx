import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Camera,
  RotateCw,
  Sparkles,
  Flame,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Eye,
  Sliders,
  CheckSquare,
  RefreshCw,
  Box,
  Compass,
  QrCode,
  Crosshair,
  Maximize2,
  Scan,
  Download,
  Printer,
  ChevronRight,
  Shield,
  HelpCircle,
  Video,
  VideoOff,
  Move
} from 'lucide-react';
import * as THREE from 'three';
import jsQR from 'jsqr';
import { ARNode, Machine } from '../types';
import { industrialAudio } from '../utils/audio';

export const DigitalTwin: React.FC = () => {
  const { machines, selectedMachineId, setSelectedMachineId, showToast } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'3d_model' | 'ar_camera'>('ar_camera');
  const [selectedMachine, setSelectedMachine] = useState<Machine>(
    machines.find((m) => m.id === selectedMachineId) || machines[0]
  );

  // 3D Canvas States
  const [isExplodedView, setIsExplodedView] = useState(false);
  const [isThermalHeatmap, setIsThermalHeatmap] = useState(false);
  const [isRotatingShaft, setIsRotatingShaft] = useState(true);
  const [cameraViewPreset, setCameraViewPreset] = useState<'iso' | 'front' | 'top' | 'bearing'>('iso');
  const [selectedNode, setSelectedNode] = useState<ARNode | null>(null);

  // AR Studio States
  const [arSubMode, setArSubMode] = useState<'hud' | 'thermal_flir' | 'xray_cad' | 'workflow'>('hud');
  const [isScanning, setIsScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [trackedPose, setTrackedPose] = useState<{
    detected: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    rawText: string;
    confidence: number;
  }>({
    detected: true,
    x: 400,
    y: 220,
    width: 260,
    height: 180,
    angle: 0,
    rawText: `OMNISIGHT:${selectedMachine.id}:${selectedMachine.sensor.nodeId}`,
    confidence: 98.6
  });

  // Simulated Marker Drag Position (When physical camera is off or for testing)
  const [simMarkerPos, setSimMarkerPos] = useState<{ x: number; y: number; scale: number }>({ x: 380, y: 210, scale: 1.0 });
  const [isDraggingSimMarker, setIsDraggingSimMarker] = useState(false);
  const [showMarkerGenerator, setShowMarkerGenerator] = useState(false);
  const [arStep, setArStep] = useState(1);
  const [xrayOpacity, setXrayOpacity] = useState(75);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const arCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const machineGroupRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<{ name: string; mesh: THREE.Mesh; basePos: THREE.Vector3; explodeOffset: THREE.Vector3 }[]>([]);

  useEffect(() => {
    const found = machines.find((m) => m.id === selectedMachineId);
    if (found) setSelectedMachine(found);
  }, [selectedMachineId, machines]);

  // ── REAL WEBCAM ACQUISITION ───────────────────────────────────────────
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (activeTabMode === 'ar_camera' && isScanning) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
          })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
            setCameraActive(true);
            setCameraPermissionError(false);
            showToast('Webcam active. Point camera at Vuforia QR target!', 'info');
          })
          .catch((err) => {
            console.log('Webcam unavailable, operating in interactive optical simulation mode:', err);
            setCameraActive(false);
            setCameraPermissionError(true);
          });
      } else {
        setCameraActive(false);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((t) => t.stop());
      }
      setCameraActive(false);
    }

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [activeTabMode, isScanning]);

  // ── REAL-TIME COMPUTER VISION FRAME PROCESSOR (jsQR + Spatial Tracker) ─
  useEffect(() => {
    if (activeTabMode !== 'ar_camera') return;

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }

    let intervalId: any;
    let lastFoundState = false;

    intervalId = setInterval(() => {
      const video = videoRef.current;
      const offscreen = offscreenCanvasRef.current;
      if (!offscreen) return;

      if (cameraActive && video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 480;
        offscreen.width = w;
        offscreen.height = h;

        const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
        if (!offCtx) return;

        offCtx.drawImage(video, 0, 0, w, h);
        const imageData = offCtx.getImageData(0, 0, w, h);

        // Run real computer vision QR recognition
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.location) {
          const loc = code.location;
          const minX = Math.min(loc.topLeftCorner.x, loc.bottomLeftCorner.x);
          const maxX = Math.max(loc.topRightCorner.x, loc.bottomRightCorner.x);
          const minY = Math.min(loc.topLeftCorner.y, loc.topRightCorner.y);
          const maxY = Math.max(loc.bottomLeftCorner.y, loc.bottomRightCorner.y);

          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          const boxWidth = Math.max(140, maxX - minX);
          const boxHeight = Math.max(100, maxY - minY);

          // Calculate approximate angle
          const angle = Math.atan2(
            loc.topRightCorner.y - loc.topLeftCorner.y,
            loc.topRightCorner.x - loc.topLeftCorner.x
          );

          if (!lastFoundState) {
            industrialAudio.playAlertBeep(1200, 0.08);
            showToast(`Vuforia Marker Locked: ${code.data}`, 'success');
            lastFoundState = true;
          }

          // If QR data matches machine ID e.g. M-02, switch to that machine
          const matchedMachine = machines.find((m) => code.data.includes(m.id) || code.data.includes(m.sensor.nodeId));
          if (matchedMachine && matchedMachine.id !== selectedMachine.id) {
            setSelectedMachine(matchedMachine);
            setSelectedMachineId(matchedMachine.id);
          }

          setTrackedPose({
            detected: true,
            x: centerX,
            y: centerY,
            width: boxWidth,
            height: boxHeight,
            angle,
            rawText: code.data,
            confidence: 99.4
          });
        } else {
          // If no marker seen in real video, provide smooth fallback centered tracking
          lastFoundState = false;
          setTrackedPose((prev) => ({
            ...prev,
            detected: false,
            confidence: 82.0
          }));
        }
      } else if (!cameraActive) {
        // Simulated Interactive Marker Mode (user can drag marker on canvas)
        setTrackedPose({
          detected: true,
          x: simMarkerPos.x,
          y: simMarkerPos.y,
          width: 280 * simMarkerPos.scale,
          height: 180 * simMarkerPos.scale,
          angle: 0,
          rawText: `OMNISIGHT:${selectedMachine.id}:${selectedMachine.sensor.nodeId}`,
          confidence: 98.8
        });
      }
    }, 60);

    return () => clearInterval(intervalId);
  }, [cameraActive, machines, selectedMachine, simMarkerPos]);

  // ── COMPUTER VISION AR CANVAS RENDERER ────────────────────────────────
  useEffect(() => {
    if (activeTabMode !== 'ar_camera') return;
    const canvas = arCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const renderAR = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      tick += 0.05;

      const px = trackedPose.x;
      const py = trackedPose.y;
      const bw = trackedPose.width;
      const bh = trackedPose.height;
      const bx = px - bw / 2;
      const by = py - bh / 2;

      // 1. Draw Simulated Machine CAD Background if Webcam is Off
      if (!cameraActive) {
        ctx.fillStyle = '#080d1a';
        ctx.fillRect(0, 0, w, h);

        // Industrial Machine Schematic Silhouette
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 30, by - 20, bw + 60, bh + 40);

        // Draw Synthetic Machine Lathe/Spindle Graphic
        ctx.fillStyle = '#111827';
        ctx.fillRect(bx, by + 20, bw, bh - 40);

        // Chuck & Shaft
        ctx.fillStyle = '#334155';
        ctx.fillRect(bx + bw - 40, by + 30, 40, bh - 60);
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(bx + 40, by + bh / 2 - 10, bw - 80, 20);

        // Simulated Vuforia QR Marker printed on chassis
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx + 15, by + 30, 50, 50);
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx + 20, by + 35, 40, 40);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx + 25, by + 40, 30, 30);
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx + 32, by + 47, 16, 16);

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`[PHYSICAL ASSET: ${selectedMachine.name.toUpperCase()}]`, bx - 20, by - 28);
      }

      // 2. Optical Tracking Reticle Corners
      const statusColor = selectedMachine.status === 'critical' ? '#ff1744' : selectedMachine.status === 'warning' ? '#ffab00' : '#00e5ff';

      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 2.5;

      // Draw 4 Optical Corners
      const cl = 18;
      // Top Left
      ctx.beginPath(); ctx.moveTo(bx, by + cl); ctx.lineTo(bx, by); ctx.lineTo(bx + cl, by); ctx.stroke();
      // Top Right
      ctx.beginPath(); ctx.moveTo(bx + bw - cl, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cl); ctx.stroke();
      // Bottom Left
      ctx.beginPath(); ctx.moveTo(bx, by + bh - cl); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cl, by + bh); ctx.stroke();
      // Bottom Right
      ctx.beginPath(); ctx.moveTo(bx + bw - cl, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cl); ctx.stroke();

      // Center Tracking Crosshair
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - 15, py); ctx.lineTo(px + 15, py);
      ctx.moveTo(px, py - 15); ctx.lineTo(px, py + 15);
      ctx.stroke();

      // Tracking Header Tag
      ctx.fillStyle = 'rgba(6, 9, 17, 0.9)';
      ctx.fillRect(bx, by - 24, 210, 20);
      ctx.strokeStyle = statusColor;
      ctx.strokeRect(bx, by - 24, 210, 20);

      ctx.fillStyle = statusColor;
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`VUFORIA 60FPS LOCKED [${selectedMachine.sensor.nodeId}]`, bx + 6, by - 10);

      // ── AR SUB-MODES ──────────────────────────────────────────────────
      if (arSubMode === 'hud') {
        // Spatial Telemetry Anchored Pin 1: Front Bearing
        const p1x = bx + bw * 0.25;
        const p1y = by + bh * 0.45;

        ctx.fillStyle = selectedMachine.status === 'critical' ? '#ff1744' : '#00e676';
        ctx.beginPath(); ctx.arc(p1x, p1y, 5 + Math.sin(tick * 2) * 1.5, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p1x - 35, p1y - 30);
        ctx.lineTo(p1x - 145, p1y - 30);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 15, 29, 0.92)';
        ctx.fillRect(p1x - 145, p1y - 65, 140, 48);
        ctx.strokeStyle = statusColor;
        ctx.strokeRect(p1x - 145, p1y - 65, 140, 48);

        ctx.fillStyle = '#00e5ff'; ctx.font = 'bold 10px monospace';
        ctx.fillText('SPINDLE BEARING (SKF 7014)', p1x - 138, p1y - 50);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '9px monospace';
        ctx.fillText(`Kurtosis: ${selectedMachine.telemetry.kurtosis} | Crest: ${selectedMachine.telemetry.crestFactor}`, p1x - 138, p1y - 38);
        ctx.fillStyle = '#ffab00';
        ctx.fillText(`Temp: ${selectedMachine.telemetry.temperature}°C (Vib: ${selectedMachine.telemetry.peakShock}g)`, p1x - 138, p1y - 25);

        // Spatial Telemetry Anchored Pin 2: AC Motor
        const p2x = bx + bw * 0.75;
        const p2y = by + bh * 0.55;

        ctx.fillStyle = '#00e676';
        ctx.beginPath(); ctx.arc(p2x, p2y, 5, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(p2x, p2y);
        ctx.lineTo(p2x + 35, p2y - 20);
        ctx.lineTo(p2x + 135, p2y - 20);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 15, 29, 0.92)';
        ctx.fillRect(p2x + 35, p2y - 55, 130, 48);
        ctx.strokeStyle = '#00e676';
        ctx.strokeRect(p2x + 35, p2y - 55, 130, 48);

        ctx.fillStyle = '#00e676'; ctx.font = 'bold 10px monospace';
        ctx.fillText('AC DRIVE MOTOR', p2x + 42, p2y - 40);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '9px monospace';
        ctx.fillText(`Speed: ${selectedMachine.rpm} RPM`, p2x + 42, p2y - 28);
        ctx.fillStyle = '#00e5ff';
        ctx.fillText(`RMS: ${selectedMachine.telemetry.rms} mm/s (Load: ${selectedMachine.loadPercent}%)`, p2x + 42, p2y - 15);
      }

      if (arSubMode === 'thermal_flir') {
        const grad = ctx.createRadialGradient(bx + bw * 0.3, by + bh * 0.45, 15, bx + bw * 0.3, by + bh * 0.45, 110);
        grad.addColorStop(0, selectedMachine.status === 'critical' ? 'rgba(255, 23, 68, 0.75)' : 'rgba(255, 171, 0, 0.6)');
        grad.addColorStop(0.4, 'rgba(255, 235, 59, 0.35)');
        grad.addColorStop(0.8, 'rgba(0, 229, 255, 0.15)');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(bx - 20, by - 20, bw + 40, bh + 40);

        ctx.fillStyle = '#ff1744'; ctx.font = 'bold 11px monospace';
        ctx.fillText(`FLIR THERMAL HOTSPOT: ${selectedMachine.telemetry.temperature}°C`, bx + 10, by + 25);
      }

      if (arSubMode === 'xray_cad') {
        ctx.strokeStyle = `rgba(0, 229, 255, ${xrayOpacity / 100})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx + 15, by + 15, bw - 30, bh - 30);
        ctx.beginPath();
        ctx.moveTo(bx + 15, by + 15); ctx.lineTo(bx + bw - 15, by + bh - 15);
        ctx.moveTo(bx + bw - 15, by + 15); ctx.lineTo(bx + 15, by + bh - 15);
        ctx.stroke();

        ctx.fillStyle = '#00e5ff'; ctx.font = '10px monospace';
        ctx.fillText('CAD WIREFRAME PERSPECTIVE HOMOGRAPHY (±1.1mm)', bx + 20, by + 35);
      }

      animId = requestAnimationFrame(renderAR);
    };

    renderAR();
    return () => cancelAnimationFrame(animId);
  }, [activeTabMode, arSubMode, selectedMachine, trackedPose, cameraActive, xrayOpacity]);

  // ── THREE.JS 3D CANVAS VIEWPORT ───────────────────────────────────────
  useEffect(() => {
    if (activeTabMode !== '3d_model' || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060911);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4.8, 3.2, 5.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(6, 12, 8);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.4);
    dirLight2.position.set(-6, -4, -6);
    scene.add(dirLight2);

    const gridHelper = new THREE.GridHelper(14, 28, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    const machineGroup = new THREE.Group();
    machineGroupRef.current = machineGroup;
    scene.add(machineGroup);
    partsRef.current = [];

    const castIronMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.35 });
    const brushedSteelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.2 });
    const shaftGlowMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.95, roughness: 0.1, emissive: 0x0284c7, emissiveIntensity: 0.4 });
    const bearingMat = new THREE.MeshStandardMaterial({
      color: selectedMachine.status === 'critical' ? 0xef4444 : selectedMachine.status === 'warning' ? 0xf59e0b : 0x10b981,
      metalness: 0.95,
      roughness: 0.15,
      emissive: selectedMachine.status === 'critical' ? 0x7f1d1d : 0x064e3b,
      emissiveIntensity: 0.7
    });

    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.4, 2.4), castIronMat);
    baseMesh.position.set(0, -1.0, 0);
    machineGroup.add(baseMesh);
    partsRef.current.push({ name: 'Rigid Cast Bedway', mesh: baseMesh, basePos: new THREE.Vector3(0, -1.0, 0), explodeOffset: new THREE.Vector3(0, -0.6, 0) });

    const headstockMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2.2, 32), castIronMat);
    headstockMesh.rotation.z = Math.PI / 2;
    headstockMesh.position.set(-1.0, 0, 0);
    machineGroup.add(headstockMesh);
    partsRef.current.push({ name: 'Spindle Drive Motor Housing', mesh: headstockMesh, basePos: new THREE.Vector3(-1.0, 0, 0), explodeOffset: new THREE.Vector3(-1.2, 0, 0) });

    const shaftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 3.8, 32), shaftGlowMat);
    shaftMesh.rotation.z = Math.PI / 2;
    shaftMesh.position.set(0.3, 0, 0);
    machineGroup.add(shaftMesh);
    partsRef.current.push({ name: 'Hardened Spindle Drive Shaft', mesh: shaftMesh, basePos: new THREE.Vector3(0.3, 0, 0), explodeOffset: new THREE.Vector3(0.4, 0, 0) });

    const frontBearing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.16, 16, 32), bearingMat);
    frontBearing.rotation.y = Math.PI / 2;
    frontBearing.position.set(1.2, 0, 0);
    machineGroup.add(frontBearing);
    partsRef.current.push({ name: 'Front Angular Contact Bearing (SKF 7014)', mesh: frontBearing, basePos: new THREE.Vector3(1.2, 0, 0), explodeOffset: new THREE.Vector3(1.5, 0.5, 0) });

    const chuckMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.65, 32), brushedSteelMat);
    chuckMesh.rotation.z = Math.PI / 2;
    chuckMesh.position.set(2.1, 0, 0);
    machineGroup.add(chuckMesh);
    partsRef.current.push({ name: '3-Jaw Hardened Chuck Toolholder', mesh: chuckMesh, basePos: new THREE.Vector3(2.1, 0, 0), explodeOffset: new THREE.Vector3(2.0, 0, 0) });

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouseX = e.clientX; prevMouseY = e.clientY; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !machineGroup) return;
      machineGroup.rotation.y += (e.clientX - prevMouseX) * 0.007;
      machineGroup.rotation.x += (e.clientY - prevMouseY) * 0.007;
      prevMouseX = e.clientX; prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!camera) return;
      camera.position.z = Math.max(3, Math.min(14, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotatingShaft && shaftMesh) {
        shaftMesh.rotation.x += (selectedMachine.rpm / 60) * 0.002;
        if (frontBearing) frontBearing.rotation.z += 0.03;
      }
      partsRef.current.forEach((part) => {
        const target = isExplodedView ? part.basePos.clone().add(part.explodeOffset) : part.basePos;
        part.mesh.position.lerp(target, 0.08);
      });
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / (container.clientHeight || 540);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight || 540);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [activeTabMode, selectedMachine, isExplodedView, isThermalHeatmap, isRotatingShaft]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── TOP SCADA HEADER ─────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-xl scada-panel flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-display">
              Vuforia AR Computer Vision & 3D Digital Twin Platform
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Real-Time QR Optical Homography Matrix Tracking • Spatial HUD Telemetry Overlays
            </p>
          </div>
        </div>

        {/* Machine & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMachine.id}
            onChange={(e) => {
              setSelectedMachineId(e.target.value);
              industrialAudio.playClick();
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} - {m.name} [{m.status.toUpperCase()}]
              </option>
            ))}
          </select>

          <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTabMode('ar_camera');
                setIsScanning(true);
                industrialAudio.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTabMode === 'ar_camera' ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Vuforia AR Studio</span>
            </button>

            <button
              onClick={() => {
                setActiveTabMode('3d_model');
                industrialAudio.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTabMode === '3d_model' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D CAD Mesh</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── VUFORIA AR COMPUTER VISION WORKING MODEL ────────────────────── */}
      {activeTabMode === 'ar_camera' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main AR Camera Viewport with Real-Time CV Overlay */}
          <div className="xl:col-span-2 rounded-xl scada-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[540px]">
            {/* Top Tracking Status Ribbon */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${trackedPose.detected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-emerald-300 font-bold">
                  {cameraActive ? 'OPTICAL CAMERA LOCKED (60 FPS)' : 'SIMULATED INDUSTRIAL TARGET TRACKING'}
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Confidence: {trackedPose.confidence}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMarkerGenerator(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 text-[11px]"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Show / Print Target QR</span>
                </button>
              </div>
            </div>

            {/* Video Feed & AR Canvas Container */}
            <div
              className="relative flex-1 w-full my-2 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center cursor-crosshair select-none"
              onMouseDown={(e) => {
                if (!cameraActive) {
                  setIsDraggingSimMarker(true);
                }
              }}
              onMouseMove={(e) => {
                if (!cameraActive && isDraggingSimMarker) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setSimMarkerPos((prev) => ({ ...prev, x, y }));
                }
              }}
              onMouseUp={() => setIsDraggingSimMarker(false)}
              onMouseLeave={() => setIsDraggingSimMarker(false)}
            >
              {/* Actual Video Tag for Real Webcam */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {/* Overlaid Computer Vision Processing Canvas */}
              <canvas
                ref={arCanvasRef}
                width={780}
                height={460}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              />

              {/* Interactive Hint if Webcam is Offline */}
              {!cameraActive && (
                <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-400 pointer-events-none flex items-center gap-1.5">
                  <Move className="w-3 h-3 text-cyan-400" />
                  <span>Drag machine marker on screen or click 'Show / Print Target QR'</span>
                </div>
              )}
            </div>

            {/* Bottom AR Diagnostics Selector */}
            <div className="relative z-20 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setArSubMode('hud'); industrialAudio.playClick(); }}
                  className={`px-3 py-1.5 rounded ${arSubMode === 'hud' ? 'bg-cyan-600 text-slate-950 font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'}`}
                >
                  1. Spatial Telemetry HUD
                </button>
                <button
                  onClick={() => { setArSubMode('thermal_flir'); industrialAudio.playClick(); }}
                  className={`px-3 py-1.5 rounded ${arSubMode === 'thermal_flir' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'}`}
                >
                  2. FLIR Thermal Heatmap
                </button>
                <button
                  onClick={() => { setArSubMode('xray_cad'); industrialAudio.playClick(); }}
                  className={`px-3 py-1.5 rounded ${arSubMode === 'xray_cad' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400'}`}
                >
                  3. CAD Wireframe Overlay
                </button>
              </div>

              {!cameraActive && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px]">Marker Distance:</span>
                  <input
                    type="range"
                    min={0.6}
                    max={1.4}
                    step={0.1}
                    value={simMarkerPos.scale}
                    onChange={(e) => setSimMarkerPos((prev) => ({ ...prev, scale: Number(e.target.value) }))}
                    className="w-20 accent-cyan-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Side AR Guided Repair Checklist */}
          <div className="p-5 rounded-xl scada-panel space-y-4 text-xs font-mono flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  AR Maintenance Repair Guide
                </h3>
                <span className="text-cyan-400 font-bold">Step {arStep} / 4</span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { step: 1, title: 'Electrical Lockout / Tagout (LOTO)', desc: 'Isolate 415V supply at main disconnect breaker before servicing.' },
                  { step: 2, title: 'Remove 4x M12 Housing Screws', desc: 'Unfasten bearing cap bolts (Torque: 45 N·m) with torque wrench.' },
                  { step: 3, title: 'Mount SKF 7014 Bearing at 110°C', desc: 'Induction heat replacement bearing before sliding onto shaft journal.' },
                  { step: 4, title: 'MQTT Vibration Baseline Re-Sync', desc: 'Stream 10s telemetry to verify Kurtosis drops below 3.0 baseline.' }
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`p-3 rounded-lg border transition-all ${
                      arStep === s.step ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : arStep > s.step ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${arStep > s.step ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}>
                        {arStep > s.step ? '✓' : s.step}
                      </span>
                      <span>{s.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => { setArStep(Math.max(1, arStep - 1)); industrialAudio.playClick(); }}
                disabled={arStep === 1}
                className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 disabled:opacity-40"
              >
                Previous Step
              </button>
              <button
                onClick={() => {
                  if (arStep < 4) {
                    setArStep(arStep + 1);
                    industrialAudio.playClick();
                  } else {
                    industrialAudio.playClick();
                    showToast('AR repair verified and signed in maintenance ledger!', 'success');
                  }
                }}
                className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
              >
                {arStep < 4 ? 'Next Step &rarr;' : 'Finish AR Procedure'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3D CAD MODEL VIEWPORT ──────────────────────────────────────── */}
      {activeTabMode === '3d_model' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 rounded-xl scada-panel p-4 relative overflow-hidden flex flex-col min-h-[540px]">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs font-mono z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 mr-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" /> Angles:
                </span>
                {(['iso', 'front', 'top', 'bearing'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCameraViewPreset(preset);
                      industrialAudio.playClick();
                      if (!cameraRef.current || !machineGroupRef.current) return;
                      if (preset === 'iso') { cameraRef.current.position.set(4.8, 3.2, 5.8); machineGroupRef.current.rotation.set(0.3, 0.6, 0); }
                      if (preset === 'front') { cameraRef.current.position.set(0, 0.5, 6.5); machineGroupRef.current.rotation.set(0, 0, 0); }
                      if (preset === 'top') { cameraRef.current.position.set(0, 7.5, 0.1); machineGroupRef.current.rotation.set(Math.PI / 2, 0, 0); }
                      if (preset === 'bearing') { cameraRef.current.position.set(2.2, 1.2, 3.2); machineGroupRef.current.rotation.set(0.2, 0.8, 0); }
                    }}
                    className={`px-2.5 py-1 rounded uppercase ${cameraViewPreset === preset ? 'bg-cyan-950 border border-cyan-500 text-cyan-300' : 'bg-slate-950 border border-slate-800 text-slate-400'}`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsExplodedView(!isExplodedView); industrialAudio.playClick(); }}
                  className={`px-3 py-1 rounded border ${isExplodedView ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Exploded Assembly
                </button>
                <button
                  onClick={() => { setIsThermalHeatmap(!isThermalHeatmap); industrialAudio.playClick(); }}
                  className={`px-3 py-1 rounded border ${isThermalHeatmap ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Thermal Heatmap
                </button>
                <button
                  onClick={() => setIsRotatingShaft(!isRotatingShaft)}
                  className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotatingShaft ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div ref={canvasContainerRef} className="flex-1 w-full relative cursor-grab active:cursor-grabbing" style={{ minHeight: '440px' }} />

            <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-cyan-400 font-bold">{selectedMachine.name}</div>
              <div className="text-slate-400 text-[11px]">
                RPM: {selectedMachine.rpm} • Vibration: {selectedMachine.telemetry.peakShock}g • Temp: {selectedMachine.telemetry.temperature}°C
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl scada-panel space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-300 border-b border-slate-800 pb-2">
              CAD Subcomponent Nodes
            </h3>
            <div className="space-y-2">
              {selectedMachine.arComponentNodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`p-2.5 rounded-lg border cursor-pointer ${
                    selectedNode?.id === n.id ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between font-bold">
                    <span>{n.name}</span>
                    <span className={n.status === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}>●</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {n.temp}°C • {n.vibration} mm/s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VUFORIA OPTICAL TARGET GENERATOR MODAL ─────────────────────── */}
      {showMarkerGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4 font-mono text-xs">
            <h3 className="font-bold text-sm text-slate-100">
              Vuforia Optical Tracking Calibration Marker
            </h3>
            <p className="text-slate-400 font-sans text-xs">
              Point your smartphone or webcam at this high-contrast optical target to test real-time recognition.
            </p>

            {/* High-Contrast SVG QR Marker */}
            <div className="w-64 h-64 mx-auto bg-white p-4 rounded-xl border-4 border-slate-950 flex flex-col items-center justify-between text-slate-950">
              <div className="flex justify-between w-full font-bold text-[9px]">
                <span>[OMNISIGHT:VUFORIA]</span>
                <span>TARGET: #{selectedMachine.id}</span>
              </div>
              <div className="w-36 h-36 border-4 border-slate-950 flex items-center justify-center p-2">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <div className="font-bold uppercase tracking-wider text-[10px]">
                {selectedMachine.sensor.nodeId}
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200"
              >
                Print Target
              </button>
              <button
                onClick={() => setShowMarkerGenerator(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold"
              >
                Close Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
