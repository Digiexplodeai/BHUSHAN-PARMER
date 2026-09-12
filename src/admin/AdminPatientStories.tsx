import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Testimonial } from '../types';

export default function AdminPatientStories() {
  const [stories, setStories] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});

  const fetchStories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'testimonials'));
      const fetched: Testimonial[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      fetched.sort((a, b) => a.order - b.order);
      setStories(fetched);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), formData);
      } else {
        const newRef = doc(collection(db, 'testimonials'));
        await setDoc(newRef, { ...formData, id: newRef.id });
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient story?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        fetchStories();
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), { isVisible: !current });
      fetchStories();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const startEdit = (item: Testimonial) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({ name: '', text: '', rating: 5, source: '', date: new Date().toISOString().split('T')[0], order: stories.length, isVisible: true });
    setIsAdding(true);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Patient Stories</h1>
          <p className="text-softgrey mt-1">Manage patient testimonials and reviews.</p>
        </div>
        <button 
          onClick={startAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Story</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-charcoal">{editingId ? 'Edit Story' : 'Add New Story'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Patient Name *</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Source (e.g. Google, Practo)</label>
                <input 
                  type="text" 
                  value={formData.source || ''} 
                  onChange={e => setFormData({...formData, source: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Date</label>
                <input 
                  type="date" 
                  value={formData.date || ''} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
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
              <label className="block text-sm font-medium text-charcoal mb-1">Testimonial Text *</label>
              <textarea 
                value={formData.text || ''} 
                onChange={e => setFormData({...formData, text: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={4}
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <input 
                type="checkbox" 
                id="isVisible"
                checked={formData.isVisible || false}
                onChange={e => setFormData({...formData, isVisible: e.target.checked})}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isVisible" className="text-sm text-gray-700">Visible on website</label>
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
                disabled={!formData.name || !formData.text}
                className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded shadow-sm flex-1 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {loading ? (
            <li className="p-8 text-center text-gray-500">Loading...</li>
          ) : stories.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No patient stories added yet.</li>
          ) : (
            stories.map(item => (
              <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div>
                    <h3 className="font-medium text-charcoal">{item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.text}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                      <span>{item.source} • {item.date}</span>
                      <span className={item.isVisible ? 'text-green-600' : 'text-red-500'}>
                        {item.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => toggleVisibility(item.id!, item.isVisible)}
                    className="p-2 text-gray-400 hover:text-charcoal transition-colors"
                    title={item.isVisible ? 'Hide' : 'Show'}
                  >
                    {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => startEdit(item)}
                    className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
