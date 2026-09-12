import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-ivory/80 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-2xl text-white tracking-tight leading-none">
              Dr. Bhushan Parmar
            </span>
            <span className="text-xs text-accent tracking-widest uppercase mt-1">
              Consultant Medical Oncologist
            </span>
          </div>
          <p className="text-sm mt-4 leading-relaxed max-w-xs">
            Expert, evidence-based, and compassionate cancer care built around the individual, not just the diagnosis.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-serif text-xl mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-accent transition-colors">About Dr. Parmar</Link></li>
            <li><Link to="/precision-oncology" className="hover:text-accent transition-colors">Precision Oncology</Link></li>
            <li><Link to="/patient-stories" className="hover:text-accent transition-colors">Patient Stories</Link></li>
            <li><Link to="/international-patients" className="hover:text-accent transition-colors">International Patients</Link></li>
            <li><Link to="/blogs" className="hover:text-accent transition-colors">Knowledge Centre</Link></li>
          </ul>
        </div>

        {/* Treatments */}
        <div>
          <h4 className="text-white font-serif text-xl mb-4">Areas of Expertise</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/treatments" className="hover:text-accent transition-colors">Cytotoxic Chemotherapy</Link></li>
            <li><Link to="/treatments" className="hover:text-accent transition-colors">Targeted Therapy</Link></li>
            <li><Link to="/treatments" className="hover:text-accent transition-colors">Immunotherapy</Link></li>
            <li><Link to="/treatments" className="hover:text-accent transition-colors">Breast Cancer</Link></li>
            <li><Link to="/treatments" className="hover:text-accent transition-colors">Lung Cancer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-serif text-xl mb-4">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <p className="text-accent mb-1 font-medium">ClearMedi Multispeciality Hospital</p>
              <p>Kharar, Punjab</p>
            </li>
            <li>
              <a href="tel:+917087491471" className="hover:text-white transition-colors flex items-center">
                +91 70874 91471
              </a>
            </li>
            <li>
              <a href="mailto:drbhushanparmar@gmail.com" className="hover:text-white transition-colors">
                drbhushanparmar@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
        <p>&copy; {new Date().getFullYear()} Dr. Bhushan Parmar. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/medical-disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link>
          <Link to="/admin" className="hover:text-accent transition-colors text-white/30">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
