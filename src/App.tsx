import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';
import { ItemDetailsModal } from './components/items/ItemDetailsModal';
import { RecoveryRequestModal } from './components/recovery/RecoveryRequestModal';

import { HomePage } from './components/home/HomePage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { ReportLostPage } from './components/items/ReportLostPage';
import { ReportFoundPage } from './components/items/ReportFoundPage';
import { BrowseItemsPage } from './components/browse/BrowseItemsPage';
import { SmartMatchPage } from './components/matching/SmartMatchPage';
import { MyReportsPage } from './components/dashboard/MyReportsPage';
import { NotificationsPage } from './components/dashboard/NotificationsPage';
import { UserProfilePage } from './components/dashboard/UserProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top when view transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'login':
      case 'admin_login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <UserDashboard />;
      case 'report_lost':
        return <ReportLostPage />;
      case 'report_found':
        return <ReportFoundPage />;
      case 'browse':
        return <BrowseItemsPage />;
      case 'smart_match':
        return <SmartMatchPage />;
      case 'my_reports':
        return <MyReportsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'admin':
      case 'admin_dashboard':
      case 'admin_reports':
      case 'admin_users':
      case 'admin_recovery':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#172033] font-sans selection:bg-[#4169E1] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Interactive Global Modals */}
      <ItemDetailsModal />
      <RecoveryRequestModal />

      {/* Real-time Feedback Toasts */}
      <NotificationToast />

      {/* Campus Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
