import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SignIn } from './components/SignIn';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Machines } from './components/Machines';
import { MachineDetails } from './components/MachineDetails';
import { Analytics } from './components/Analytics';
import { DigitalTwin } from './components/DigitalTwin';
import { FactoryMap } from './components/FactoryMap';
import { Alerts } from './components/Alerts';
import { Maintenance } from './components/Maintenance';
import { AcademicReview } from './components/AcademicReview';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { ToastContainer } from './components/ToastContainer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab, isSidebarCollapsed } = useApp();

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background industrial grid */}
      <div className="fixed inset-0 bg-grid-industrial pointer-events-none opacity-40 z-0" />

      {/* Navigation: Sidebar & Fixed Top Header */}
      <Navigation />

      {/* Main Dynamic Viewport Container */}
      <main
        className={`relative z-10 pt-20 px-4 sm:px-6 lg:px-8 pb-12 transition-all duration-300 min-h-screen ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'home'            && <Dashboard />}
          {activeTab === 'machines'        && <Machines />}
          {activeTab === 'machine_details' && <MachineDetails />}
          {activeTab === 'analytics'       && <Analytics />}
          {activeTab === 'digital_twin'    && <DigitalTwin />}
          {activeTab === 'factory_map'     && <FactoryMap />}
          {activeTab === 'maintenance'     && <Maintenance />}
          {activeTab === 'alerts'          && <Alerts />}
          {activeTab === 'academic_review' && <AcademicReview />}
          {activeTab === 'profile'         && <Profile />}
          {activeTab === 'settings'        && <Settings />}
        </div>
      </main>

      {/* Global Command Palette & Toast Notifications */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
