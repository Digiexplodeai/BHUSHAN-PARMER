import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 flex flex-col space-y-3 z-50">
      <a 
        href="https://wa.me/917087491471" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-11 h-11 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
      <a 
        href="tel:+917087491471" 
        className="w-11 h-11 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
        aria-label="Call Now"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
      </a>
      <Link 
        to="/contact" 
        className="w-11 h-11 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center text-primary shadow-xl hover:scale-110 active:scale-95 transition-transform"
        aria-label="Book Appointment"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
    </div>
  );
}
