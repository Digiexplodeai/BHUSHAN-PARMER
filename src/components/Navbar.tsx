import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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
    <header className="sticky top-0 md:top-4 z-50 transition-all duration-300 w-full px-0 md:px-8">
      <div 
        className={clsx(
          "max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 px-4 md:px-8",
          "bg-white/95 md:bg-white/90 backdrop-blur-md border-b md:border border-gray-200/50 shadow-sm md:shadow-lg md:rounded-full py-2.5 md:py-3"
        )}
      >
        <Link to="/" className="flex items-center space-x-2 z-50">
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl tracking-tight text-primary leading-none">
              Dr. Bhushan Parmar
            </span>
            <span className="text-[10px] md:text-xs text-secondary tracking-widest uppercase mt-0.5">
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
          className="lg:hidden text-primary p-1.5 focus:outline-none z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/70 px-6 py-5 z-40 overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "text-base font-medium transition-colors py-1.5",
                    location.pathname === link.path ? "text-accent font-semibold" : "text-charcoal hover:text-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-primary text-white text-center py-3 mt-2 text-sm font-medium rounded-xl hover:bg-charcoal transition-colors shadow-sm"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
