import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Testimonial } from '../types';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function PatientStories() {
  const [stories, setStories] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const fetched: Testimonial[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Testimonial);
        });
        fetched.sort((a, b) => a.order - b.order);
        setStories(fetched.filter(t => t.isVisible));
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
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
            Real Experiences
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight">
            Patient Stories
          </h1>
          <p className="text-lg text-softgrey max-w-2xl mx-auto">
            Hear directly from the individuals we've had the privilege of treating. Their journeys of hope, strength, and recovery.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all"
            >
              <Quote className="absolute -top-4 -right-4 w-24 h-24 text-gray-50 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="flex space-x-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < story.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              
              <p className="text-charcoal leading-relaxed mb-8 flex-grow relative z-10 italic">
                "{story.text}"
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto relative z-10">
                <div>
                  <h4 className="font-medium text-charcoal">{story.name}</h4>
                  <p className="text-xs text-softgrey mt-1">{story.date}</p>
                </div>
                {story.source && (
                  <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {story.source}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
