import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Machine,
  Alert,
  MaintenanceOrder,
  UserProfile,
  AppSettings,
  MaintenanceStatus,
  ScreenTab,
  MQTTPacket
} from '../types';
import {
  initialMachines,
  initialAlerts,
  initialMaintenanceOrders,
  userAccounts as initialUserAccounts,
  defaultSettings,
  initialMqttPackets
} from '../services/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Auth & Multi-User Management
  isAuthenticated: boolean;
  userAccounts: UserProfile[];
  userProfile: UserProfile;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  switchUserAccount: (userId: string) => void;
  registerNewUser: (newUser: Omit<UserProfile, 'id' | 'stats'> & { password?: string }) => UserProfile;
  deleteUserAccount: (userId: string) => void;

  // Navigation
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  navigateToMachine: (id: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Data
  machines: Machine[];
  alerts: Alert[];
  maintenance: MaintenanceOrder[];
  settings: AppSettings;
  mqttPackets: MQTTPacket[];

  // Actions
  resolveAlert: (id: string) => void;
  markAlertRead: (id: string) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceStatus) => void;
  addMaintenanceOrder: (order: Omit<MaintenanceOrder, 'id' | 'createdDate'>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  resetAllData: () => void;
  triggerFaultSimulation: (machineId: string, faultType: 'bearing_wear' | 'shaft_misalignment' | 'thermal_overload' | 'restore_normal') => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Mobile Drawer
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;

  // Telemetry Live Toggle
  telemetryLive: boolean;
  setTelemetryLive: (live: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userAccountsList, setUserAccountsList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('omnisight_users_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialUserAccounts;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const activeId = localStorage.getItem('omnisight_active_user_id_v2');
    if (activeId) {
      const found = userAccountsList.find((u) => u.id === activeId);
      if (found) return found;
    }
    return userAccountsList[0] || initialUserAccounts[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('omnisight_auth_v2');
    return savedAuth !== null ? savedAuth === 'true' : true; // default logged in for review
  });

  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('M-01');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [telemetryLive, setTelemetryLive] = useState<boolean>(true);

  const [machines, setMachines] = useState<Machine[]>(() => {
    const saved = localStorage.getItem('omnisight_machines_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialMachines;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('omnisight_alerts_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialAlerts;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceOrder[]>(() => {
    const saved = localStorage.getItem('omnisight_orders_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialMaintenanceOrders;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('omnisight_settings_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultSettings;
  });

  const [mqttPackets, setMqttPackets] = useState<MQTTPacket[]>(initialMqttPackets);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('omnisight_users_v2', JSON.stringify(userAccountsList));
  }, [userAccountsList]);

  useEffect(() => {
    localStorage.setItem('omnisight_active_user_id_v2', userProfile.id);
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('omnisight_auth_v2', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('omnisight_machines_v2', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('omnisight_alerts_v2', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('omnisight_orders_v2', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('omnisight_settings_v2', JSON.stringify(settings));
  }, [settings]);

  // Live Telemetry Simulation Engine (Every 1.5 seconds)
  useEffect(() => {
    if (!telemetryLive || settings.telemetryPaused) return;

    const interval = setInterval(() => {
      setMachines((prev) =>
        prev.map((m) => {
          // Add subtle natural jitter based on health status
          const jitterAmp = m.status === 'critical' ? 0.25 : m.status === 'warning' ? 0.12 : 0.04;
          const deltaX = (Math.random() - 0.5) * jitterAmp;
          const deltaY = (Math.random() - 0.5) * jitterAmp;
          const deltaZ = (Math.random() - 0.5) * jitterAmp;
          const newX = Math.max(0.2, Number((m.telemetry.vibrationXYZ.x + deltaX).toFixed(2)));
          const newY = Math.max(0.2, Number((m.telemetry.vibrationXYZ.y + deltaY).toFixed(2)));
          const newZ = Math.max(0.2, Number((m.telemetry.vibrationXYZ.z + deltaZ).toFixed(2)));
          const newTotal = Number(Math.sqrt(newX * newX + newY * newY + newZ * newZ).toFixed(2));

          const tempDelta = (Math.random() - 0.48) * 0.15;
          const newTemp = Number((m.telemetry.temperature + tempDelta).toFixed(1));

          // Jitter crest factor and kurtosis slightly
          const crestDelta = (Math.random() - 0.5) * 0.05;
          const newCrest = Math.max(1.5, Number((m.telemetry.crestFactor + crestDelta).toFixed(2)));

          const kurtDelta = (Math.random() - 0.5) * 0.08;
          const newKurt = Math.max(2.0, Number((m.telemetry.kurtosis + kurtDelta).toFixed(2)));

          // Update recent history
          const updatedHistory1H = [...m.history1H.slice(1), m.healthScore];

          return {
            ...m,
            telemetry: {
              ...m.telemetry,
              vibrationXYZ: { x: newX, y: newY, z: newZ },
              totalVibration: newTotal,
              temperature: newTemp,
              crestFactor: newCrest,
              kurtosis: newKurt,
              variance: Number((newTotal * 0.45).toFixed(2)),
              mav: Number((newTotal * 0.72).toFixed(2))
            },
            history1H: updatedHistory1H,
            sensor: {
              ...m.sensor,
              lastPing: 'Just now'
            }
          };
        })
      );

      // Generate a new live MQTT packet for stream inspector
      const randomMachine = machines[Math.floor(Math.random() * machines.length)];
      if (randomMachine) {
        const now = new Date();
        const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
        const newPacket: MQTTPacket = {
          id: `pkt-${Date.now()}`,
          timestamp: timeStr,
          topic: randomMachine.sensor.mqttTopic,
          nodeId: randomMachine.sensor.nodeId,
          payload: JSON.stringify({
            rms: randomMachine.telemetry.rms,
            peak: randomMachine.telemetry.peakShock,
            crest: randomMachine.telemetry.crestFactor,
            kurt: randomMachine.telemetry.kurtosis,
            temp: randomMachine.telemetry.temperature,
            total: randomMachine.telemetry.totalVibration
          }),
          qos: randomMachine.status === 'critical' ? 2 : 1,
          latencyMs: Math.floor(Math.random() * 10) + 10
        };

        setMqttPackets((prev) => [newPacket, ...prev.slice(0, 24)]);
      }
    }, settings.telemetryUpdateMs || 1500);

    return () => clearInterval(interval);
  }, [telemetryLive, settings.telemetryPaused, settings.telemetryUpdateMs, machines]);

  // Toast functions
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateToMachine = (id: string) => {
    setSelectedMachineId(id);
    setActiveTab('machine_details');
  };

  const login = (email: string) => {
    const found = userAccountsList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUserProfile(found);
      setIsAuthenticated(true);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    // Generic fallback login
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Staff Engineer',
      roleCategory: 'lead_engineer',
      department: 'Department of Computer Networking',
      employeeId: `PSG-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: '+91 98422 00000',
      stats: { alertsResolved: 0, tasksCompleted: 0, uptimePercent: 100 }
    };
    setUserAccountsList((prev) => [...prev, newUser]);
    setUserProfile(newUser);
    setIsAuthenticated(true);
    showToast(`Logged in as ${newUser.name}`, 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out successfully.', 'info');
  };

  const switchUserAccount = (userId: string) => {
    const found = userAccountsList.find((u) => u.id === userId);
    if (found) {
      setUserProfile(found);
      showToast(`Switched perspective to ${found.name} (${found.role})`, 'info');
    }
  };

  const registerNewUser = (newUser: Omit<UserProfile, 'id' | 'stats'> & { password?: string }): UserProfile => {
    const created: UserProfile = {
      ...newUser,
      id: `u-${Date.now()}`,
      stats: { alertsResolved: 0, tasksCompleted: 0, uptimePercent: 100 }
    };
    setUserAccountsList((prev) => [...prev, created]);
    setUserProfile(created);
    showToast(`New user ${created.name} registered!`, 'success');
    return created;
  };

  const deleteUserAccount = (userId: string) => {
    if (userAccountsList.length <= 1) {
      showToast('Cannot delete the last remaining user account.', 'error');
      return;
    }
    const filtered = userAccountsList.filter((u) => u.id !== userId);
    setUserAccountsList(filtered);
    if (userProfile.id === userId) {
      setUserProfile(filtered[0]);
    }
    showToast('User account deleted.', 'info');
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
    showToast('Alert resolved and archived to compliance audit log.', 'success');
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'read' as const } : a))
    );
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceStatus) => {
    setMaintenance((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    showToast(`Work order status updated to ${status.replace('_', ' ').toUpperCase()}`, 'success');
  };

  const addMaintenanceOrder = (order: Omit<MaintenanceOrder, 'id' | 'createdDate'>) => {
    const newOrder: MaintenanceOrder = {
      ...order,
      id: `WO-${Math.floor(800 + Math.random() * 100)}`,
      createdDate: 'Today'
    };
    setMaintenance((prev) => [newOrder, ...prev]);
    showToast(`Work order ${newOrder.id} dispatched to field technician.`, 'success');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile };
      setUserAccountsList((list) => list.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    });
    showToast('Profile updated successfully.', 'success');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('System configuration saved.', 'success');
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // Live Evaluator Fault Injection Engine
  const triggerFaultSimulation = (
    machineId: string,
    faultType: 'bearing_wear' | 'shaft_misalignment' | 'thermal_overload' | 'restore_normal'
  ) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;

        if (faultType === 'restore_normal') {
          return {
            ...m,
            healthScore: 94,
            status: 'healthy',
            telemetry: {
              ...m.telemetry,
              crestFactor: 2.1,
              peakShock: 2.3,
              rms: 1.8,
              kurtosis: 2.9,
              temperature: 38.5,
              totalVibration: 1.87
            },
            aiPrediction: {
              ...m.aiPrediction,
              condition: 'Optimal Baseline Operation Restored',
              faultClass: 'normal',
              risk: 'low',
              confidence: 97.2,
              timeToFailureEst: '> 1,200 hrs',
              rulHours: 1200
            }
          };
        }

        if (faultType === 'bearing_wear') {
          return {
            ...m,
            healthScore: 38,
            status: 'critical',
            telemetry: {
              ...m.telemetry,
              crestFactor: 5.9,
              peakShock: 7.8,
              rms: 6.2,
              kurtosis: 7.4,
              temperature: 71.5,
              totalVibration: 7.95
            },
            aiPrediction: {
              ...m.aiPrediction,
              condition: 'SIMULATED FAULT: Accelerated Bearing Outer Race Spalling (BPFO)',
              faultClass: 'bearing_wear',
              risk: 'high',
              confidence: 98.4,
              recommendedAction: 'Emergency shutdown triggered in simulation. Replace bearing housing.',
              timeToFailureEst: '12 Hours',
              rulHours: 12
            }
          };
        }

        if (faultType === 'shaft_misalignment') {
          return {
            ...m,
            healthScore: 62,
            status: 'warning',
            telemetry: {
              ...m.telemetry,
              crestFactor: 4.2,
              peakShock: 5.1,
              rms: 4.0,
              kurtosis: 4.8,
              temperature: 55.0,
              totalVibration: 4.35
            },
            aiPrediction: {
              ...m.aiPrediction,
              condition: 'SIMULATED FAULT: Shaft Angular Coupling Misalignment (2X Harmonic)',
              faultClass: 'shaft_misalignment',
              risk: 'medium',
              confidence: 91.0,
              recommendedAction: 'Perform laser dial indicator realignment on flexible coupling.',
              timeToFailureEst: '3 Days',
              rulHours: 72
            }
          };
        }

        if (faultType === 'thermal_overload') {
          return {
            ...m,
            healthScore: 52,
            status: 'warning',
            telemetry: {
              ...m.telemetry,
              temperature: 84.5,
              crestFactor: 3.5,
              peakShock: 4.2,
              totalVibration: 3.9
            },
            aiPrediction: {
              ...m.aiPrediction,
              condition: 'SIMULATED FAULT: Stator Winding Thermal Overload (+32°C Drift)',
              faultClass: 'thermal_overload',
              risk: 'medium',
              confidence: 94.2,
              recommendedAction: 'Check forced air cooling ducts and motor thermal overload relay.',
              timeToFailureEst: '24 Hours',
              rulHours: 24
            }
          };
        }

        return m;
      })
    );

    // Create an alert automatically
    if (faultType !== 'restore_normal') {
      const targetMachine = machines.find((m) => m.id === machineId);
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        machineId,
        machineName: targetMachine ? targetMachine.name : machineId,
        severity: faultType === 'bearing_wear' ? 'critical' : 'warning',
        title: `[Fault Simulation] ${faultType.replace('_', ' ').toUpperCase()}`,
        description: `Evaluator injected ${faultType.replace('_', ' ')} fault condition into ${targetMachine?.name}. Telemetry immediately shifted.`,
        timestamp: 'Just now',
        status: 'unread',
        recommendedAction: 'Inspect 3D Digital Twin and 8-Feature Time-Domain radar to observe parameter shifts.',
        featureTriggered: 'Evaluator Sandbox'
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`Fault injected into ${targetMachine?.name || machineId}! Telemetry updated in real-time.`, 'warning');
    } else {
      showToast(`Machine ${machineId} restored to healthy baseline!`, 'success');
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('omnisight_machines_v2');
    localStorage.removeItem('omnisight_alerts_v2');
    localStorage.removeItem('omnisight_orders_v2');
    localStorage.removeItem('omnisight_users_v2');
    localStorage.removeItem('omnisight_settings_v2');
    setMachines(initialMachines);
    setAlerts(initialAlerts);
    setMaintenance(initialMaintenanceOrders);
    setUserAccountsList(initialUserAccounts);
    setUserProfile(initialUserAccounts[0]);
    setSettings(defaultSettings);
    showToast('System data reset to default factory state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userAccounts: userAccountsList,
        userProfile,
        login,
        logout,
        switchUserAccount,
        registerNewUser,
        deleteUserAccount,
        activeTab,
        setActiveTab,
        selectedMachineId,
        setSelectedMachineId,
        navigateToMachine,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
        machines,
        alerts,
        maintenance,
        settings,
        mqttPackets,
        resolveAlert,
        markAlertRead,
        updateMaintenanceStatus,
        addMaintenanceOrder,
        updateUserProfile,
        updateSettings,
        toggleTheme,
        resetAllData,
        triggerFaultSimulation,
        toasts,
        showToast,
        removeToast,
        isDrawerOpen,
        setIsDrawerOpen,
        telemetryLive,
        setTelemetryLive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
