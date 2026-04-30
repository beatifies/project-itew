import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'student';

  const menuItemsByRole = {
    admin: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/students', icon: Users, label: 'Students' },
      { path: '/faculty', icon: GraduationCap, label: 'Faculty' },
      { path: '/courses', icon: BookOpen, label: 'Courses' },
      { path: '/instructions', icon: FileText, label: 'Instructions' },
      { path: '/schedules', icon: Calendar, label: 'Schedules' },
      { path: '/events', icon: Calendar, label: 'Events' },
      { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ],
    faculty: [
      { path: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/students', icon: Users, label: 'Students' },
      { path: '/courses', icon: BookOpen, label: 'Courses' },
      { path: '/instructions', icon: FileText, label: 'Instructions' },
      { path: '/schedules', icon: Calendar, label: 'Schedules' },
      { path: '/events', icon: Calendar, label: 'Events' },
      { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ],
    student: [
      { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/events', icon: Calendar, label: 'Events' },
    ],
  };

  const menuItems = menuItemsByRole[userRole] || menuItemsByRole.student;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 
        bg-gradient-to-b from-orange-600 to-orange-700 
        text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-orange-500">
          <div>
            <h1 className="text-2xl font-bold">CCS</h1>
            <p className="text-xs text-orange-200">Profiling System</p>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 mb-2 rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-white text-orange-600 shadow-lg' 
                    : 'text-white hover:bg-orange-500 hover:bg-opacity-50'}
                `}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-orange-500 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
