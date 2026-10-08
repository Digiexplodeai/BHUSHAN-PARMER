import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { CancerType } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Dna } from 'lucide-react';

export default function PrecisionOncology() {
  const [cancers, setCancers] = useState<CancerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cancerTypes'));
        const fetched: CancerType[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as CancerType);
        });
        setCancers(fetched);
      } catch (error) {
        console.error('Error fetching cancer types:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCancers();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-softgrey font-light">Loading precision oncology protocols...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen pb-20 sm:pb-28">
      {/* Hero Section */}
      <section className="pt-14 sm:pt-20 md:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent bg-accent/15 px-4 py-1.5 rounded-full inline-block mb-3 sm:mb-4">
            Genomic & Molecular Medicine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4 sm:mb-6 leading-tight tracking-tight">
            Precision Oncology & Cancer Care
          </h1>
          <p className="text-base sm:text-lg text-softgrey max-w-2xl mx-auto font-light leading-relaxed">
            Targeted therapies based on the unique genetic profile of each patient's tumor, ensuring maximum clinical precision.
          </p>
        </div>
      </section>

      {/* Conditions List */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {cancers.map((cancer, index) => (
          <motion.div 
            key={cancer.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-14 items-center bg-white p-6 sm:p-10 rounded-3xl border border-primary/10 shadow-xs`}
          >
            <div className="w-full lg:w-1/2 aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-primary/5">
              {cancer.imageUrl ? (
                <img 
                  src={cancer.imageUrl} 
                  alt={cancer.title} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-light">No Image</div>
              )}
            </div>
            <div className="w-full lg:w-1/2 space-y-5">
              <div className="inline-flex items-center space-x-2 text-xs uppercase font-semibold tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                <Dna className="w-3.5 h-3.5" />
                <span>Specialized Protocol</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary">{cancer.title}</h2>
              <p className="text-base sm:text-lg text-charcoal/85 leading-relaxed font-light">
                {cancer.introduction}
              </p>
              {cancer.treatmentOptions && (
                <div className="pt-5 border-t border-primary/10">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Targeted Treatment Approach</h4>
                  <p className="text-softgrey text-sm sm:text-base leading-relaxed font-light">{cancer.treatmentOptions}</p>
                </div>
              )}
              <div className="pt-2">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
                >
                  <span>Discuss your case</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
