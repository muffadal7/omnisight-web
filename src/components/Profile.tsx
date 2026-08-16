import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Briefcase,
  Building,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Award,
  Edit3,
  Save,
  X,
  Users,
  UserCheck,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { userProfile, userAccounts, switchUserAccount, updateUserProfile, showToast } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [department, setDepartment] = useState(userProfile.department);
  const [phone, setPhone] = useState(userProfile.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, role, department, phone });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-display">
            User Account & Role Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Factory role authorization, specialized predictive maintenance duties, and credentials
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-lg shrink-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-400 text-slate-950 border border-slate-900">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1 flex-1">
            <h3 className="text-xl font-bold text-slate-100">{userProfile.name}</h3>
            <div className="text-xs font-mono text-cyan-400 flex items-center justify-center sm:justify-start gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{userProfile.role}</span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1 pt-1">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>{userProfile.department} • ID: {userProfile.employeeId}</span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => {
              setName(userProfile.name);
              setEmail(userProfile.email);
              setRole(userProfile.role);
              setDepartment(userProfile.department);
              setPhone(userProfile.phone);
              setIsEditModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Contact & Specialized Duties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Contact Coordinates</span>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{userProfile.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Authorized Operations</span>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              {userProfile.specializedDuties?.map((duty, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{duty}</span>
                </div>
              )) || <div className="text-slate-500">Standard operational clearance</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Switch Perspective Roster */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Switch Role Perspective
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {userAccounts.map((u) => (
            <div
              key={u.id}
              onClick={() => switchUserAccount(u.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                u.id === userProfile.id
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-200 truncate">{u.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono truncate">{u.role}</div>
              </div>
              {u.id === userProfile.id && <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100">Edit User Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Designation / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
