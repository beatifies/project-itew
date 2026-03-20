import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/api';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      console.log('Attempting to fetch analytics...');
      const response = await analyticsService.getDashboard();
      console.log('Response received:', response);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Dashboard error:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication required. Please login first.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Make sure Laravel is running on http://localhost:8000');
      } else {
        setError('Failed to load dashboard data. Backend returned: ' + (err.response?.status || 'unknown status'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border border-orange-200">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">⚠️ Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadDashboard}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-semibold shadow-lg"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Dashboard" />
        
        <main className="p-6">
          {/* Welcome Banner with Stats */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 rounded-2xl p-8 mb-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-3">Welcome to CCS Profiling System</h1>
                  <p className="text-orange-100 text-lg">Comprehensive Academic Management & Analytics Platform</p>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-sm text-orange-100 mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="font-semibold">Operational</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-orange-200" />
                    <div>
                      <p className="text-2xl font-bold">{data?.summary.total_students || 0}</p>
                      <p className="text-sm text-orange-100">Total Students</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-orange-200" />
                    <div>
                      <p className="text-2xl font-bold">{data?.summary.total_faculty || 0}</p>
                      <p className="text-sm text-orange-100">Total Faculty</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-orange-200" />
                    <div>
                      <p className="text-2xl font-bold">{data?.summary.average_gpa || 'N/A'}</p>
                      <p className="text-sm text-orange-100">Average GPA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/students"
                className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-500"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Manage Students</h3>
                  <p className="text-sm text-gray-500">View & edit student records</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/faculty"
                className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Manage Faculty</h3>
                  <p className="text-sm text-gray-500">Faculty information</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/courses"
                className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Courses</h3>
                  <p className="text-sm text-gray-500">Course management</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/events"
                className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-pink-500"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Events</h3>
                  <p className="text-sm text-gray-500">Event schedules</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Overview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students by Program */}
              <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-500 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Students by Program
                    </h3>
                    <Link to="/students" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      View All <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {data?.students.by_program && data.students.by_program.length > 0 ? (
                      data.students.by_program.map((item, index) => (
                        <div key={index} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{item.program}</span>
                            <span className="text-sm font-bold text-gray-900">{item.count} students</span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                              style={{ width: `${(item.count / data.summary.total_students) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No student data available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Faculty by Role */}
              <div className="bg-white rounded-xl shadow-lg border-t-4 border-green-500 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-white px-6 py-4 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Faculty Distribution
                    </h3>
                    <Link to="/faculty" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                      View All <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {data?.faculty.by_role && data.faculty.by_role.length > 0 ? (
                      data.faculty.by_role.map((item, index) => (
                        <div key={index} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">{item.ccs_role}</span>
                            <span className="text-sm font-bold text-gray-900">{item.count} faculty</span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 group-hover:from-green-600 group-hover:to-green-700"
                              style={{ width: `${(item.count / data.summary.total_faculty) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No faculty data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students by Year Level */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-purple-500 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Students by Year Level
                  </h3>
                  <Link to="/students" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    Manage Students <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {data?.students.by_year_level && data.students.by_year_level.length > 0 ? (
                    data.students.by_year_level.map((item, index) => (
                      <div 
                        key={index} 
                        className="group text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-purple-200"
                      >
                        <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
                          {item.year_level}
                        </div>
                        <div className="text-sm text-purple-700 font-medium mb-1">Year Level</div>
                        <div className="text-3xl font-bold text-purple-900">{item.count}</div>
                        <div className="text-xs text-purple-600 mt-1">students</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No year level data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-pink-500 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-50 to-white px-6 py-4 border-b border-pink-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-pink-600" />
                    Upcoming Events
                  </h3>
                  <Link to="/events" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                    View Calendar <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {data?.events.upcoming && data.events.upcoming.length > 0 ? (
                  <div className="space-y-4">
                    {data.events.upcoming.slice(0, 5).map((event, index) => {
                      const eventTypeColors = {
                        curricular: 'bg-blue-500',
                        extracurricular: 'bg-pink-500',
                        research: 'bg-purple-500',
                        extension: 'bg-green-500'
                      };
                      
                      return (
                        <div 
                          key={index}
                          className="group flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-pink-300 transition-all"
                        >
                          {/* Date Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex flex-col items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                              <Calendar className="w-6 h-6 opacity-80" />
                            </div>
                          </div>
                          
                          {/* Event Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors">
                                  {event.event_name}
                                </h4>
                                
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-pink-600" />
                                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Target className="w-4 h-4 text-pink-600" />
                                    <span>{event.venue}</span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                    eventTypeColors[event.event_type] || 'bg-gray-500'
                                  }`}>
                                    {event.event_type}
                                  </span>
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                    {event.category}
                                  </span>
                                </div>
                              </div>
                              
                              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No upcoming events</p>
                    <p className="text-gray-400 text-sm">Check back later for new events</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 py-6 border-t border-orange-200">
            <p className="text-sm">&copy; 2026 CCS Profiling System. Built with Laravel & React.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
