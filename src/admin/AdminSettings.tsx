import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    hospitalName: 'ClearMedi Multispeciality Hospital',
    address: 'Kharar, Punjab',
    phone: '+91 70874 91471',
    email: 'drbhushanparmar@gmail.com',
    whatsappNumber: '+917087491471',
    workingHours: 'Mon - Sat: 9:00 AM - 5:00 PM',
  });

  const [r2Data, setR2Data] = useState({
    r2AccountId: '',
    r2AccessKeyId: '',
    r2SecretAccessKey: '',
    r2BucketName: '',
    r2PublicUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = await getDoc(doc(db, 'settings', 'r2_credentials'));
        if (docRef.exists()) {
          setR2Data(docRef.data().value || {});
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'r2_credentials'), {
        key: 'r2_credentials',
        value: r2Data,
        updatedAt: new Date().toISOString()
      });
      showToast('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full pb-12 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-50 text-green-700 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center space-x-3 border border-green-200 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-charcoal">Settings</h1>
        <p className="text-softgrey mt-1">Manage global website settings and contact information.</p>
      </div>

      <div className="space-y-8">
        {/* Contact Info Section */}
        <section className="bg-white rounded shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-serif text-charcoal">Contact Details</h2>
            <p className="text-sm text-gray-500 mt-1">These details appear in the header, footer, and contact page.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Clinic / Hospital Name</label>
              <input 
                type="text" 
                value={formData.hospitalName}
                onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Public Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Public Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">WhatsApp Number (for chat link)</label>
              <input 
                type="text" 
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Working Hours</label>
              <input 
                type="text" 
                value={formData.workingHours}
                onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-serif text-charcoal">Cloudflare R2 Image Hosting</h2>
            <p className="text-sm text-gray-500 mt-1">Configure these credentials to enable image uploads on the website.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">R2 Account ID</label>
              <input 
                type="text" 
                value={r2Data.r2AccountId}
                onChange={(e) => setR2Data({...r2Data, r2AccountId: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Access Key ID</label>
              <input 
                type="text" 
                value={r2Data.r2AccessKeyId}
                onChange={(e) => setR2Data({...r2Data, r2AccessKeyId: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Secret Access Key</label>
              <input 
                type="password" 
                value={r2Data.r2SecretAccessKey}
                onChange={(e) => setR2Data({...r2Data, r2SecretAccessKey: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Bucket Name</label>
              <input 
                type="text" 
                value={r2Data.r2BucketName}
                onChange={(e) => setR2Data({...r2Data, r2BucketName: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Public URL (optional)</label>
              <input 
                type="text" 
                value={r2Data.r2PublicUrl}
                onChange={(e) => setR2Data({...r2Data, r2PublicUrl: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* Global Features Section */}
        <section className="bg-white rounded shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-serif text-charcoal">Global Features</h2>
            <p className="text-sm text-gray-500 mt-1">Toggle features across the website.</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium text-charcoal text-sm">Floating Action Buttons</h4>
                <p className="text-xs text-gray-500 mt-1">Show quick contact buttons on mobile devices</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle1" checked readOnly className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-primary appearance-none cursor-pointer translate-x-5 transition-transform" />
                <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-primary cursor-pointer"></label>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium text-charcoal text-sm">Appointment Form Active</h4>
                <p className="text-xs text-gray-500 mt-1">Allow patients to submit new requests via the website</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle2" checked readOnly className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-primary appearance-none cursor-pointer translate-x-5 transition-transform" />
                <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-primary cursor-pointer"></label>
              </div>
            </div>
          </div>
        </section>
        
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-8 py-3 rounded text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-70 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
