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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Treatments', path: '/treatments' },
    { name: 'Precision Oncology', path: '/precision-oncology' },
    { name: 'Patient Stories', path: '/patient-stories' },
  ];

  return (
    <header className="sticky top-0 lg:top-4 z-50 transition-all duration-300 w-full px-0 lg:px-8">
      <div 
        className={clsx(
          "max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 px-4 sm:px-6 lg:px-8",
          "bg-ivory/95 lg:bg-white/90 backdrop-blur-md border-b lg:border border-primary/10 lg:border-gray-200/60 shadow-xs lg:shadow-md lg:rounded-full py-3 lg:py-3.5"
        )}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2 z-50 group">
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-tight text-primary leading-tight group-hover:text-accent transition-colors">
              Dr. Bhushan Parmar
            </span>
            <span className="text-[10px] sm:text-xs text-accent tracking-[0.18em] uppercase font-semibold mt-0.5">
              Consultant Medical Oncologist
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
                location.pathname === link.path ? 'text-primary font-semibold' : 'text-charcoal/80'
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
            className="bg-primary text-white hover:bg-accent hover:text-primary px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 shadow-sm"
          >
            Book Consultation
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="lg:hidden text-primary p-2 rounded-lg hover:bg-primary/5 active:scale-95 transition-transform z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="lg:hidden w-full bg-ivory/98 backdrop-blur-xl border-b border-primary/10 shadow-xl px-5 py-5 z-40 overflow-hidden"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "text-base py-2.5 px-3 rounded-xl transition-colors flex items-center justify-between",
                    location.pathname === link.path 
                      ? "bg-primary/8 text-primary font-semibold" 
                      : "text-charcoal hover:bg-primary/5 hover:text-primary font-medium"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  {location.pathname === link.path && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              ))}
              <div className="pt-3">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-primary text-white text-center py-3.5 text-sm font-medium rounded-xl hover:bg-charcoal active:scale-[0.98] transition-all shadow-sm block"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
