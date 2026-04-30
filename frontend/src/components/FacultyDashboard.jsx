import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock,
  ClipboardList,
  BarChart3,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Briefcase
} from 'lucide-react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { analyticsService, API_URL } from '../services/api';

function FacultyDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const facultyName = localStorage.getItem('userName') || 'Faculty Member';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDashboard();
      setData(response.data);
    } catch (err) {
      console.error('Faculty dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading faculty portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Faculty Dashboard" />
        
        <main className="p-6">
          {/* Faculty Welcome */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-orange-100 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
            <div className="z-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {facultyName}</h1>
              <p className="text-gray-500">You have 4 classes today and 2 pending student consultations.</p>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-semibold border border-orange-100">
                  <Clock size={16} />
                  Next Class: 1:30 PM
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                  <UserCheck size={16} />
                  12 Students Online
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://img.freepik.com/free-vector/male-teacher-standing-front-blackboard-pointing-something_1308-58611.jpg?t=st=1714446584~exp=1714450184~hmac=6e50e939a31a903c5f49629737976696773347c6a9992383c8808a3f80c65528&w=740" 
                alt="Faculty" 
                className="w-48 h-auto rounded-xl opacity-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Students', value: data?.summary.total_students || 0, icon: Users, color: 'blue' },
              { label: 'My Courses', value: '6', icon: BookOpen, color: 'purple' },
              { label: 'Avg Attendance', value: '94%', icon: CheckCircle, color: 'green' },
              { label: 'Pending Tasks', value: '3', icon: ClipboardList, color: 'orange' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Courses Management */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Assigned Courses</h2>
                  <Link to="/courses" className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Course Name</th>
                        <th className="px-6 py-4">Section</th>
                        <th className="px-6 py-4">Students</th>
                        <th className="px-6 py-4">Schedule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Introduction to AI', section: 'CS4A', students: 42, time: 'MW 9:00 AM' },
                        { name: 'Mobile App Dev', section: 'CS3B', students: 38, time: 'TTH 1:30 PM' },
                        { name: 'Ethics in Computing', section: 'CS4B', students: 45, time: 'F 10:00 AM' },
                      ].map((course, i) => (
                        <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-700">{course.name}</td>
                          <td className="px-6 py-4 text-gray-600">{course.section}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">{course.students}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{course.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Student Analytics Shortcut */}
              <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Student Analytics</h3>
                  <p className="text-blue-100">Monitor student performance and identify those at risk.</p>
                </div>
                <Link 
                  to="/analytics" 
                  className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <BarChart3 size={20} />
                  Open Analytics
                </Link>
              </section>
            </div>

            {/* Right Sidebar - Calendar & Consultations */}
            <div className="space-y-8">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ClipboardList className="text-orange-600" size={20} />
                  Pending Tasks
                </h3>
                <div className="space-y-4">
                  {[
                    { task: 'Grade CS3B Quiz 2', due: 'Today', priority: 'High' },
                    { task: 'Submit Syllabus for CS4A', due: 'Tomorrow', priority: 'Medium' },
                    { task: 'Approve Consultation', due: 'May 3', priority: 'Low' },
                  ].map((task, i) => (
                    <div key={i} className="p-3 border border-gray-100 rounded-xl hover:border-orange-200 transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600">{task.task}</span>
                        <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${
                          task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                          task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Due {task.due}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                <Briefcase size={40} className="mx-auto mb-4 opacity-80" />
                <h3 className="font-bold text-xl mb-1">Faculty Meeting</h3>
                <p className="text-emerald-100 text-sm mb-4">Department meeting starts in 2 hours.</p>
                <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold hover:bg-white/30 transition-all border border-white/30">
                  Join Zoom
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FacultyDashboard;
