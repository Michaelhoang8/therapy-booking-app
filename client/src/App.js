import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/LandingPage';
import ContactUs from './Pages/ContactUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;