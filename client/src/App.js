import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/LandingPage';
import ContactUs from './Pages/ContactUs';
import MyAccount from './Pages/MyAccount';
import ContactUs2 from './Pages/ContactUs2';
import ManageAppointments from './Pages/ManageAppointments';
import BookAppointment from './Pages/BookAppointment';
import RescheduleAppointment from './Pages/RescheduleAppointment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/contact-us2" element={<ContactUs2 />} />
        <Route path="/manage-appointment" element={<ManageAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} /> {/* Route to BookAppointment */}
        <Route path="/reschedule-appointment" element={<RescheduleAppointment />} /> {/* Route to RescheduleAppointment */}
      </Routes>
    </Router>
  );
}

export default App;