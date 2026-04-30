import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award,
  GraduationCap,
  MessageSquare,
  Bell,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { authService, API_URL } from '../services/api';

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Student');

  useEffect(() => {
    // Fetch student profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch from /api/my-profile
        // For now, let's simulate or use available data
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudentData(data);
          if (data.name) setUserName(data.name);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Student Dashboard" />
        
        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <User size={48} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Hello, {userName}!</h1>
                <p className="text-orange-100 text-lg">Welcome back to your academic portal. Here's what's happening today.</p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                    ID: {studentData?.student_id || '2024-XXXX'}
                  </span>
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                    BS Computer Science
                  </span>
                  <span className="px-4 py-1.5 bg-green-400/20 backdrop-blur-sm rounded-full text-sm font-medium border border-green-400/30 text-green-100">
                    Regular Student
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Actions */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'My Courses', icon: BookOpen, color: 'blue', link: '/courses' },
                    { label: 'Schedule', icon: Clock, color: 'purple', link: '/schedules' },
                    { label: 'Events', icon: Calendar, color: 'pink', link: '/events' },
                    { label: 'Grades', icon: Award, color: 'orange', link: '#' },
                  ].map((action, i) => (
                    <Link 
                      key={i} 
                      to={action.link}
                      className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${action.color}-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`text-${action.color}-600`} size={24} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Course Progress */}
              <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Academic Progress</h2>
                  <Link to="/courses" className="text-orange-600 text-sm font-semibold hover:underline">View All</Link>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { name: 'Data Structures & Algorithms', progress: 85, grade: '1.25' },
                    { name: 'Web Development', progress: 92, grade: '1.0' },
                    { name: 'Database Management', progress: 65, grade: '1.75' },
                  ].map((course, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{course.name}</span>
                        <span className="text-sm font-bold text-orange-600">{course.grade}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-1000"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="space-y-8">
              {/* Profile Card Snippet */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{userName}</h3>
                    <p className="text-xs text-gray-500">{studentData?.email || 'student@ccs.edu'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <GraduationCap size={18} className="text-orange-500" />
                    <span>Year Level: 3rd Year</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={18} className="text-orange-500" />
                    <span>Section: CS3A</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <TrendingUp size={18} className="text-orange-500" />
                    <span>GPA: 1.42</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-colors border border-gray-200">
                  Edit Profile
                </button>
              </div>

              {/* Upcoming Events Widget */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calendar size={18} />
                    Upcoming Events
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { title: 'Tech Summit 2026', date: 'May 15', type: 'Conference' },
                    { title: 'Coding Bootcamp', date: 'May 20', type: 'Workshop' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-pink-100">
                      <div className="flex-shrink-0 w-12 h-12 bg-pink-50 rounded-lg flex flex-col items-center justify-center text-pink-600">
                        <span className="text-xs font-bold leading-none">{event.date.split(' ')[0]}</span>
                        <span className="text-lg font-black">{event.date.split(' ')[1]}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.type}</p>
                      </div>
                    </div>
                  ))}
                  <Link to="/events" className="block text-center text-sm font-bold text-pink-600 hover:text-pink-700 mt-2">
                    See all events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
