import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CancerType } from '../types';
import ImageUpload from './components/ImageUpload';

export default function AdminPrecisionOncology() {
  const [cancers, setCancers] = useState<CancerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CancerType>>({});

  const fetchCancers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cancerTypes'));
      const fetched: CancerType[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as CancerType);
      });
      setCancers(fetched);
    } catch (error) {
      console.error('Error fetching cancer types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancers();
  }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'cancerTypes', editingId), formData);
      } else {
        const newRef = doc(collection(db, 'cancerTypes'));
        await setDoc(newRef, { ...formData, id: newRef.id });
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      fetchCancers();
    } catch (error) {
      console.error('Error saving cancer type:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this cancer type?')) {
      try {
        await deleteDoc(doc(db, 'cancerTypes', id));
        fetchCancers();
      } catch (error) {
        console.error('Error deleting cancer type:', error);
      }
    }
  };

  const startEdit = (item: CancerType) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', introduction: '', symptoms: '', riskFactors: '', diagnosis: '', treatmentOptions: '', imageUrl: '' });
    setIsAdding(true);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Precision Oncology</h1>
          <p className="text-softgrey mt-1">Manage cancer types and conditions.</p>
        </div>
        <button 
          onClick={startAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cancer Type</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-charcoal">{editingId ? 'Edit Cancer Type' : 'Add New Cancer Type'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Breast Cancer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Slug</label>
                <input 
                  type="text" 
                  value={formData.slug || ''} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <ImageUpload 
              label="Cover Image" 
              value={formData.imageUrl || ''} 
              onChange={(url) => setFormData({...formData, imageUrl: url})} 
            />

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Introduction *</label>
              <textarea 
                value={formData.introduction || ''} 
                onChange={e => setFormData({...formData, introduction: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Treatment Options</label>
              <textarea 
                value={formData.treatmentOptions || ''} 
                onChange={e => setFormData({...formData, treatmentOptions: e.target.value})}
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
                disabled={!formData.title || !formData.introduction}
                className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Condition</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded shadow-sm flex-1 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {loading ? (
            <li className="p-8 text-center text-gray-500">Loading...</li>
          ) : cancers.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No conditions added yet.</li>
          ) : (
            cancers.map(item => (
              <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden border border-gray-200">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.introduction}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
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
