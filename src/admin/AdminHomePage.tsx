import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, CheckCircle } from 'lucide-react';
import ImageUpload from './components/ImageUpload';

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [heroData, setHeroData] = useState({
    label: 'Precision Oncology',
    heading1: 'Expert cancer care.',
    heading2: 'Built around you.',
    paragraph: 'Advanced systemic therapies and personalized treatment plans in a compassionate environment.',
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

  const [toastMessage, setToastMessage] = useState('');

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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (section: string, data: any) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', section), {
        key: section,
        value: data,
        updatedAt: new Date().toISOString()
      });
      showToast('Saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Error saving data.');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-12 space-y-8 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-50 text-green-700 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center space-x-3 border border-green-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-serif text-charcoal">Home Page Content</h1>
        <p className="text-softgrey mt-1">Manage the text and images displayed on the main home page.</p>
      </div>

      {/* Hero Section */}
      <section className="bg-white rounded shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t">
          <h2 className="text-xl font-serif text-charcoal">Hero Section</h2>
          <button 
            onClick={() => handleSave('home_hero', heroData)}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Hero</span>
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Eyebrow Label</label>
              <input 
                type="text" 
                value={heroData.label} 
                onChange={e => setHeroData({...heroData, label: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Heading Line 1</label>
              <input 
                type="text" 
                value={heroData.heading1} 
                onChange={e => setHeroData({...heroData, heading1: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-2xl font-serif"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Heading Line 2 (Accent)</label>
              <input 
                type="text" 
                value={heroData.heading2} 
                onChange={e => setHeroData({...heroData, heading2: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-2xl font-serif text-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Paragraph</label>
              <textarea 
                value={heroData.paragraph} 
                onChange={e => setHeroData({...heroData, paragraph: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                rows={3}
              ></textarea>
            </div>
          </div>
          
          <div className="space-y-4">
            <ImageUpload 
              label="Hero Image" 
              value={heroData.imageUrl} 
              onChange={(url) => setHeroData({...heroData, imageUrl: url})} 
              aspectRatio="aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white rounded shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t">
          <h2 className="text-xl font-serif text-charcoal">About Section</h2>
          <button 
            onClick={() => handleSave('home_about', aboutData)}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save About</span>
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Eyebrow Label</label>
              <input 
                type="text" 
                value={aboutData.label} 
                onChange={e => setAboutData({...aboutData, label: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Main Heading</label>
              <textarea 
                value={aboutData.heading} 
                onChange={e => setAboutData({...aboutData, heading: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary font-serif text-xl resize-none"
                rows={2}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Paragraph 1</label>
              <textarea 
                value={aboutData.paragraph1} 
                onChange={e => setAboutData({...aboutData, paragraph1: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={4}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Paragraph 2</label>
              <textarea 
                value={aboutData.paragraph2} 
                onChange={e => setAboutData({...aboutData, paragraph2: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={4}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Badge Title</label>
              <input 
                type="text" 
                value={aboutData.badgeTitle || ''} 
                onChange={e => setAboutData({...aboutData, badgeTitle: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. MD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Badge Subtitle</label>
              <input 
                type="text" 
                value={aboutData.badgeSubtitle || ''} 
                onChange={e => setAboutData({...aboutData, badgeSubtitle: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. Medical Oncology"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <ImageUpload 
              label="About Section Image" 
              value={aboutData.imageUrl} 
              onChange={(url) => setAboutData({...aboutData, imageUrl: url})} 
              aspectRatio="aspect-[3/4]"
            />
          </div>
        </div>
      </section>

      {/* Precision Oncology Section */}
      <section className="bg-white rounded shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t">
          <h2 className="text-xl font-serif text-charcoal">Precision Oncology Section</h2>
          <button 
            onClick={() => handleSave('home_precision', precisionData)}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Section</span>
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Heading Line 1</label>
              <input 
                type="text" 
                value={precisionData.heading1} 
                onChange={e => setPrecisionData({...precisionData, heading1: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary font-serif text-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Heading Line 2 (Accent)</label>
              <input 
                type="text" 
                value={precisionData.heading2} 
                onChange={e => setPrecisionData({...precisionData, heading2: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary font-serif text-xl text-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Paragraph</label>
              <textarea 
                value={precisionData.paragraph} 
                onChange={e => setPrecisionData({...precisionData, paragraph: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={5}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Node 1 Title</label>
                <input 
                  type="text" 
                  value={precisionData.node1Title || ''} 
                  onChange={e => setPrecisionData({...precisionData, node1Title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Node 1 Description</label>
                <input 
                  type="text" 
                  value={precisionData.node1Desc || ''} 
                  onChange={e => setPrecisionData({...precisionData, node1Desc: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Node 2 Title</label>
                <input 
                  type="text" 
                  value={precisionData.node2Title || ''} 
                  onChange={e => setPrecisionData({...precisionData, node2Title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Node 2 Description</label>
                <input 
                  type="text" 
                  value={precisionData.node2Desc || ''} 
                  onChange={e => setPrecisionData({...precisionData, node2Desc: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <ImageUpload 
              label="Background Image" 
              value={precisionData.imageUrl} 
              onChange={(url) => setPrecisionData({...precisionData, imageUrl: url})} 
              aspectRatio="aspect-video"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
