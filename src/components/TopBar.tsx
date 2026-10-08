import { Phone } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-primary text-ivory text-sm py-2 px-4 md:px-8 flex justify-between items-center hidden md:flex font-sans">
      <div className="flex items-center space-x-6">
        <a href="tel:+917087491471" className="flex items-center space-x-2 hover:text-accent transition-colors">
          <Phone className="w-4 h-4" />
          <span>Call: +91 70874 91471</span>
        </a>
      </div>
      <div>
        <a href="#consultation" className="text-accent hover:text-white transition-colors font-medium">
          Book Consultation &rarr;
        </a>
      </div>
    </div>
  );
}

