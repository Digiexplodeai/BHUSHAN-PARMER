import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const testimonials = [
  { name: "Sarah J.", text: "Dr. Parmar's precision approach gave me hope when I thought I had none. His care is unmatched.", rating: 5, source: "Google", date: "2023-10-15", isVisible: true, order: 0 }
];

async function seed() {
  for (const t of testimonials) {
    try {
      await addDoc(collection(db, 'testimonials'), t);
      console.log('Added testimonial');
    } catch(e) {
      console.log('Failed testimonial', e.message);
    }
  }
}

seed();
