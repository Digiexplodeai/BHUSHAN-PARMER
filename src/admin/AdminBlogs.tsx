import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Blog } from '../types';
import ImageUpload from './components/ImageUpload';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Cancer Awareness',
    author: 'Dr. Bhushan Parmar',
    imageUrl: '',
    status: 'draft'
  });

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Blog[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Blog);
      });
      setBlogs(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      publishedAt: formData.status === 'published' && (!editingId || !formData.publishedAt) 
        ? new Date().toISOString() 
        : formData.publishedAt
    };

    if (editingId) {
      await updateDoc(doc(db, 'blogs', editingId), dataToSave);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'blogs'), dataToSave);
      setIsAdding(false);
    }
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Cancer Awareness', author: 'Dr. Bhushan Parmar', imageUrl: '', status: 'draft' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await deleteDoc(doc(db, 'blogs', id));
    }
  };

  const startEdit = (item: Blog) => {
    setEditingId(item.id!);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Cancer Awareness', author: 'Dr. Bhushan Parmar', imageUrl: '', status: 'draft' });
    setIsAdding(true);
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Knowledge Centre</h1>
          <p className="text-softgrey mt-1">Manage blog posts and articles.</p>
        </div>
        <button 
          onClick={startAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-serif text-charcoal">{editingId ? 'Edit Article' : 'Write New Article'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Article Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Short Excerpt *</label>
                <textarea 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                  rows={2}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Main Content *</label>
                <textarea 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y font-mono"
                  rows={12}
                  placeholder="Supports markdown or HTML (placeholder)"
                ></textarea>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100 h-fit">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  <option value="Cancer Awareness">Cancer Awareness</option>
                  <option value="Symptoms & Early Detection">Symptoms & Early Detection</option>
                  <option value="Chemotherapy">Chemotherapy</option>
                  <option value="Immunotherapy">Immunotherapy</option>
                  <option value="Precision Oncology">Precision Oncology</option>
                  <option value="Patient Guidance">Patient Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Author</label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">URL Slug</label>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-500"
                />
              </div>

              <div>
                <ImageUpload 
                  label="Featured Image" 
                  value={formData.imageUrl || ''} 
                  onChange={(url) => setFormData({...formData, imageUrl: url})} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.title || !formData.content}
              className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{formData.status === 'published' ? 'Publish Article' : 'Save Draft'}</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded shadow-sm flex-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Article</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading articles...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-500">No articles written yet.</td></tr>
            ) : (
              blogs.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-charcoal">{item.title}</p>
                    <p className="text-gray-500 text-xs">/{item.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id!)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
