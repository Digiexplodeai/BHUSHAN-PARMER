import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Treatments', path: '/treatments' },
    { name: 'Precision Oncology', path: '/precision-oncology' },
    { name: 'Patient Stories', path: '/patient-stories' },
  ];

  return (
    <header className="sticky top-4 z-50 transition-all duration-300 w-full px-4 md:px-8">
      <div 
        className={clsx(
          "max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 rounded-full px-6 md:px-8",
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-200/50 py-3'
            : 'bg-transparent py-4'
        )}
      >
        <Link to="/" className="flex items-center space-x-2 z-50">
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-tight text-primary leading-none">
              Dr. Bhushan Parmar
            </span>
            <span className="text-xs text-secondary tracking-widest uppercase mt-1">
              Medical Oncologist
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'text-sm font-medium transition-colors hover:text-accent relative group',
                location.pathname === link.path ? 'text-primary' : 'text-charcoal/80'
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="navbar-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent"
                />
              )}
            </Link>
          ))}
          <Link
            to="/contact"
            className="border border-accent text-primary px-6 py-2.5 text-sm font-medium rounded-full hover:bg-accent hover:text-white transition-all duration-300"
          >
            Book Consultation
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-primary z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 w-full bg-ivory shadow-lg border-t border-primary/10 py-4 px-4"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium text-charcoal"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary text-white text-center py-3 mt-4 text-sm font-medium"
            >
              Book Consultation
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
