import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LeadershipPage from './pages/LeadershipPage';
import EventsPage from './pages/EventsPage';
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

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/leadership" element={<LeadershipPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/get-involved" element={<GetInvolvedPage />} />
                <Route path="/donate" element={<DonationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/stories" element={<PeopleStoriesPage />} />
                <Route path="/login" element={<LoginPage />} />
                
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
                <Route 
                  path="/member/profile" 
                  element={
                    <ProtectedRoute requiredRole="member">
                      <MemberProfile />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          
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
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
