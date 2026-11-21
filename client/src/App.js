import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TherapistDashboard from './Pages/TherapistDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import LandingPage from './Pages/LandingPage';
import ContactUs from './Pages/ContactUs';
import MyAccount from './Pages/MyAccount';
import ContactUs2 from './Pages/ContactUs2';
import ManageAppointments from './Pages/ManageAppointments';
import BookAppointment from './Pages/BookAppointment';
import RescheduleAppointment from './Pages/RescheduleAppointment';
import ManageReviews from './Pages/ManageReviews';
import ViewReviews from './Pages/ViewReviews';
import Notifications from './Pages/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/therapist" element={<TherapistDashboard />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/contact-us2" element={<ContactUs2 />} />
        <Route path="/manage-appointment" element={<ManageAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/reschedule-appointment" element={<RescheduleAppointment />} />
        <Route path="/manage-reviews" element={<ManageReviews />} />
        <Route path="/view-reviews" element={<ViewReviews />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;