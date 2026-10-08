import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Award, Dna, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Highlights from '../components/Highlights';

export default function Home() {
  const [heroData, setHeroData] = useState({
    label: 'Precision Oncology',
    heading1: 'Expert cancer care.',
    heading2: 'Built around you.',
    paragraph: 'Advanced systemic therapies and personalized treatment planning from one of the leading medical oncologists.',
    imageUrl: '',
  });

  const [aboutData, setAboutData] = useState({
    label: 'Meet Your Oncologist',
    heading: 'Cancer care built around the individual, not just the diagnosis.',
    paragraph1: 'Dr. Bhushan Parmar is a consultant medical oncologist with extensive experience in managing various solid malignancies and hematological cancers.',
    paragraph2: 'Every patient\'s journey is unique. My philosophy centers on evidence-based medicine, utilizing the latest advancements in oncology, while ensuring transparent communication and compassionate care every step of the way.',
    imageUrl: '',
    chips: ['Medical Oncology', 'Precision Oncology', 'Chemotherapy', 'Immunotherapy', 'Targeted Therapy'],
    badgeTitle: 'MD',
    badgeSubtitle: 'Medical Oncology'
  });

  const [precisionData, setPrecisionData] = useState({
    heading1: 'No two cancers are exactly the same.',
    heading2: 'Treatment shouldn\'t be either.',
    paragraph: 'We utilize advanced genomic testing to understand the unique molecular profile of your cancer, allowing for targeted therapies and immunotherapies that are more effective and often better tolerated than traditional treatments.',
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

  // Guarantee that the authentic doctor photograph is used in the hero
  const authenticDoctorPhoto = heroData.imageUrl || aboutData.imageUrl;

  return (
    <div className="overflow-x-hidden">
      {/* 01_HERO_SECTION — Single Authentic Doctor Portrait */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center bg-ivory overflow-hidden py-10 lg:py-16">
        {/* Subtle Background Art */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] animate-[spin_140s_linear_infinite]" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="500" cy="500" r="400" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" />
            <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="500" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
            <path d="M100 500 Q 500 100 900 500 T 1700 500" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        
        {/* Grain Texture */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center relative z-10 gap-10 lg:gap-14">
          
          {/* Left Column: Editorial Text & CTAs (55%) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center text-center lg:text-left pr-0 lg:pr-6">
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Eyebrow */}
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-3 sm:mb-4 inline-block">
                {heroData.label || 'Precision Oncology'}
              </span>
              
              {/* Main Headline */}
              <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl lg:text-6.5xl xl:text-7xl leading-[1.1] text-charcoal mb-5 sm:mb-6 tracking-tight">
                {heroData.heading1} <br className="hidden sm:inline" />
                <span className="italic text-accent relative inline-block">
                  {heroData.heading2}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent origin-left"
                  />
                </span>
              </h1>
              
              {/* Supporting Paragraph */}
              <p className="text-base sm:text-lg md:text-xl text-softgrey max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 font-light leading-relaxed">
                {heroData.paragraph}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 sm:gap-4 w-full sm:w-auto">
                <Link 
                  to="/contact" 
                  className="bg-primary text-white hover:bg-accent hover:text-primary transition-all duration-300 min-h-[50px] px-8 py-3.5 rounded-full font-medium text-sm sm:text-base shadow-sm hover:shadow-md text-center flex items-center justify-center active:scale-[0.98]"
                >
                  Book a Consultation
                </Link>
                <Link 
                  to="/treatments" 
                  className="group border border-primary/30 text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300 min-h-[50px] px-8 py-3.5 rounded-full font-medium text-sm sm:text-base text-center flex items-center justify-center active:scale-[0.98]"
                >
                  <span>Explore Treatments</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Prominent Authentic Doctor Portrait (45%) */}
          <div className="w-full lg:w-[45%] flex items-center justify-center">
            <motion.div 
              initial={{ scale: 1.02, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-primary/15 bg-white mx-auto"
            >
              {authenticDoctorPhoto ? (
                <img 
                  src={authenticDoctorPhoto} 
                  alt="Dr. Bhushan Parmar - Consultant Medical Oncologist" 
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full min-h-[360px] bg-slate-100 flex items-center justify-center text-slate-400">
                  Doctor Photograph
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Desktop Scroll Cue */}
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-charcoal/30 hidden lg:block"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* 02_CREDENTIALS_MARQUEE */}
      <div className="w-full bg-primary text-ivory/95 py-3.5 border-y border-accent/40 relative z-20 overflow-hidden">
        <div className="flex w-max whitespace-nowrap text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
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

      {/* 03_ABOUT_SECTION — Pure Text-Led Editorial Doctor Introduction (NO Repeated Photo) */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: High-End Clinical Credential Panel */}
            <div className="lg:col-span-5 bg-ivory/80 rounded-3xl p-7 sm:p-9 border border-primary/10 shadow-xs relative overflow-hidden">
              {/* Decorative accent */}
              <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center mb-6 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              
              <span className="font-serif text-3xl sm:text-4xl text-primary block font-semibold mb-1">
                {aboutData.badgeTitle || 'MD'}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-bold block mb-6">
                {aboutData.badgeSubtitle || 'Medical Oncology'}
              </span>

              <hr className="border-primary/10 mb-6" />

              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-softgrey mb-4">
                Clinical Focus Pillars
              </h4>

              <ul className="space-y-3">
                {[
                  'Targeted Molecular & Genetic Therapies',
                  'Immune Checkpoint Inhibitor Regimens',
                  'Customized Chemotherapeutic Protocols',
                  'Multidisciplinary Tumor Board Care'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-charcoal/90">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between text-xs text-softgrey">
                <span>Specialized Oncology</span>
                <span className="font-semibold text-primary">20+ Years Clinical Care</span>
              </div>
            </div>

            {/* Right Column: Biography & Editorial Narrative */}
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3 sm:mb-4 block">
                {aboutData.label || 'Meet Your Oncologist'}
              </span>
              
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4.5xl text-primary mb-6 leading-tight tracking-tight">
                {aboutData.heading}
              </h2>
              
              <div className="space-y-4 sm:space-y-5 text-charcoal/85 font-light text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed whitespace-pre-wrap">
                <p>{aboutData.paragraph1}</p>
                <p>{aboutData.paragraph2}</p>
              </div>

              <Link 
                to="/about" 
                className="inline-flex items-center text-sm sm:text-base font-semibold text-primary hover:text-accent transition-colors uppercase tracking-wider group"
              >
                <span>Know More About Dr. Parmar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 04_KEY_HIGHLIGHTS — 3 Editorial Cards with Bespoke Graphics (NO Repeated Doctor Photo) */}
      <Highlights />

      {/* 05_PRECISION_STATEMENT — Signature Deep Forest Green Statement */}
      <section className="py-16 sm:py-20 lg:py-28 bg-primary text-ivory relative overflow-hidden">
        {precisionData.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
            style={{ backgroundImage: `url(${precisionData.imageUrl})` }}
          />
        )}
        
        {/* Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12 relative z-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-6 leading-tight">
            {precisionData.heading1} <br />
            <span className="italic text-accent">{precisionData.heading2}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/80 font-light text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {precisionData.paragraph}
          </p>
        </div>

        {/* Circular Orbital Visual */}
        <div className="relative max-w-3xl mx-auto aspect-square sm:aspect-video flex items-center justify-center z-10 my-6 sm:my-10 px-4 overflow-hidden">
           <div className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[440px] md:h-[440px] border border-accent/25 rounded-full animate-[spin_60s_linear_infinite]" />
           <div className="absolute w-[150px] h-[150px] sm:w-[210px] sm:h-[210px] md:w-[300px] md:h-[300px] border border-accent/15 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
           
           <div className="text-center">
             <span className="block font-serif text-2xl sm:text-3xl text-accent mb-1">Precision</span>
             <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-white/60">Oncology</span>
           </div>

           {/* Orbiting nodes on desktop */}
           <div className="absolute top-8 md:top-14 right-6 md:right-20 bg-ivory/95 backdrop-blur-sm shadow-xl text-primary p-4 sm:p-5 rounded-2xl max-w-[200px] text-sm hidden md:block border border-primary/5 transition-transform hover:-translate-y-1">
             <strong className="text-base">{precisionData.node1Title || 'Diagnosis'}</strong>
             <p className="text-xs mt-1 text-softgrey">{precisionData.node1Desc || 'Accurate tissue analysis and staging.'}</p>
           </div>
           <div className="absolute bottom-8 md:bottom-14 left-6 md:left-20 bg-ivory/95 backdrop-blur-sm shadow-xl text-primary p-4 sm:p-5 rounded-2xl max-w-[200px] text-sm hidden md:block border border-primary/5 transition-transform hover:-translate-y-1">
             <strong className="text-base">{precisionData.node2Title || 'Genomics'}</strong>
             <p className="text-xs mt-1 text-softgrey">{precisionData.node2Desc || 'Molecular tumor profiling.'}</p>
           </div>
        </div>

        <div className="text-center relative z-10 pt-2">
          <Link 
            to="/precision-oncology" 
            className="bg-accent text-primary hover:bg-white min-h-[50px] px-8 py-3.5 text-sm sm:text-base font-semibold rounded-full shadow-md transition-colors inline-flex items-center justify-center active:scale-[0.98]"
          >
            Explore Precision Oncology
          </Link>
        </div>
      </section>

      {/* 06_CONSULTATION_SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-lightsage text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-primary mb-4 sm:mb-6 leading-tight">
            The right guidance can make the journey <br className="hidden md:block"/> feel less overwhelming.
          </h2>
          <p className="text-softgrey mb-8 sm:mb-10 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-light">
            Schedule a consultation with Dr. Parmar to discuss your diagnosis, treatment options, or to seek a second opinion.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link 
              to="/contact" 
              className="bg-primary text-white hover:bg-charcoal min-h-[50px] px-8 py-3.5 text-sm sm:text-base font-medium rounded-full transition-all shadow-sm flex items-center justify-center active:scale-[0.98]"
            >
              Book Consultation
            </Link>
            <a 
              href="tel:+917087491471" 
              className="border border-primary text-primary hover:bg-primary hover:text-white min-h-[50px] px-8 py-3.5 text-sm sm:text-base font-medium rounded-full transition-all flex items-center justify-center active:scale-[0.98]"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
