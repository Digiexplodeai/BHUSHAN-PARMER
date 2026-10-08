import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col space-y-2.5 z-40 print:hidden select-none">
      {/* WhatsApp */}
      <a 
        href="https://wa.me/917087491471" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>

      {/* Call */}
      <a 
        href="tel:+917087491471" 
        className="w-11 h-11 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
        aria-label="Call Doctor"
        title="Call Now"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
      </a>

      {/* Book Appointment */}
      <Link 
        to="/contact" 
        className="w-11 h-11 sm:w-12 sm:h-12 bg-accent text-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-primary/20"
        aria-label="Book Appointment"
        title="Book Appointment"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
    </div>
  );
}
