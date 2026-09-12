import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { CancerType } from '../types';
import { motion } from 'framer-motion';

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
    return <div className="py-24 text-center text-softgrey">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-softgrey mb-4 block">
            Specialized Care
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight">
            Precision Oncology
          </h1>
          <p className="text-lg text-softgrey max-w-2xl mx-auto">
            Targeted therapies based on the unique genetic profile of each patient's tumor, ensuring the most effective treatment plan.
          </p>
        </div>
      </section>

      {/* Conditions List */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto space-y-16">
        {cancers.map((cancer, index) => (
          <motion.div 
            key={cancer.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
          >
            <div className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {cancer.imageUrl ? (
                <img src={cancer.imageUrl} alt={cancer.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal">{cancer.title}</h2>
              <p className="text-lg text-charcoal/80 leading-relaxed font-medium">
                {cancer.introduction}
              </p>
              {cancer.treatmentOptions && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">Treatment Approach</h4>
                  <p className="text-softgrey">{cancer.treatmentOptions}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
