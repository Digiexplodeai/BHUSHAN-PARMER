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
    return null; // or a loading state if preferred, but null is better to avoid layout jump
  }

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-slate-50/50 rounded-3xl p-8 md:p-12 lg:p-16 border border-slate-100">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent bg-accent/10 px-4 py-2 rounded-full mb-4 inline-block">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal mt-4 mb-6">
            Key Highlights
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our commitment to excellence ensures you receive the highest standard of care in a supportive and advanced environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col h-full"
            >
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
              
              {highlight.imageUrl ? (
                <div className="w-full h-48 sm:h-56 mb-6 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm relative border border-slate-100">
                  <img src={highlight.imageUrl} alt={highlight.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-slate-50 shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-6 overflow-hidden flex-shrink-0 relative z-10">
                  {highlight.iconName && iconMap[highlight.iconName] ? (
                    (() => {
                      const Icon = iconMap[highlight.iconName];
                      return <Icon className="w-8 h-8 text-accent" />;
                    })()
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-white shadow-sm">
                  {highlight.title}
                </span>
              </div>
              
              <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-grow">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
