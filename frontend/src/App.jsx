import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ConnectPage from './pages/ConnectPage';
import AnalysisPage from './pages/AnalysisPage';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
