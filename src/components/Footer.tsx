import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-ivory/80 pt-12 sm:pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-12 border-b border-white/10">
          
          {/* Brand (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-white tracking-tight leading-tight">
                Dr. Bhushan Parmar
              </span>
              <span className="text-xs text-accent tracking-[0.18em] uppercase font-semibold mt-1">
                Consultant Medical Oncologist
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-ivory/70 font-light">
              Expert, evidence-based, and compassionate cancer care built around the individual, not just the diagnosis.
            </p>
            {/* Direct Contact Links */}
            <div className="pt-2 space-y-2 text-sm">
              <a 
                href="tel:+917087491471" 
                className="flex items-center space-x-2.5 text-ivory/90 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 70874 91471</span>
              </a>
              <a 
                href="mailto:drbhushanparmar@gmail.com" 
                className="flex items-center space-x-2.5 text-ivory/90 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span>drbhushanparmar@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Links (8 cols on lg, 2 cols on mobile) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-4 md:pt-0">
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-serif text-lg sm:text-xl mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-ivory/75">
                <li><Link to="/about" className="hover:text-accent transition-colors block py-0.5">About Dr. Parmar</Link></li>
                <li><Link to="/precision-oncology" className="hover:text-accent transition-colors block py-0.5">Precision Oncology</Link></li>
                <li><Link to="/patient-stories" className="hover:text-accent transition-colors block py-0.5">Patient Stories</Link></li>
                <li><Link to="/international-patients" className="hover:text-accent transition-colors block py-0.5">International Patients</Link></li>
                <li><Link to="/blogs" className="hover:text-accent transition-colors block py-0.5">Knowledge Centre</Link></li>
              </ul>
            </div>

            {/* Areas of Expertise */}
            <div>
              <h4 className="text-white font-serif text-lg sm:text-xl mb-3 sm:mb-4">Expertise</h4>
              <ul className="space-y-2 text-sm text-ivory/75">
                <li><Link to="/treatments" className="hover:text-accent transition-colors block py-0.5">Chemotherapy</Link></li>
                <li><Link to="/treatments" className="hover:text-accent transition-colors block py-0.5">Targeted Therapy</Link></li>
                <li><Link to="/treatments" className="hover:text-accent transition-colors block py-0.5">Immunotherapy</Link></li>
                <li><Link to="/treatments" className="hover:text-accent transition-colors block py-0.5">Breast Cancer</Link></li>
                <li><Link to="/treatments" className="hover:text-accent transition-colors block py-0.5">Lung Cancer</Link></li>
              </ul>
            </div>

            {/* Consultation Card (on tablet/desktop) */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <h5 className="text-white font-serif text-base mb-1">Need Advice?</h5>
                <p className="text-xs text-ivory/70 leading-relaxed">Schedule a consultation or seek a second opinion.</p>
              </div>
              <Link 
                to="/contact" 
                className="mt-3 inline-block text-center bg-accent text-primary px-4 py-2 text-xs font-semibold rounded-lg hover:bg-white transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-ivory/60 space-y-4 md:space-y-0 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Dr. Bhushan Parmar. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/medical-disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link>
            <Link to="/admin" className="hover:text-accent transition-colors text-white/30">Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
