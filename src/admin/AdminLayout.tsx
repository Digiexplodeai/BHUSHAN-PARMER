import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, FileText, Activity } from 'lucide-react';

export default function AdminLayout() {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Home Page', icon: FileText, path: '/admin/home' },
    { name: 'Highlights', icon: FileText, path: '/admin/highlights' },
    { name: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { name: 'About / Milestones', icon: Users, path: '/admin/about' },
    { name: 'Treatments', icon: Activity, path: '/admin/treatments' },
    { name: 'Precision Oncology', icon: Activity, path: '/admin/precision-oncology' },
    { name: 'Patient Stories', icon: Users, path: '/admin/patient-stories' },
    { name: 'Blogs', icon: FileText, path: '/admin/blogs' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-serif text-2xl">Admin Panel</h2>
          <p className="text-xs text-white/50 mt-1">Dr. Bhushan Parmar</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-5 h-5 text-accent" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-sm hover:bg-white/10 transition-colors rounded text-red-300">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
