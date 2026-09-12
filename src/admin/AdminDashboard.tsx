import { Users, Calendar, Activity, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Appointments', value: '124', icon: Calendar },
    { label: 'Treatments Listed', value: '12', icon: Activity },
    { label: 'Published Blogs', value: '8', icon: FileText },
    { label: 'Patient Inquiries', value: '45', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-charcoal">Dashboard</h1>
        <p className="text-softgrey mt-1">Overview of your website activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
        <h2 className="text-xl font-serif text-charcoal mb-4">Recent Appointment Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Date Requested</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50">
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4">Oct 24, 2026</td>
                <td className="py-3 px-4">First Consultation</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">New</span></td>
                <td className="py-3 px-4 text-right"><button className="text-primary hover:underline">View</button></td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">Oct 23, 2026</td>
                <td className="py-3 px-4">Second Opinion</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Contacted</span></td>
                <td className="py-3 px-4 text-right"><button className="text-primary hover:underline">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
