import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Highlights from '../components/Highlights';

export default function Home() {
  const [heroData, setHeroData] = useState({
    label: 'Precision Oncology',
    heading1: 'Expert cancer care.',
    heading2: 'Built around you.',
    paragraph: 'Advanced systemic therapies and personalised treatment planning from one of the leading medical oncologists.',
    imageUrl: '',
  });

  const [aboutData, setAboutData] = useState({
    label: 'Meet Your Oncologist',
    heading: 'Cancer care built around the individual, not just the diagnosis.',
    paragraph1: 'Dr. Bhushan Parmar is a consultant medical oncologist dedicated to providing world-class, precision-driven cancer care. With extensive experience in managing complex solid and haematological malignancies, he focuses on evidence-based treatment protocols.',
    paragraph2: 'Every patient\'s journey is unique. We integrate the latest advancements in targeted therapy and immunotherapy to ensure optimal outcomes with the highest quality of life.',
    imageUrl: '',
    chips: ['Medical Oncology', 'Precision Oncology', 'Chemotherapy', 'Immunotherapy', 'Targeted Therapy'],
    badgeTitle: 'MD',
    badgeSubtitle: 'Medical Oncology'
  });

  const [precisionData, setPrecisionData] = useState({
    heading1: 'No two cancers are exactly the same.',
    heading2: 'Treatment shouldn\'t be either.',
    paragraph: 'We utilize advanced genomic testing to understand the unique molecular profile of your cancer, allowing us to select therapies specifically designed to target those mutations.',
    imageUrl: '',
    node1Title: 'Diagnosis',
    node1Desc: 'Accurate tissue analysis and staging.',
    node2Title: 'Genomics',
    node2Desc: 'Molecular tumor profiling.'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const heroDoc = await getDoc(doc(db, 'settings', 'home_hero'));
        if (heroDoc.exists()) setHeroData(heroDoc.data().value);

        const aboutDoc = await getDoc(doc(db, 'settings', 'home_about'));
        if (aboutDoc.exists()) setAboutData(aboutDoc.data().value);

        const precisionDoc = await getDoc(doc(db, 'settings', 'home_precision'));
        if (precisionDoc.exists()) setPrecisionData(precisionDoc.data().value);
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section - Direction A */}
      <section className="relative min-h-[90vh] flex items-center bg-ivory overflow-hidden">
        
        {/* Background Motif - abstract topographic / molecular line art */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] animate-[spin_120s_linear_infinite]" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="500" cy="500" r="400" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" />
            <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="500" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
            <path d="M100 500 Q 500 100 900 500 T 1700 500" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full flex flex-col md:flex-row items-center relative z-10 pt-8 md:pt-0 pb-16 md:pb-0">
          
          {/* Left: Text Content (55%) */}
          <div className="w-full md:w-[55%] flex flex-col justify-center pr-0 md:pr-10 lg:pr-20 pb-10 md:pb-0 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent md:text-softgrey mb-3 md:mb-6 block">
                {heroData.label}
              </span>
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-charcoal mb-6 md:mb-8">
                {heroData.heading1} <br className="hidden sm:inline" />
                <span className="italic text-accent relative inline-block">
                  {heroData.heading2}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] bg-accent origin-left"
                  />
                </span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-base sm:text-lg md:text-xl text-softgrey max-w-lg mx-auto md:mx-0 mb-8 md:mb-12 font-light leading-relaxed"
              >
                {heroData.paragraph}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
              >
                <Link to="/contact" className="bg-primary text-white px-8 py-3.5 sm:py-4 text-sm font-medium hover:bg-charcoal transition-colors text-center rounded-lg sm:rounded-none shadow-sm hover:shadow-md">
                  Book a Consultation
                </Link>
                <Link to="/treatments" className="group flex items-center justify-center px-8 py-3.5 sm:py-4 text-sm font-medium text-primary border border-primary/20 hover:border-primary transition-colors rounded-lg sm:rounded-none">
                  Explore Treatments
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right: Doctor Image (45%) */}
          <div className="w-full md:w-[45%] relative mt-4 md:mt-0 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 1.02, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-none md:h-[80vh] min-h-[360px] sm:min-h-[460px] md:min-h-0 rounded-2xl md:rounded-none overflow-hidden shadow-xl md:shadow-none bg-gray-100"
            >
              {heroData.imageUrl ? (
                <img 
                  src={heroData.imageUrl} 
                  alt="Dr. Bhushan Parmar" 
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full min-h-[360px] bg-gray-200 flex items-center justify-center text-gray-400">
                  Doctor Photo
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Marquee Trust Indicators */}
        <div className="absolute bottom-0 left-0 w-full bg-primary text-white/90 overflow-hidden py-3 border-t border-accent/30 z-20">
          <div className="flex w-max whitespace-nowrap text-[11px] sm:text-xs tracking-widest uppercase font-medium animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:transform-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-6 sm:mx-8">Precision Oncology</span>
                <span className="text-accent">•</span>
                <span className="mx-6 sm:mx-8">Evidence-Based Care</span>
                <span className="text-accent">•</span>
                <span className="mx-6 sm:mx-8">Patient-First Approach</span>
                <span className="text-accent">•</span>
                <span className="mx-6 sm:mx-8">20+ Years Experience</span>
                <span className="text-accent">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Cue */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-8 md:left-auto md:right-1/2 md:translate-x-1/2 text-charcoal/30 hidden md:block"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 relative max-w-md mx-auto md:max-w-none w-full">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
              {aboutData.imageUrl ? (
                <img 
                  src={aboutData.imageUrl} 
                  alt="Dr. Parmar interacting with patient" 
                  className="w-full h-auto aspect-[4/5] object-cover object-top"
                />
              ) : (
                <div className="w-full h-auto aspect-[4/5] bg-gray-200 flex items-center justify-center text-gray-400">Doctor Photo</div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-2 md:-bottom-8 md:-right-8 bg-ivory p-4 md:p-6 shadow-xl rounded-xl md:rounded-none max-w-[150px] md:max-w-[200px] border border-primary/10">
              <span className="font-serif text-2xl md:text-3xl text-primary block mb-1">{aboutData.badgeTitle || 'MD'}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-softgrey">{aboutData.badgeSubtitle || 'Medical Oncology'}</span>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-6 md:pt-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-softgrey mb-3 md:mb-4 block">
              {aboutData.label}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary mb-6 md:mb-8 leading-tight">
              {aboutData.heading}
            </h2>
            <div className="space-y-4 md:space-y-6 text-charcoal/80 font-light text-base md:text-lg mb-8 md:mb-10 whitespace-pre-wrap">
              <p>{aboutData.paragraph1}</p>
              <p>{aboutData.paragraph2}</p>
            </div>

            <Link to="/about" className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors uppercase tracking-widest">
              Know More About Dr. Parmar <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <Highlights />

      {/* Signature Section: Precision Oncology */}
      <section className="py-16 md:py-32 bg-primary text-ivory relative overflow-hidden">
        {precisionData.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
            style={{ backgroundImage: `url(${precisionData.imageUrl})` }}
          />
        )}
        {/* Subtle Molecular Particles */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-12 md:mb-16 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 md:mb-6">
            {precisionData.heading1} <br />
            <span className="italic text-accent">{precisionData.heading2}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/70 font-light text-base md:text-lg whitespace-pre-wrap">
            {precisionData.paragraph}
          </p>
        </div>

        {/* Circular Orbital Visual */}
        <div className="relative max-w-4xl mx-auto aspect-square md:aspect-video flex items-center justify-center z-10 my-8 md:my-16 px-4 overflow-hidden">
           <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[500px] md:h-[500px] border border-accent/20 rounded-full animate-[spin_60s_linear_infinite]" />
           <div className="absolute w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[350px] md:h-[350px] border border-accent/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
           
           <div className="text-center">
             <span className="block font-serif text-2xl sm:text-3xl text-accent mb-2">Precision</span>
             <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-white/50">Oncology</span>
           </div>

           {/* Orbiting nodes (simplified for layout) */}
           <div className="absolute top-10 md:top-20 right-10 md:right-32 bg-ivory/95 backdrop-blur-sm shadow-xl text-primary p-5 rounded-2xl max-w-[200px] text-sm hidden md:block border border-primary/5 transition-transform hover:-translate-y-1">
             <strong className="text-base">{precisionData.node1Title || 'Diagnosis'}</strong>
             <p className="text-xs mt-1 text-softgrey">{precisionData.node1Desc || 'Accurate tissue analysis and staging.'}</p>
           </div>
           <div className="absolute bottom-10 md:bottom-20 left-10 md:left-32 bg-ivory/95 backdrop-blur-sm shadow-xl text-primary p-5 rounded-2xl max-w-[200px] text-sm hidden md:block border border-primary/5 transition-transform hover:-translate-y-1">
             <strong className="text-base">{precisionData.node2Title || 'Genomics'}</strong>
             <p className="text-xs mt-1 text-softgrey">{precisionData.node2Desc || 'Molecular tumor profiling.'}</p>
           </div>
        </div>

        <div className="text-center relative z-10">
          <Link to="/precision-oncology" className="bg-accent text-primary px-8 py-3.5 sm:py-4 text-sm font-medium hover:bg-white transition-colors rounded-lg sm:rounded-none inline-block shadow-sm">
            Explore Precision Oncology
          </Link>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-16 md:py-24 bg-lightsage text-center px-4">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-primary mb-4 md:mb-6">
          The right guidance can make the journey <br className="hidden md:block"/> feel less overwhelming.
        </h2>
        <p className="text-softgrey mb-8 md:mb-10 max-w-xl mx-auto text-sm sm:text-base">
          Schedule a consultation with Dr. Parmar to discuss your diagnosis, treatment options, or to seek a second opinion.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-none mx-auto">
          <Link to="/contact" className="bg-primary text-white px-8 py-3.5 sm:py-4 text-sm font-medium hover:bg-charcoal transition-colors rounded-lg sm:rounded-none text-center">
            Book Consultation
          </Link>
          <a href="tel:+917087491471" className="border border-primary text-primary px-8 py-3.5 sm:py-4 text-sm font-medium hover:bg-primary hover:text-white transition-colors rounded-lg sm:rounded-none text-center">
            Call Now
          </a>
        </div>
      </section>
    </div>
  );
}
