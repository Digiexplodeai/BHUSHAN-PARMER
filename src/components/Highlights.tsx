import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Highlight } from '../types';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Target, Heart } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Award: Award,
  Target: Target,
  Heart: Heart,
  CheckCircle2: CheckCircle2,
};

export default function Highlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'highlights'));
        const fetched: Highlight[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Highlight);
        });
        fetched.sort((a, b) => a.order - b.order);
        setHighlights(fetched.filter(h => h.isVisible));
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  if (loading || highlights.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-ivory/50">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xs rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 border border-primary/8 shadow-xs">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent bg-accent/15 px-4 py-1.5 rounded-full inline-block mb-3">
            Why Choose Us
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Key Highlights
          </h2>
          <p className="text-base sm:text-lg text-softgrey max-w-2xl mx-auto leading-relaxed font-light">
            Our commitment to excellence ensures you receive the highest standard of care in a supportive and advanced environment.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-ivory/60 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-primary/10 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col h-full"
            >
              {/* Highlight Image or Icon */}
              {highlight.imageUrl ? (
                <div className="w-full h-44 sm:h-52 mb-5 rounded-xl overflow-hidden flex-shrink-0 shadow-xs relative border border-primary/5 bg-slate-100">
                  <img 
                    src={highlight.imageUrl} 
                    alt={highlight.title} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white shadow-xs border border-primary/10 rounded-2xl flex items-center justify-center mb-5 overflow-hidden flex-shrink-0">
                  {highlight.iconName && iconMap[highlight.iconName] ? (
                    (() => {
                      const Icon = iconMap[highlight.iconName];
                      return <Icon className="w-7 h-7 text-accent" />;
                    })()
                  ) : (
                    <CheckCircle2 className="w-7 h-7 text-accent" />
                  )}
                </div>
              )}
              
              {/* Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-primary text-ivory tracking-wide shadow-xs">
                  {highlight.title}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-charcoal/85 leading-relaxed text-sm sm:text-base font-light flex-grow">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
