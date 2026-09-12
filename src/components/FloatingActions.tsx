import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
      <a 
        href="https://wa.me/917087491471" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a 
        href="tel:+917087491471" 
        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        aria-label="Call Now"
      >
        <Phone className="w-5 h-5" />
      </a>
      <Link 
        to="/contact" 
        className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform"
        aria-label="Book Appointment"
      >
        <Calendar className="w-5 h-5" />
      </Link>
    </div>
  );
}
