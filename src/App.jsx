import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AiSymptomCheckerInterface from './pages/AiSymptomCheckerInterface';
import AiXRayAnalysisTool from './pages/AiXRayAnalysisTool';
import EmergencyClinicLocator from './pages/EmergencyClinicLocator';
import FirstAidKnowledgeBase from './pages/FirstAidKnowledgeBase';
import HealthReportsAnalytics from './pages/HealthReportsAnalytics';
import MainWellnessDashboard from './pages/MainWellnessDashboard';
import MedicationManagerCalendar from './pages/MedicationManagerCalendar';
import PatientProfileRecords from './pages/PatientProfileRecords';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import MyHealthOverview from './pages/MyHealthOverview';
import FloatingChatbotProvider from './components/FloatingChatbotProvider';

const LayoutContainer = ({ children }) => {
  return (
    <div className="relative">
      <FloatingChatbotProvider>
        {children}
      </FloatingChatbotProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
      <LayoutContainer>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/ai-symptom-checker-interface" element={<AiSymptomCheckerInterface />} />
          <Route path="/ai-x-ray-analysis-tool" element={<AiXRayAnalysisTool />} />
          <Route path="/emergency-clinic-locator" element={<EmergencyClinicLocator />} />
          <Route path="/first-aid-knowledge-base" element={<FirstAidKnowledgeBase />} />
          <Route path="/health-reports-analytics" element={<HealthReportsAnalytics />} />
          <Route path="/dashboard" element={<MainWellnessDashboard />} />
          <Route path="/main-wellness-dashboard" element={<MainWellnessDashboard />} />
          <Route path="/medication-manager-calendar" element={<MedicationManagerCalendar />} />
          <Route path="/patient-profile-records" element={<PatientProfileRecords />} />
          <Route path="/my-health" element={<MyHealthOverview />} />
        </Routes>
      </LayoutContainer>
      </AuthProvider>
    </Router>
  );
}

export default App;
