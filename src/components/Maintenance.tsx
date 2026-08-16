import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Package,
  Calendar,
  X,
  Sparkles,
  Shield,
  ArrowRight
} from 'lucide-react';
import { MaintenanceOrder, PriorityLevel, MaintenanceStatus } from '../types';

export const Maintenance: React.FC = () => {
  const { maintenance, machines, addMaintenanceOrder, updateMaintenanceStatus, showToast } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || 'M-01');
  const [issueTitle, setIssueTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [assignedTo, setAssignedTo] = useState('Muffadal (Vibration Specialist)');
  const [dueDate, setDueDate] = useState('Tomorrow, 10:00 AM');
  const [estimatedHours, setEstimatedHours] = useState(2.5);
  const [sparePart, setSparePart] = useState('');
  const [sparePartsList, setSparePartsList] = useState<string[]>(['SKF 6208-2RS Bearing', 'Shell Gadus S2 V220 Grease']);

  const columns: { status: MaintenanceStatus; label: string; color: string; border: string }[] = [
    { status: 'pending', label: 'Pending Dispatch', color: 'text-amber-400', border: 'border-amber-500/40' },
    { status: 'in_progress', label: 'Active In-Progress', color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { status: 'scheduled', label: 'Scheduled Maintenance', color: 'text-indigo-400', border: 'border-indigo-500/40' },
    { status: 'completed', label: 'Completed & Verified', color: 'text-emerald-400', border: 'border-emerald-500/40' }
  ];

  const handleAddSparePart = () => {
    if (sparePart.trim()) {
      setSparePartsList([...sparePartsList, sparePart.trim()]);
      setSparePart('');
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) {
      showToast('Please enter an issue description.', 'error');
      return;
    }

    const machine = machines.find((m) => m.id === selectedMachineId);
    addMaintenanceOrder({
      machineId: selectedMachineId,
      machineName: machine ? machine.name : selectedMachineId,
      issue: issueTitle,
      priority,
      dueDate,
      status: 'pending',
      assignedTo,
      notes: `Dispatched from Smart Maintenance Console. Est. Duration: ${estimatedHours} hrs.`,
      estimatedHours,
      spareParts: sparePartsList
    });

    setIsCreateModalOpen(false);
    setIssueTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
              Smart Maintenance & Work Order Kanban
            </h2>
            <p className="text-xs text-slate-400">
              Proactive work order dispatch, technician allocations, and spare parts inventory tracking
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* ── KANBAN COLUMNS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colOrders = maintenance.filter((o) => o.status === col.status);
          return (
            <div
              key={col.status}
              className={`p-4 rounded-2xl bg-slate-900/50 border ${col.border} flex flex-col justify-between min-h-[500px]`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className={`font-bold text-xs uppercase tracking-wider font-mono ${col.color}`}>
                    {col.label}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                    {colOrders.length}
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {colOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">
                          {order.id}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                            order.priority === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : order.priority === 'high'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {order.priority}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-slate-200 leading-snug">{order.issue}</h4>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          {order.machineName} ({order.machineId})
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <User className="w-3 h-3 text-cyan-400" />
                          <span className="truncate">{order.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Due: {order.dueDate}</span>
                        </div>
                      </div>

                      {/* Status Transition Buttons */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1 text-[10px] font-mono">
                        {order.status !== 'in_progress' && order.status !== 'completed' && (
                          <button
                            onClick={() => updateMaintenanceStatus(order.id, 'in_progress')}
                            className="flex-1 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50"
                          >
                            Start Work &rarr;
                          </button>
                        )}
                        {order.status === 'in_progress' && (
                          <button
                            onClick={() => updateMaintenanceStatus(order.id, 'completed')}
                            className="flex-1 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50"
                          >
                            ✓ Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CREATE WORK ORDER MODAL ────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Dispatch Industrial Work Order
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Asset</label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.name} ({m.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Issue Title / Diagnostic Reason</label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. Replace Spindle Angular Contact Bearing Pair (SKF 7014)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Lead Assignee</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-600/30"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
