import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    country: '',
    consultationType: 'First Consultation',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        status: 'New',
        submittedAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({
        patientName: '', phone: '', email: '', country: '', consultationType: 'First Consultation', message: ''
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="mb-10 sm:mb-16">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary mb-3 sm:mb-4">Book a Consultation</h1>
        <p className="text-softgrey max-w-2xl text-base sm:text-lg font-light leading-relaxed">
          We are here to provide expert medical oncology care. Fill out the form below to request an appointment, and our team will get back to you promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Contact Info */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-primary mb-5">Contact Information</h3>
            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">Phone Number</h4>
                  <a href="tel:+917087491471" className="text-softgrey text-sm mt-1 hover:text-accent block">+91 70874 91471</a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">Email Address</h4>
                  <a href="mailto:drbhushanparmar@gmail.com" className="text-softgrey text-sm mt-1 hover:text-accent block">drbhushanparmar@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">Working Hours</h4>
                  <p className="text-softgrey text-sm mt-1">Mon - Sat: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 md:p-12 shadow-xs rounded-2xl sm:rounded-3xl border border-primary/10">
          {status === 'success' ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-primary mb-2">Request Received</h3>
              <p className="text-softgrey">Thank you for reaching out. Our team will contact you shortly to confirm your appointment.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 bg-primary text-white px-8 py-3.5 text-sm font-medium rounded-full hover:bg-charcoal transition-colors min-h-[48px]"
              >
                Book Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.patientName}
                    onChange={e => setFormData({...formData, patientName: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-accent transition-colors bg-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Phone Number *</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-accent transition-colors bg-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-accent transition-colors bg-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Consultation Type</label>
                  <select 
                    value={formData.consultationType}
                    onChange={e => setFormData({...formData, consultationType: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-accent transition-colors bg-transparent"
                  >
                    <option value="First Consultation">First Consultation</option>
                    <option value="Second Opinion">Second Opinion</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="International Consultation">International Consultation</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">How can we help you? *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-accent transition-colors bg-transparent resize-none"
                  placeholder="Briefly describe your condition or what you would like to discuss"
                ></textarea>
              </div>
              {status === 'error' && (
                <p className="text-red-500 text-sm">Failed to submit request. Please try again or call us directly.</p>
              )}
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 text-sm sm:text-base font-medium rounded-full hover:bg-charcoal transition-colors disabled:opacity-70 min-h-[48px] shadow-sm"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
