import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { CelebrationProvider, useCelebration } from './contexts/CelebrationContext';
import { LogoProvider, useLogo } from './contexts/LogoContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ConfettiAnimation from './components/common/ConfettiAnimation';
import ScrollToTop from './components/common/ScrollToTop';
import DynamicFavicon from './components/common/DynamicFavicon';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LeadershipPage from './pages/LeadershipPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import GalleryPage from './pages/GalleryPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import DonationPage from './pages/DonationPage';
import ContactPage from './pages/ContactPage';
import PeopleStoriesPage from './pages/PeopleStoriesPage';
import AdminPanel from './pages/AdminPanel';
import MemberPortal from './pages/MemberPortal';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import MemberProfile from './pages/MemberProfile';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import LegalNoticesPage from './pages/LegalNoticesPage';
import StoryDetailsPage from './pages/StoryDetailsPage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppContent() {
  const { confettiTrigger } = useCelebration();
  const { logoUrl } = useLogo();

  return (
    <Router>
      <ScrollToTop />
      <DynamicFavicon logoUrl={logoUrl} />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/get-involved" element={<GetInvolvedPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/stories" element={<PeopleStoriesPage />} />
            <Route path="/stories/:id" element={<StoryDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/legal" element={<LegalNoticesPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/member/*" 
              element={
                <ProtectedRoute requiredRole="member">
                  <MemberPortal />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      
      {/* Confetti Animation */}
      <ConfettiAnimation trigger={confettiTrigger} />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CelebrationProvider>
          <LogoProvider>
            <AppContent />
          </LogoProvider>
        </CelebrationProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
