import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Highlight } from '../types';
import { motion } from 'framer-motion';
import { Award, Dna, HeartHandshake, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

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

  // Fallback items if Firestore highlights are not seeded
  const displayHighlights = highlights.length > 0 ? highlights : [
    {
      id: 'h1',
      title: '20+ Years Experience',
      description: 'Extensive expertise in clinical medical oncology, managing complex solid tumors and hematologic malignancies with evidence-based protocols.',
      order: 1,
      isVisible: true
    },
    {
      id: 'h2',
      title: 'Precision Care',
      description: 'State-of-the-art genomic profiling and molecular tumor analysis to select targeted therapies specifically tailored to each patient.',
      order: 2,
      isVisible: true
    },
    {
      id: 'h3',
      title: 'Compassionate Approach',
      description: 'A deeply human-centered philosophy emphasizing clear communication, symptom management, and emotional support throughout your recovery.',
      order: 3,
      isVisible: true
    }
  ];

  // Custom luxury visual graphics for each highlight card
  const getCardGraphic = (title: string, index: number) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('experience') || titleLower.includes('20') || index === 0) {
      return (
        <div className="w-full h-40 sm:h-44 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 p-6 flex flex-col justify-between relative overflow-hidden group-hover:border-accent/40 transition-colors">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary text-accent flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-2xl font-serif text-primary/70 font-semibold">20+ YRS</span>
          </div>
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-[0.18em] text-softgrey font-semibold">Clinical Mastery</span>
            <p className="text-xs text-charcoal/80 font-medium mt-0.5">Advanced Solid & Hematologic Oncology</p>
          </div>
          {/* Subtle background art */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border border-primary/10 bg-primary/5 -z-0" />
        </div>
      );
    }

    if (titleLower.includes('precision') || titleLower.includes('care') || index === 1) {
      return (
        <div className="w-full h-40 sm:h-44 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/10 p-6 flex flex-col justify-between relative overflow-hidden group-hover:border-accent/40 transition-colors">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary text-accent flex items-center justify-center shadow-md">
              <Dna className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-widest text-accent font-bold px-2.5 py-1 rounded-full bg-accent/15">GENOMIC</span>
          </div>
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-[0.18em] text-softgrey font-semibold">Next-Gen Profiling</span>
            <p className="text-xs text-charcoal/80 font-medium mt-0.5">Molecular Biomarkers & Targeted Drugs</p>
          </div>
          {/* Subtle background art */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border border-accent/20 bg-accent/5 -z-0" />
        </div>
      );
    }

    return (
      <div className="w-full h-40 sm:h-44 rounded-2xl bg-gradient-to-br from-accent/10 via-primary/5 to-lightsage border border-primary/10 p-6 flex flex-col justify-between relative overflow-hidden group-hover:border-accent/40 transition-colors">
        <div className="flex justify-between items-start relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary text-accent flex items-center justify-center shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-widest text-primary font-bold px-2.5 py-1 rounded-full bg-primary/10">PATIENT-FIRST</span>
        </div>
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-[0.18em] text-softgrey font-semibold">Holistic Support</span>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">Quality of Life & Transparent Care</p>
        </div>
        {/* Subtle background art */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border border-primary/10 bg-primary/5 -z-0" />
      </div>
    );
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-ivory/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent bg-accent/15 px-4 py-1.5 rounded-full inline-block mb-3">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal mb-4 tracking-tight">
            Key Highlights & Clinical Excellence
          </h2>
          <p className="text-base sm:text-lg text-softgrey font-light leading-relaxed">
            Our commitment to medical rigor and personalized precision ensures the highest standard of oncology care.
          </p>
        </div>

        {/* 3 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {displayHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.id || index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-primary/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              {/* Luxury Graphic Header */}
              <div className="mb-6">
                {getCardGraphic(highlight.title, index)}
              </div>
              
              {/* Badge & Title */}
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
