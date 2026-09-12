import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const treatments = [
  {
    title: "Precision Oncology",
    description: "Targeted cancer therapies based on genetic profiling of tumors.",
    content: "Precision oncology involves analyzing the genetic makeup of a patient's tumor to identify specific mutations driving the cancer's growth. By understanding these unique genetic alterations, Dr. Parmar can select targeted therapies designed to attack the cancer cells specifically, often leading to better outcomes and fewer side effects compared to traditional treatments.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    order: 0,
    isVisible: true
  },
  {
    title: "Immunotherapy",
    description: "Harnessing the body's immune system to fight cancer.",
    content: "Immunotherapy is a groundbreaking approach that empowers the patient's own immune system to recognize and destroy cancer cells. This treatment can involve immune checkpoint inhibitors, cancer vaccines, or cellular therapies. It has shown remarkable success in treating various advanced cancers, offering hope for long-term remission in some patients.",
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
    order: 1,
    isVisible: true
  },
  {
    title: "Chemotherapy",
    description: "Advanced chemotherapeutic regimens tailored for maximum efficacy and minimal toxicity.",
    content: "Chemotherapy uses drugs to kill cancer cells or stop them from growing. Dr. Parmar utilizes the latest chemotherapeutic agents and tailored regimens to maximize the cancer-fighting effect while proactively managing side effects. This personalized approach aims to maintain the patient's quality of life during treatment.",
    imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800",
    order: 2,
    isVisible: true
  }
];

const blogs = [
  {
    title: "Understanding Precision Oncology",
    slug: "understanding-precision-oncology",
    content: "Precision oncology is changing the landscape of cancer treatment. Instead of a one-size-fits-all approach, we now look at the specific genetic mutations driving a patient's tumor. This allows us to use targeted therapies that are more effective and often have fewer side effects. The future of cancer care is personalized, and precision oncology is at the forefront of this revolution.",
    excerpt: "Learn how targeted therapies and genetic profiling are transforming cancer treatment.",
    category: "Treatments",
    author: "Dr. Bhushan Parmar",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    status: "published",
    publishedAt: new Date().toISOString()
  },
  {
    title: "The Role of Diet in Cancer Recovery",
    slug: "diet-in-cancer-recovery",
    content: "Nutrition plays a crucial role during and after cancer treatment. A balanced diet helps maintain strength, prevents body tissue breakdown, and rebuilds tissues that cancer treatment may harm. Eating well also helps combat fatigue, a common side effect of therapies. Focus on a diet rich in fruits, vegetables, lean proteins, and whole grains to support your body's healing process.",
    excerpt: "Discover how a balanced diet can support your body during and after cancer treatment.",
    category: "Lifestyle",
    author: "Dr. Bhushan Parmar",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    status: "published",
    publishedAt: new Date().toISOString()
  },
  {
    title: "Coping with Chemotherapy Side Effects",
    slug: "coping-with-chemotherapy-side-effects",
    content: "Chemotherapy is a powerful tool against cancer, but it can come with side effects like fatigue, nausea, and hair loss. It's important to communicate openly with your oncology team about any symptoms you experience. We have many effective strategies and medications to manage these side effects and improve your quality of life during treatment. Remember to rest, stay hydrated, and reach out for support.",
    excerpt: "Practical tips and medical strategies to manage the side effects of chemotherapy.",
    category: "Patient Care",
    author: "Dr. Bhushan Parmar",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800",
    status: "published",
    publishedAt: new Date().toISOString()
  }
];

async function seed() {
  try {
    for (const treatment of treatments) {
      await addDoc(collection(db, 'treatments'), treatment);
      console.log('Added treatment:', treatment.title);
    }
    
    for (const blog of blogs) {
      await addDoc(collection(db, 'blogs'), blog);
      console.log('Added blog:', blog.title);
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding:', error);
  }
}

seed();
