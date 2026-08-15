import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Camera, User, MapPin, Mic, Sprout, Droplets, Wallet, Stethoscope, TrendingUp, FlaskConical, ShieldCheck, Landmark, Wheat, MessageSquare, CloudRain, Store, FolderArchive, ShieldPlus, Package, FileDown, Activity, Calculator, Tractor, ListTodo, GraduationCap, BarChart3, LifeBuoy, Bug, Gauge, UserCheck, Trophy, BellRing, Contact, Bell, FileSpreadsheet, Sun } from 'lucide-react';
import './index.css';
import { LanguageProvider, useLang } from './lib/i18n';

// Import ALL pages
import HomePage from './pages/Home';
import DiagnosePage from './pages/Diagnose';
import NearMePage from './pages/NearMe';
import DashboardPage from './pages/Dashboard';
import MarketPricesPage from './pages/MarketPrices';
import IrrigationPlannerPage from './pages/IrrigationPlanner';
import HarvestRecordsPage from './pages/HarvestRecords';
import FertilizePage from './pages/Fertilize';
import SoilPassportPage from './pages/SoilPassport';
import CropPlannerPage from './pages/CropPlanner';
import BeyondCropsPage from './pages/BeyondCrops';
import LivestockCarePage from './pages/LivestockCare';
import TreatmentsPage from './pages/Treatments';
import SensorLabPage from './pages/SensorLab';
import FarmLedgerPage from './pages/FarmLedger';
import CropPassportPage from './pages/CropPassport';
import GovernmentSchemesPage from './pages/GovernmentSchemes';
import ProfileSettingsPage from './pages/ProfileSettings';
import VoiceNotesPage from './pages/VoiceNotes';
import LoanEligibilityPage from './pages/LoanEligibility';
import CommunityForumPage from './pages/CommunityForum';
import WeatherAlertsPage from './pages/WeatherAlerts';
import InputMarketplacePage from './pages/InputMarketplace';
import TrainingCenterPage from './pages/TrainingCenter';
import DocumentWalletPage from './pages/DocumentWallet';
import InsuranceHubPage from './pages/InsuranceHub';
import InventoryTrackerPage from './pages/InventoryTracker';
import ExportReportsPage from './pages/ExportReports';
import SensorHubPage from './pages/SensorHub';
import LoanCalculatorPage from './pages/LoanCalculator';
import ResourceMarketplacePage from './pages/ResourceMarketplace';
import TaskManagerPage from './pages/TaskManager';
import TrainingAcademyPage from './pages/TrainingAcademy';
import ExpenseAnalyticsPage from './pages/ExpenseAnalytics';
import YieldBenchmarksPage from './pages/YieldBenchmarks';
import SupportTicketsPage from './pages/SupportTickets';
import EquipmentRegistryPage from './pages/EquipmentRegistry';
import AlertsCenterPage from './pages/AlertsCenter';
import PestLibraryPage from './pages/PestLibrary';
import SustainabilityScorePage from './pages/SustainabilityScore';
import ExportDataPage from './pages/ExportData';
import ExpertDirectoryPage from './pages/ExpertDirectory';
import InsuranceVaultPage from './pages/InsuranceVault';
import FeedbackCornerPage from './pages/FeedbackCorner';
import SuccessStoriesPage from './pages/SuccessStories';
import WeatherAnalyticsPage from './pages/WeatherAnalytics';
import FarmNotificationsPage from './pages/FarmNotifications';
import VendorContactsPage from './pages/VendorContacts';
import AgriHelperPage from './pages/AgriHelper';

const Layout = ({ children }) => {
  const location = useLocation();
  const { t } = useLang();
  const [showMic, setShowMic] = useState(false);
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/diagnose', icon: Camera, label: 'Diagnose' },
    { path: '/near-me', icon: MapPin, label: 'Near Me' },
    { path: '/crops', icon: Sprout, label: 'Crops' },
    { path: '/dashboard', icon: User, label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <button onClick={() => setShowMic(!showMic)} className="fixed bottom-24 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 hover:scale-110">
        <Mic size={28} />
      </button>
      {showMic && (
        <div className="fixed bottom-36 right-6 z-50 bg-white rounded-2xl shadow-2xl p-4 w-72 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{t('listening')}</span>
            <span className="text-xs text-gray-400 ml-auto">{t('tapToSpeak')}</span>
          </div>
          <div className="mt-3 h-12 bg-gray-100 rounded-xl flex items-center px-3">
            <span className="text-gray-500 text-sm">{t('askAnything')}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <button className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">{t('crop')}</button>
            <button className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">{t('livestock')}</button>
            <button className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">{t('weather')}</button>
          </div>
        </div>
      )}
      <div className="pb-16">{children}</div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                <Icon size={24} className={isActive ? 'stroke-2' : 'stroke-1'} />
                <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnose" element={<DiagnosePage />} />
            <Route path="/near-me" element={<NearMePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Working Pages */}
            <Route path="/market-prices" element={<MarketPricesPage />} />
            <Route path="/irrigation-planner" element={<IrrigationPlannerPage />} />
            <Route path="/harvest-records" element={<HarvestRecordsPage />} />
            
            {/* Coming Soon Pages */}
            <Route path="/crops" element={<CropPlannerPage />} />
            <Route path="/fertilize" element={<FertilizePage />} />
            <Route path="/soil-passport" element={<SoilPassportPage />} />
            <Route path="/beyond-crops" element={<BeyondCropsPage />} />
            <Route path="/livestock-care" element={<LivestockCarePage />} />
            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/sensor-lab" element={<SensorLabPage />} />
            <Route path="/farm-ledger" element={<FarmLedgerPage />} />
            <Route path="/crop-passport" element={<CropPassportPage />} />
            <Route path="/schemes" element={<GovernmentSchemesPage />} />
            <Route path="/profile-settings" element={<ProfileSettingsPage />} />
            <Route path="/voice-notes" element={<VoiceNotesPage />} />
            <Route path="/loan-eligibility" element={<LoanEligibilityPage />} />
            <Route path="/community-forum" element={<CommunityForumPage />} />
            <Route path="/weather-alerts" element={<WeatherAlertsPage />} />
            <Route path="/input-marketplace" element={<InputMarketplacePage />} />
            <Route path="/training-center" element={<TrainingCenterPage />} />
            <Route path="/document-wallet" element={<DocumentWalletPage />} />
            <Route path="/insurance-hub" element={<InsuranceHubPage />} />
            <Route path="/inventory-tracker" element={<InventoryTrackerPage />} />
            <Route path="/export-reports" element={<ExportReportsPage />} />
            <Route path="/sensor-hub" element={<SensorHubPage />} />
            <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
            <Route path="/marketplace" element={<ResourceMarketplacePage />} />
            <Route path="/task-manager" element={<TaskManagerPage />} />
            <Route path="/training-academy" element={<TrainingAcademyPage />} />
            <Route path="/expense-analytics" element={<ExpenseAnalyticsPage />} />
            <Route path="/yield-benchmarks" element={<YieldBenchmarksPage />} />
            <Route path="/support-tickets" element={<SupportTicketsPage />} />
            <Route path="/equipment-registry" element={<EquipmentRegistryPage />} />
            <Route path="/alerts-center" element={<AlertsCenterPage />} />
            <Route path="/pest-library" element={<PestLibraryPage />} />
            <Route path="/sustainability-score" element={<SustainabilityScorePage />} />
            <Route path="/export-data" element={<ExportDataPage />} />
            <Route path="/expert-directory" element={<ExpertDirectoryPage />} />
            <Route path="/insurance-vault" element={<InsuranceVaultPage />} />
            <Route path="/feedback-corner" element={<FeedbackCornerPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/weather-analytics" element={<WeatherAnalyticsPage />} />
            <Route path="/farm-notifications" element={<FarmNotificationsPage />} />
            <Route path="/vendor-contacts" element={<VendorContactsPage />} />
            <Route path="/agrihelper" element={<AgriHelperPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
