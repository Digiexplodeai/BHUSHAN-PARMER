/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Treatments from './pages/Treatments';
import PrecisionOncology from './pages/PrecisionOncology';
import PatientStories from './pages/PatientStories';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminHomePage from './admin/AdminHomePage';
import AdminAppointments from './admin/AdminAppointments';
import AdminHighlights from './admin/AdminHighlights';
import AdminTreatments from './admin/AdminTreatments';
import AdminAbout from './admin/AdminAbout';
import AdminPrecisionOncology from './admin/AdminPrecisionOncology';
import AdminPatientStories from './admin/AdminPatientStories';
import AdminBlogs from './admin/AdminBlogs';
import AdminSettings from './admin/AdminSettings';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="home" element={<AdminHomePage />} />
          <Route path="highlights" element={<AdminHighlights />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="treatments" element={<AdminTreatments />} />
          <Route path="precision-oncology" element={<AdminPrecisionOncology />} />
          <Route path="patient-stories" element={<AdminPatientStories />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="precision-oncology" element={<PrecisionOncology />} />
          <Route path="patient-stories" element={<PatientStories />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}
