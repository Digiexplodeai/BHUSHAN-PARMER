import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Highlight } from '../types';
import ImageUpload from './components/ImageUpload';

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Highlight>>({});

  const fetchHighlights = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'highlights'));
      const fetched: Highlight[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Highlight);
      });
      fetched.sort((a, b) => a.order - b.order);
      setHighlights(fetched);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'highlights', editingId), formData);
      } else {
        const newRef = doc(collection(db, 'highlights'));
        await setDoc(newRef, { ...formData, id: newRef.id });
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      fetchHighlights();
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this highlight?')) {
      try {
        await deleteDoc(doc(db, 'highlights', id));
        fetchHighlights();
      } catch (error) {
        console.error('Error deleting highlight:', error);
      }
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'highlights', id), { isVisible: !current });
      fetchHighlights();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const startEdit = (item: Highlight) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', iconName: '', imageUrl: '', order: highlights.length, isVisible: true });
    setIsAdding(true);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Key Highlights</h1>
          <p className="text-softgrey mt-1">Manage the key features and highlights section.</p>
        </div>
        <button 
          onClick={startAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Highlight</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-charcoal">{editingId ? 'Edit Highlight' : 'Add New Highlight'}</h2>
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
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Modern Equipment"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Predefined Icon</label>
                <select 
                  value={formData.iconName || ''} 
                  onChange={e => setFormData({...formData, iconName: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">None (Use Image URL or Default)</option>
                  <option value="Award">Award (Experience/Quality)</option>
                  <option value="Target">Target (Precision/Accuracy)</option>
                  <option value="Heart">Heart (Compassion/Care)</option>
                  <option value="CheckCircle2">CheckCircle (Success/Verification)</option>
                </select>
              </div>
            </div>

            <ImageUpload 
              label="Cover Image (Optional)" 
              value={formData.imageUrl || ''} 
              onChange={(url) => setFormData({...formData, imageUrl: url})} 
              aspectRatio="aspect-video w-full"
            />

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
              <textarea 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={3}
                placeholder="Description of the feature"
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
                disabled={!formData.title || !formData.description}
                className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Highlight</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded shadow-sm flex-1 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {loading ? (
            <li className="p-8 text-center text-gray-500">Loading...</li>
          ) : highlights.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No highlights added yet.</li>
          ) : (
            highlights.map(item => (
              <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden border border-gray-200 p-2 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">No icon</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                      <span>Order: {item.order}</span>
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
