#!/bin/bash
cd src/pages

# Create each page file
for page in NearMe Crops Dashboard Fertilizer SoilPassport CropPlanner Livestock MarketPrices FarmLedger CropPassport Schemes Community Weather SensorLab IrrigationPlanner HarvestRecords ProfileSettings VoiceNotes LoanEligibility InputMarketplace TrainingCenter DocumentWallet InsuranceHub InventoryTracker TaskManager AlertsCenter PestLibrary SustainabilityScore ExpertDirectory SuccessStories FarmNotifications VendorContacts; do
  cat > "${page}.jsx" << 'PAGE_EOF'
import React from 'react';
import PlaceholderPage from './Placeholder.jsx';

export default function PAGE_NAME() {
  const titles = {
    NearMe: '📍 Near Me',
    Crops: '🌾 My Crops',
    Dashboard: '📊 Dashboard',
    Fertilizer: '💧 Fertilizer Calculator',
    SoilPassport: '🌱 Soil Passport',
    CropPlanner: '📈 Crop Planner',
    Livestock: '🐄 Livestock Care',
    MarketPrices: '📦 Market Prices',
    FarmLedger: '📒 Farm Ledger',
    CropPassport: '🛡️ Crop Passport',
    Schemes: '🏛️ Government Schemes',
    Community: '💬 Community',
    Weather: '🌤️ Weather',
    SensorLab: '🧪 Sensor Lab',
    IrrigationPlanner: '💧 Irrigation Planner',
    HarvestRecords: '🌾 Harvest Records',
    ProfileSettings: '👤 Profile Settings',
    VoiceNotes: '🎤 Voice Notes',
    LoanEligibility: '💰 Loan Eligibility',
    InputMarketplace: '🏪 Input Marketplace',
    TrainingCenter: '🎓 Training Center',
    DocumentWallet: '📁 Document Wallet',
    InsuranceHub: '🛡️ Insurance Hub',
    InventoryTracker: '📦 Inventory Tracker',
    TaskManager: '✅ Task Manager',
    AlertsCenter: '🔔 Alerts Center',
    PestLibrary: '🐛 Pest Library',
    SustainabilityScore: '🌿 Sustainability Score',
    ExpertDirectory: '👨‍🌾 Expert Directory',
    SuccessStories: '🏆 Success Stories',
    FarmNotifications: '🔔 Farm Notifications',
    VendorContacts: '📞 Vendor Contacts',
  };
  const descriptions = {
    NearMe: 'Find agricultural services and resources near you',
    Crops: 'Manage your crop inventory and planning',
    Dashboard: 'Overview of your farm analytics',
    Fertilizer: 'Calculate fertilizer dosage for your crops',
    SoilPassport: 'Track soil health over time',
    CropPlanner: 'Plan your crop cycles',
    Livestock: 'Track animal health and care',
    MarketPrices: 'Real-time crop prices',
    FarmLedger: 'Track farm expenses and revenue',
    CropPassport: 'Blockchain-verified crop records',
    Schemes: 'Find eligible government schemes',
    Community: 'Connect with other farmers',
    Weather: 'Weather forecasts and alerts',
    SensorLab: 'IoT sensor integration for smart farming',
    IrrigationPlanner: 'Plan and track irrigation',
    HarvestRecords: 'Track harvest yields over time',
    ProfileSettings: 'Manage your personal information',
    VoiceNotes: 'Record voice memos for your farm',
    LoanEligibility: 'Check loan eligibility',
    InputMarketplace: 'Find verified local shops for inputs',
    TrainingCenter: 'Learn modern farming techniques',
    DocumentWallet: 'Store important documents securely',
    InsuranceHub: 'Manage crop insurance',
    InventoryTracker: 'Track farm inventory',
    TaskManager: 'Manage farm tasks',
    AlertsCenter: 'View all alerts in one place',
    PestLibrary: 'Identify pests and diseases',
    SustainabilityScore: 'Track your farm sustainability',
    ExpertDirectory: 'Find agricultural experts',
    SuccessStories: 'Learn from fellow farmers',
    FarmNotifications: 'Set up farm reminders',
    VendorContacts: 'Manage vendor contacts',
  };
  const pageName = 'PAGE_NAME';
  return <PlaceholderPage title={titles[pageName] || pageName} icon="" description={descriptions[pageName] || 'Coming soon'} />;
}
PAGE_EOF

  # Replace PAGE_NAME with actual page name
  sed -i '' "s/PAGE_NAME/${page}/g" "${page}.jsx"
  echo "Created ${page}.jsx"
done
