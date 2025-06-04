import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { AuthProvider } from './contexts/AuthContext';
import FarmerAuth from './pages/FarmerAuth';
import RetailerAuth from './pages/RetailerAuth';
import NgoAuth from './pages/NgoAuth';
import Home from './pages/Home';
import FarmerDashboard from './pages/FarmerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import NgoDashboard from './pages/NgoDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRoleProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/farmer-auth" element={<FarmerAuth />} />
            <Route path="/retailer-auth" element={<RetailerAuth />} />
            <Route path="/ngo-auth" element={<NgoAuth />} />
            
            <Route path="/farmer-dashboard" element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/retailer-dashboard" element={
              <ProtectedRoute role="retailer">
                <RetailerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/ngo-dashboard" element={
              <ProtectedRoute role="ngo">
                <NgoDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserRoleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;