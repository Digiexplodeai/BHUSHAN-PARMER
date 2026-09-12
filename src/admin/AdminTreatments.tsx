import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Treatment } from '../types';
import ImageUpload from './components/ImageUpload';

export default function AdminTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<Treatment>>({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    order: 0,
    isVisible: true
  });

  useEffect(() => {
    const q = query(collection(db, 'treatments'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Treatment[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Treatment);
      });
      setTreatments(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (editingId) {
      await updateDoc(doc(db, 'treatments', editingId), formData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'treatments'), formData);
      setIsAdding(false);
    }
    setFormData({ title: '', description: '', content: '', imageUrl: '', order: treatments.length, isVisible: true });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      await deleteDoc(doc(db, 'treatments', id));
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'treatments', id), { isVisible: !current });
  };

  const startEdit = (item: Treatment) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', content: '', imageUrl: '', order: treatments.length, isVisible: true });
    setIsAdding(true);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Treatments</h1>
          <p className="text-softgrey mt-1">Manage areas of expertise and treatment offerings.</p>
        </div>
        <button 
          onClick={startAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Treatment</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-charcoal">{editingId ? 'Edit Treatment' : 'Add New Treatment'}</h2>
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
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Immunotherapy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Order</label>
                <input 
                  type="number" 
                  value={formData.order} 
                  onChange={e => setFormData({...formData, order: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <ImageUpload 
              label="Treatment Image" 
              value={formData.imageUrl || ''} 
              onChange={(url) => setFormData({...formData, imageUrl: url})} 
            />
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Short Description *</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                rows={2}
                placeholder="Brief summary for cards"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Full Content</label>
              <textarea 
                value={formData.content || ''} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                rows={5}
                placeholder="Detailed description for the dedicated page"
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <input 
                type="checkbox" 
                id="isVisible"
                checked={formData.isVisible}
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
                <span>Save Treatment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded shadow-sm flex-1 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {loading ? (
            <li className="p-8 text-center text-gray-500">Loading...</li>
          ) : treatments.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No treatments added yet.</li>
          ) : (
            treatments.map(item => (
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
