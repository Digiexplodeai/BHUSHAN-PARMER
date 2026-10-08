import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Stethoscope, Dna, User, Star, Calendar, ExternalLink } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'Treatments' | 'Cancer Care' | 'Doctor Info' | 'Patient Stories' | 'Pages & Actions';
  path: string;
  keywords?: string[];
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'page-home',
    title: 'Home — Precision Oncology & Cancer Care',
    description: 'Expert cancer care built around you by Dr. Bhushan Parmar, Consultant Medical Oncologist.',
    category: 'Pages & Actions',
    path: '/',
    keywords: ['oncology', 'cancer', 'home', 'doctor', 'bhushan', 'parmar']
  },
  {
    id: 'page-about',
    title: 'About Dr. Bhushan Parmar',
    description: 'MD Medical Oncology, professional background, treatment philosophy and experience.',
    category: 'Doctor Info',
    path: '/about',
    keywords: ['dr bhushan parmar', 'education', 'fellowship', 'biography', 'oncologist', 'md']
  },
  {
    id: 'page-treatments',
    title: 'Treatments & Areas of Expertise',
    description: 'Comprehensive systemic therapies including Chemotherapy, Targeted Therapy, and Immunotherapy.',
    category: 'Treatments',
    path: '/treatments',
    keywords: ['chemotherapy', 'targeted therapy', 'immunotherapy', 'infusion', 'solid tumors']
  },
  {
    id: 'page-precision',
    title: 'Precision Oncology & Genomic Profiling',
    description: 'Personalized cancer treatments tailored to the molecular and genetic characteristics of each tumor.',
    category: 'Cancer Care',
    path: '/precision-oncology',
    keywords: ['genomics', 'next generation sequencing', 'ngs', 'molecular profiling', 'mutations']
  },
  {
    id: 'page-stories',
    title: 'Patient Stories & Testimonials',
    description: 'Real experiences from patients treated by Dr. Bhushan Parmar.',
    category: 'Patient Stories',
    path: '/patient-stories',
    keywords: ['reviews', 'testimonials', 'recovery', 'feedback', 'stories']
  },
  {
    id: 'action-contact',
    title: 'Book a Consultation / Appointment',
    description: 'Request an in-person consultation or second opinion with Dr. Bhushan Parmar.',
    category: 'Pages & Actions',
    path: '/contact',
    keywords: ['appointment', 'book', 'consultation', 'phone', 'email', 'second opinion', 'contact']
  },
  {
    id: 'treatment-chemo',
    title: 'Cytotoxic Chemotherapy',
    description: 'Evidence-based chemotherapeutic regimens tailored for maximum efficacy and minimal toxicity.',
    category: 'Treatments',
    path: '/treatments',
    keywords: ['chemo', 'chemotherapy', 'drugs', 'infusion', 'systemic therapy']
  },
  {
    id: 'treatment-targeted',
    title: 'Targeted Therapy',
    description: 'Precision medicines designed to block specific genes and proteins that help cancer cells grow.',
    category: 'Treatments',
    path: '/treatments',
    keywords: ['targeted', 'tyrosine kinase', 'tki', 'monoclonal antibodies', 'inhibitors']
  },
  {
    id: 'treatment-immuno',
    title: 'Immunotherapy',
    description: 'Harnessing the immune system to recognize and eliminate cancer cells.',
    category: 'Treatments',
    path: '/treatments',
    keywords: ['immunotherapy', 'checkpoint inhibitors', 'pdl1', 'pd1', 'immune']
  },
  {
    id: 'cancer-breast',
    title: 'Breast Cancer Treatment',
    description: 'Comprehensive precision protocols for ER+, HER2+, and Triple Negative breast cancers.',
    category: 'Cancer Care',
    path: '/precision-oncology',
    keywords: ['breast cancer', 'her2', 'er pr', 'tamoxifen', 'mastectomy']
  },
  {
    id: 'cancer-lung',
    title: 'Lung Cancer Treatment (NSCLC & SCLC)',
    description: 'Targeted therapies for EGFR, ALK, ROS1 mutations, and immunotherapy for lung cancer.',
    category: 'Cancer Care',
    path: '/precision-oncology',
    keywords: ['lung cancer', 'egfr', 'alk', 'nsclc', 'sclc', 'smokers']
  },
  {
    id: 'cancer-gi',
    title: 'Gastrointestinal & Colorectal Cancers',
    description: 'Specialized management for stomach, colon, rectal, esophageal and pancreas cancers.',
    category: 'Cancer Care',
    path: '/precision-oncology',
    keywords: ['colon cancer', 'stomach', 'rectal', 'pancreatic', 'gi']
  }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>(STATIC_SEARCH_ITEMS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load dynamic items from Firestore (treatments, cancer types)
  useEffect(() => {
    const fetchDynamicItems = async () => {
      try {
        const dynamicItems: SearchItem[] = [...STATIC_SEARCH_ITEMS];

        // Fetch treatments
        const treatmentsSnap = await getDocs(collection(db, 'treatments'));
        treatmentsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.title && !dynamicItems.some(i => i.title.toLowerCase() === data.title.toLowerCase())) {
            dynamicItems.push({
              id: `treatment-${doc.id}`,
              title: data.title,
              description: data.description || 'Specialized oncology treatment protocol.',
              category: 'Treatments',
              path: '/treatments',
              keywords: [data.title.toLowerCase(), 'treatment', 'therapy']
            });
          }
        });

        // Fetch cancer types
        const cancerSnap = await getDocs(collection(db, 'cancerTypes'));
        cancerSnap.forEach((doc) => {
          const data = doc.data();
          if (data.title && !dynamicItems.some(i => i.title.toLowerCase() === data.title.toLowerCase())) {
            dynamicItems.push({
              id: `cancer-${doc.id}`,
              title: `${data.title} Precision Care`,
              description: data.introduction || 'Comprehensive precision cancer management.',
              category: 'Cancer Care',
              path: '/precision-oncology',
              keywords: [data.title.toLowerCase(), 'cancer', 'oncology']
            });
          }
        });

        setItems(dynamicItems);
      } catch (err) {
        // Fallback to static items
      }
    };

    if (isOpen) {
      fetchDynamicItems();
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filtered & ranked results
  const filteredResults = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Return top recommended entries when query is empty
      return items.slice(0, 6);
    }

    return items
      .map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        const keywords = item.keywords || [];

        if (titleLower.startsWith(trimmed)) score += 50;
        else if (titleLower.includes(trimmed)) score += 30;

        if (keywords.some(k => k.includes(trimmed))) score += 20;
        if (descLower.includes(trimmed)) score += 10;

        return { item, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);
  }, [query, items]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item: SearchItem) => {
    onClose();
    navigate(item.path);
  };

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'Treatments':
        return <Stethoscope className="w-4 h-4 text-accent" />;
      case 'Cancer Care':
        return <Dna className="w-4 h-4 text-accent" />;
      case 'Doctor Info':
        return <User className="w-4 h-4 text-accent" />;
      case 'Patient Stories':
        return <Star className="w-4 h-4 text-accent" />;
      case 'Pages & Actions':
      default:
        return <Calendar className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-ivory rounded-2xl sm:rounded-3xl shadow-2xl border border-primary/15 overflow-hidden flex flex-col max-h-[85vh] z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Search website"
          >
            {/* Header Search Input */}
            <div className="flex items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-primary/10 bg-white">
              <Search className="w-5 h-5 text-primary/60 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search treatments, cancer types, consultations..."
                className="w-full bg-transparent text-charcoal placeholder:text-softgrey/70 text-sm sm:text-base focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-softgrey hover:text-charcoal mr-2"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-softgrey hover:text-charcoal uppercase tracking-wider"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-3 sm:p-4 space-y-1.5 flex-grow">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-softgrey/80 flex items-center justify-between">
                <span>{query ? `Results (${filteredResults.length})` : 'Popular Searches'}</span>
                <span className="hidden sm:inline text-[10px] text-softgrey/60">Navigate with ↑↓ and Enter</span>
              </div>

              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-xl transition-all flex items-start space-x-3 group ${
                        isSelected 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'bg-white hover:bg-primary/5 text-charcoal border border-primary/5'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isSelected ? 'bg-white/10 text-accent' : 'bg-primary/5 text-primary'
                      }`}>
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="flex-grow min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm sm:text-base font-medium truncate ${
                            isSelected ? 'text-white' : 'text-primary group-hover:text-primary'
                          }`}>
                            {item.title}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isSelected ? 'bg-accent text-primary' : 'bg-primary/10 text-primary'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 line-clamp-1 font-light ${
                          isSelected ? 'text-white/80' : 'text-softgrey'
                        }`}>
                          {item.description}
                        </p>
                      </div>

                      <ArrowRight className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                        isSelected ? 'text-accent translate-x-0.5' : 'text-softgrey/40 group-hover:text-primary'
                      }`} />
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-softgrey" />
                  </div>
                  <h4 className="font-serif text-lg text-charcoal mb-1">No matching results</h4>
                  <p className="text-xs text-softgrey max-w-sm mx-auto">
                    We couldn't find any results for "{query}". Try searching for Chemotherapy, Immunotherapy, Precision Oncology, or Book Consultation.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Quick Shortcuts */}
            <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-primary/10 text-xs text-softgrey flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-charcoal">Quick Links:</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/treatments');
                  }}
                  className="hover:text-primary underline underline-offset-2"
                >
                  Treatments
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/precision-oncology');
                  }}
                  className="hover:text-primary underline underline-offset-2"
                >
                  Genomics
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/contact');
                  }}
                  className="hover:text-primary underline underline-offset-2"
                >
                  Book Appointment
                </button>
              </div>
              <span className="text-[11px] text-softgrey/70">Dr. Bhushan Parmar Medical Oncology</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
