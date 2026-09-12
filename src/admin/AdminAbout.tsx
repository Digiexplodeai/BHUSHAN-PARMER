import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, CheckCircle } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Milestone } from '../types';
import ImageUpload from './components/ImageUpload';

export default function AdminAbout() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Milestone>>({});
  
  const [aboutData, setAboutData] = useState({
    label: 'About',
    heading: 'Meet Dr. Bhushan Parmar',
    paragraph1: 'Dr. Parmar is a dedicated Medical Oncologist with a focus on precision therapies.',
    paragraph2: 'With years of experience in the field, Dr. Parmar combines cutting-edge research with compassionate care.',
    imageUrl: '',
  });
  const [savingAbout, setSavingAbout] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'milestones'));
      const fetched: Milestone[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Milestone);
      });
      fetched.sort((a, b) => a.order - b.order);
      setMilestones(fetched);

      const aboutDoc = await getDoc(doc(db, 'settings', 'home_about'));
      if (aboutDoc.exists()) {
        const data = aboutDoc.data().value;
        setAboutData({
          label: data.label || 'About',
          heading: data.heading || 'Meet Dr. Bhushan Parmar',
          paragraph1: data.paragraph1 || 'Dr. Parmar is a dedicated Medical Oncologist with a focus on precision therapies.',
          paragraph2: data.paragraph2 || 'With years of experience in the field, Dr. Parmar combines cutting-edge research with compassionate care.',
          imageUrl: data.imageUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAbout = async () => {
    setSavingAbout(true);
    try {
      // We will merge this into home_about so we don't overwrite chips/badge if they exist
      const aboutDoc = await getDoc(doc(db, 'settings', 'home_about'));
      let existingData = {};
      if (aboutDoc.exists()) {
        existingData = aboutDoc.data().value;
      }
      
      await setDoc(doc(db, 'settings', 'home_about'), {
        value: {
          ...existingData,
          label: aboutData.label,
          heading: aboutData.heading,
          paragraph1: aboutData.paragraph1,
          paragraph2: aboutData.paragraph2,
          imageUrl: aboutData.imageUrl,
        }
      });
      
      setToastMessage('About page content saved successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Failed to save about data');
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'milestones', editingId), formData);
      } else {
        const newRef = doc(collection(db, 'milestones'));
        await setDoc(newRef, { ...formData, id: newRef.id });
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'milestones', id));
      setDeletingId(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const startEdit = (item: Milestone) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({ year: '', title: '', description: '', order: milestones.length });
    setIsAdding(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg border border-green-200 flex items-center z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">About / Milestones</h1>
          <p className="text-softgrey mt-1">Manage the doctor's professional journey and about page content.</p>
        </div>
      </div>

      {/* About Page Content Editor */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-serif text-charcoal mb-6">About Page Content</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Label (Small Header)</label>
              <input 
                type="text" 
                value={aboutData.label} 
                onChange={e => setAboutData({...aboutData, label: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Main Heading</label>
              <input 
                type="text" 
                value={aboutData.heading} 
                onChange={e => setAboutData({...aboutData, heading: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Paragraph 1 (Main Info)</label>
              <textarea 
                value={aboutData.paragraph1} 
                onChange={e => setAboutData({...aboutData, paragraph1: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Paragraph 2 (Secondary Info)</label>
              <textarea 
                value={aboutData.paragraph2} 
                onChange={e => setAboutData({...aboutData, paragraph2: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={3}
              ></textarea>
            </div>
          </div>
          <div>
            <ImageUpload 
              label="Doctor's Portrait" 
              value={aboutData.imageUrl} 
              onChange={(url) => setAboutData({...aboutData, imageUrl: url})} 
              aspectRatio="aspect-[3/4]"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
          <button 
            onClick={handleSaveAbout}
            disabled={savingAbout}
            className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{savingAbout ? 'Saving...' : 'Save About Content'}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-charcoal">Milestones</h2>
        <button 
          onClick={startAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-charcoal">{editingId ? 'Edit Milestone' : 'Add New Milestone'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Year/Date *</label>
                <input 
                  type="text" 
                  value={formData.year || ''} 
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 2015"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Order</label>
                <input 
                  type="number" 
                  value={formData.order || 0} 
                  onChange={e => setFormData({...formData, order: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
              <textarea 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={3}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.title || !formData.year || !formData.description}
                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Milestone</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8">
        <ul className="divide-y divide-gray-100">
          {loading ? (
            <li className="p-8 text-center text-gray-500">Loading...</li>
          ) : milestones.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No milestones added yet.</li>
          ) : (
            milestones.map(item => (
              <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div>
                    <h3 className="font-medium text-charcoal"><span className="text-primary mr-2 font-bold">{item.year}</span> {item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => startEdit(item)}
                    className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                    title="Edit Milestone"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {deletingId === item.id ? (
                    <div className="flex items-center space-x-1 bg-red-50 p-1 rounded border border-red-100">
                      <span className="text-xs text-red-600 font-medium px-2">Delete?</span>
                      <button onClick={() => handleDelete(item.id!)} className="p-1 text-red-600 hover:bg-red-200 rounded"><CheckCircle className="w-3 h-3" /></button>
                      <button onClick={() => setDeletingId(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeletingId(item.id!)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
