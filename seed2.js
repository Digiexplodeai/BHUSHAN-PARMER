import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const milestones = [
  { year: "2010", title: "Medical Degree", description: "Graduated with honors from top medical university.", order: 0 },
  { year: "2015", title: "Oncology Specialization", description: "Completed fellowship in Medical Oncology.", order: 1 },
  { year: "2020", title: "Precision Medicine Pioneer", description: "Led clinical trials for targeted genetic therapies.", order: 2 }
];

const cancerTypes = [
  { title: "Breast Cancer", slug: "breast-cancer", introduction: "Comprehensive precision care for breast cancer.", symptoms: "", riskFactors: "", diagnosis: "", treatmentOptions: "Targeted therapy, Immunotherapy, Chemotherapy", imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" },
  { title: "Lung Cancer", slug: "lung-cancer", introduction: "Advanced treatments for non-small cell and small cell lung cancer.", symptoms: "", riskFactors: "", diagnosis: "", treatmentOptions: "Immunotherapy, Targeted genetic therapies", imageUrl: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=800" },
  { title: "Gastrointestinal Cancers", slug: "gi-cancers", introduction: "Expert care for stomach, colon, and other GI cancers.", symptoms: "", riskFactors: "", diagnosis: "", treatmentOptions: "Chemotherapy, Targeted therapy", imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800" }
];

const testimonials = [
  { name: "Sarah J.", text: "Dr. Parmar's precision approach gave me hope when I thought I had none. His care is unmatched.", rating: 5, source: "Google", date: "2023-10-15", isVisible: true, order: 0 },
  { name: "Michael R.", text: "The team is incredibly supportive. They explained every step of my immunotherapy treatment clearly.", rating: 5, source: "Practo", date: "2023-11-02", isVisible: true, order: 1 },
  { name: "Anita K.", text: "A true expert in his field. The personalized care plan made all the difference in my recovery journey.", rating: 5, source: "Direct", date: "2023-12-10", isVisible: true, order: 2 }
];

async function seed() {
  for (const m of milestones) await addDoc(collection(db, 'milestones'), m);
  for (const c of cancerTypes) await addDoc(collection(db, 'cancerTypes'), c);
  for (const t of testimonials) await addDoc(collection(db, 'testimonials'), t);
  console.log('Seeding 2 complete!');
}

seed();
