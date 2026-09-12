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
    return <div className="py-24 text-center text-softgrey">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-softgrey mb-4 block">
            Expertise
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight">
            Treatments & Areas of Expertise
          </h1>
          <p className="text-lg text-softgrey max-w-2xl mx-auto">
            Comprehensive oncology services focusing on modern, evidence-based, and targeted therapies.
          </p>
        </div>
      </section>

      {/* Treatments List */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment, index) => (
            <motion.div 
              key={treatment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {treatment.imageUrl ? (
                  <img 
                    src={treatment.imageUrl} 
                    alt={treatment.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-serif text-2xl text-charcoal mb-3">{treatment.title}</h3>
                <p className="text-softgrey mb-6 flex-grow">{treatment.description}</p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors mt-auto"
                >
                  Book a consultation <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
