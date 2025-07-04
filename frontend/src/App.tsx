import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalStyle } from './styles/GlobalStyles';
import { Header } from './components/Header';
import { Shop } from './components/Shop';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';

// Protected Route component for admin pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

// Simple About page
const About: React.FC = () => (
  <div style={{ padding: '4rem 0', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
    <h1>About JB's Tire & Auto</h1>
    <p style={{ fontSize: '1.125rem', lineHeight: '1.6', margin: '2rem 0' }}>
      Welcome to JB's Tire & Auto, your trusted local source for quality tires and automotive services. 
      We've been serving our community with top-brand tires, expert installation, and reliable service.
    </p>
    <p style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
      Whether you need new tires, rims, or automotive accessories, we have the expertise and inventory 
      to keep you safely on the road.
    </p>
  </div>
);

// Simple Contact page
const Contact: React.FC = () => (
  <div style={{ padding: '4rem 0', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
    <h1>Contact Us</h1>
    <div style={{ fontSize: '1.125rem', lineHeight: '1.8', margin: '2rem 0' }}>
      <p><strong>Phone:</strong> (555) 123-4567</p>
      <p><strong>Email:</strong> info@jbstireandauto.com</p>
      <p><strong>Address:</strong> 123 Main Street, Your City, ST 12345</p>
      <p><strong>Hours:</strong> Mon-Fri 8AM-6PM, Sat 9AM-4PM</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
