import { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  aspectRatio?: string;
}

export default function ImageUpload({ value, onChange, label, aspectRatio = 'aspect-video' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension to keep base64 size small enough for Firestore
          const MAX_DIM = 1200;
          if (width > height && width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            onChange(dataUrl);
          } else {
            setError('Failed to process image');
          }
          setUploading(false);
        };
        img.onerror = () => {
          setError('Invalid image file');
          setUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process image.');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">{label}</label>
        
        <div className="flex flex-col space-y-3">
          {/* Primary Upload Button */}
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <div className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-gray-50/50 border-gray-300 hover:bg-gray-50 hover:border-primary'}`}>
              {uploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <p className="text-sm font-medium text-charcoal">
                {uploading ? 'Processing...' : 'Click to upload an image'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From your computer or device
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 uppercase font-semibold">OR</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Secondary URL Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Use an image URL</label>
            <input 
              type="text" 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2 flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-gray-500" />
          <span>Image Preview</span>
        </label>
        <div className={`w-full ${aspectRatio} bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group`}>
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
      </div>
    </div>
  );
}
