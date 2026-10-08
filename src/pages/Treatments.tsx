import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Treatment } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Treatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'treatments'));
        const fetched: Treatment[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Treatment);
        });
        fetched.sort((a, b) => a.order - b.order);
        setTreatments(fetched.filter(t => t.isVisible));
      } catch (error) {
        console.error('Error fetching treatments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-softgrey font-light">Loading treatments...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen pb-20 sm:pb-28">
      {/* Hero Section */}
      <section className="pt-14 sm:pt-20 md:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent bg-accent/15 px-4 py-1.5 rounded-full inline-block mb-3 sm:mb-4">
            Areas of Expertise
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4 sm:mb-6 leading-tight tracking-tight">
            Treatments & Specialized Oncology Care
          </h1>
          <p className="text-base sm:text-lg text-softgrey max-w-2xl mx-auto font-light leading-relaxed">
            Comprehensive oncology services focusing on modern, evidence-based, and targeted systemic therapies.
          </p>
        </div>
      </section>

      {/* Treatments List */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {treatments.map((treatment, index) => (
            <motion.div 
              key={treatment.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary/10 flex flex-col group"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {treatment.imageUrl ? (
                  <img 
                    src={treatment.imageUrl} 
                    alt={treatment.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-light">No Image</div>
                )}
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="font-serif text-xl sm:text-2xl text-primary mb-3">{treatment.title}</h3>
                <p className="text-softgrey text-sm sm:text-base leading-relaxed mb-6 flex-grow font-light">{treatment.description}</p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-accent transition-colors mt-auto"
                >
                  <span>Book a consultation</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
