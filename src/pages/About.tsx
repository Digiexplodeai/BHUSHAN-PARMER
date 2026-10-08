import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Milestone } from '../types';
import { motion } from 'framer-motion';

export default function About() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const milestonesSnap = await getDocs(collection(db, 'milestones'));
        const fetchedMilestones: Milestone[] = [];
        milestonesSnap.forEach((doc) => {
          fetchedMilestones.push({ id: doc.id, ...doc.data() } as Milestone);
        });
        fetchedMilestones.sort((a, b) => a.order - b.order);
        setMilestones(fetchedMilestones);

        const aboutDoc = await getDoc(doc(db, 'settings', 'home_about'));
        if (aboutDoc.exists()) {
          setAboutData(aboutDoc.data().value);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-softgrey">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-softgrey mb-3 md:mb-4 block">
            {aboutData?.label || 'About'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 md:mb-8 leading-tight">
            {aboutData?.heading || 'Meet Dr. Bhushan Parmar'}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24 max-w-md mx-auto lg:max-w-none w-full">
            <div className="aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-100">
              {aboutData?.imageUrl ? (
                <img src={aboutData.imageUrl} alt="Dr. Bhushan Parmar" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="prose prose-lg prose-charcoal max-w-none">
              <p className="text-xl text-charcoal leading-relaxed font-medium">
                {aboutData?.paragraph1 || "Dr. Parmar is a dedicated Medical Oncologist with a focus on precision therapies."}
              </p>
              <p className="text-softgrey leading-relaxed">
                {aboutData?.paragraph2 || "With years of experience in the field, Dr. Parmar combines cutting-edge research with compassionate care."}
              </p>
            </div>

            {milestones.length > 0 && (
              <div className="mt-16 pt-16 border-t border-gray-200">
                <h2 className="font-serif text-3xl text-charcoal mb-10">Professional Journey</h2>
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <motion.div 
                      key={milestone.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 md:pl-0"
                    >
                      <div className="md:grid md:grid-cols-4 md:gap-8 items-baseline">
                        <div className="md:col-span-1 mb-2 md:mb-0">
                          <span className="text-accent font-serif text-xl md:text-2xl">{milestone.year}</span>
                        </div>
                        <div className="md:col-span-3 border-l-2 border-accent/20 pl-6 md:pl-8 pb-12 relative">
                          <div className="absolute w-3 h-3 bg-accent rounded-full -left-[7px] top-2 shadow-sm shadow-accent/50"></div>
                          <h3 className="text-xl font-medium text-charcoal mb-2">{milestone.title}</h3>
                          <p className="text-softgrey leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
