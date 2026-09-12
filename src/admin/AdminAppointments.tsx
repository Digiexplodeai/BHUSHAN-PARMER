import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Filter, Download, MessageCircle, Phone, Edit, Trash2, X } from 'lucide-react';
import { Appointment } from '../types';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'appointments'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appts: Appointment[] = [];
      snapshot.forEach((doc) => {
        appts.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAppointments(appts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'appointments', id), { status: newStatus });
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: newStatus as Appointment['status'] });
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    await updateDoc(doc(db, 'appointments', id), { notes });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment request?')) {
      await deleteDoc(doc(db, 'appointments', id));
      setSelectedAppt(null);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          appt.phone.includes(searchTerm) || 
                          (appt.email && appt.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Appointments</h1>
          <p className="text-softgrey mt-1">Manage patient consultation requests.</p>
        </div>
        <button className="flex items-center space-x-2 border border-gray-300 bg-white px-4 py-2 rounded text-sm text-charcoal hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-t shadow-sm border border-gray-200 border-b-0 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, phone, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Appointment Booked">Appointment Booked</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-b shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 sticky top-0">
              <tr>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading appointments...</td></tr>
              ) : filteredAppointments.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No appointments found.</td></tr>
              ) : (
                filteredAppointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-charcoal">{appt.patientName}</p>
                      <p className="text-gray-500 text-xs">{appt.phone} {appt.email && `• ${appt.email}`}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(appt.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{appt.consultationType}</td>
                    <td className="py-3 px-4">
                      <select 
                        value={appt.status}
                        onChange={(e) => handleUpdateStatus(appt.id!, e.target.value)}
                        className={`text-xs px-2 py-1 rounded border-none focus:ring-0 cursor-pointer font-medium
                          ${appt.status === 'New' ? 'bg-green-100 text-green-700' : 
                            appt.status === 'Contacted' ? 'bg-blue-100 text-blue-700' : 
                            appt.status === 'Appointment Booked' ? 'bg-purple-100 text-purple-700' : 
                            appt.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 
                            'bg-red-100 text-red-700'}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Appointment Booked">Appointment Booked</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedAppt(appt)}
                        className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                        title="View Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-charcoal/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-serif text-charcoal">Appointment Details</h2>
              <button onClick={() => setSelectedAppt(null)} className="text-gray-400 hover:text-charcoal transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-softgrey mb-2">Patient Info</h3>
                  <p className="font-medium text-lg text-charcoal">{selectedAppt.patientName}</p>
                  {selectedAppt.country && <p className="text-gray-600 text-sm mt-1">From: {selectedAppt.country}</p>}
                </div>
                
                <div className="space-y-3">
                  <a href={`tel:${selectedAppt.phone}`} className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors p-2 -mx-2 rounded hover:bg-gray-50">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{selectedAppt.phone}</span>
                  </a>
                  <a href={`https://wa.me/${selectedAppt.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-600 hover:text-green-600 transition-colors p-2 -mx-2 rounded hover:bg-gray-50">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span>WhatsApp Message</span>
                  </a>
                  {selectedAppt.email && (
                    <a href={`mailto:${selectedAppt.email}`} className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors p-2 -mx-2 rounded hover:bg-gray-50">
                      <span className="w-4 h-4 text-primary flex items-center justify-center">@</span>
                      <span>{selectedAppt.email}</span>
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-softgrey mb-2">Request Info</h3>
                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-charcoal">Type:</span> {selectedAppt.consultationType}</p>
                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-charcoal">Date Submitted:</span> {new Date(selectedAppt.submittedAt).toLocaleString()}</p>
                  <div className="mt-3">
                    <label className="text-sm font-medium text-charcoal block mb-1">Status</label>
                    <select 
                      value={selectedAppt.status}
                      onChange={(e) => handleUpdateStatus(selectedAppt.id!, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full focus:outline-none focus:border-primary"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Appointment Booked">Appointment Booked</option>
                      <option value="Completed">Completed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-softgrey mb-2">Patient Message</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap min-h-[100px]">
                    {selectedAppt.message || <span className="text-gray-400 italic">No message provided.</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-softgrey mb-2">Internal Notes</h3>
                  <textarea 
                    className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-primary resize-none"
                    rows={4}
                    placeholder="Add private notes about this patient/appointment here..."
                    defaultValue={selectedAppt.notes}
                    onBlur={(e) => handleSaveNotes(selectedAppt.id!, e.target.value)}
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-1">Notes are saved automatically on blur.</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 p-6 flex justify-between bg-gray-50">
              <button 
                onClick={() => handleDelete(selectedAppt.id!)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Request</span>
              </button>
              <button 
                onClick={() => setSelectedAppt(null)}
                className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

