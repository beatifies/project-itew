import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { Calendar, Plus, Edit, Trash2, Search, X, Clock, MapPin, Users, BookOpen } from 'lucide-react';

function Schedules() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [formData, setFormData] = useState({
    course_id: '',
    faculty_id: '',
    section: '',
    room: '',
    lab: '',
    day: '',
    time_start: '',
    time_end: '',
    semester: '1st',
    academic_year: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const semesters = ['1st', '2nd', 'summer'];

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
    fetchFaculty();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSchedules();
      const scheduleData = response.data?.data || response.data || [];
      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedules. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiService.getCourses();
      setCourses(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await apiService.getFaculty();
      setFaculty(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching faculty:', err);
    }
  };

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        course_id: schedule.course_id || '',
        faculty_id: schedule.faculty_id || '',
        section: schedule.section || '',
        room: schedule.room || '',
        lab: schedule.lab || '',
        day: schedule.day || '',
        time_start: schedule.time_start || '',
        time_end: schedule.time_end || '',
        semester: schedule.semester || '1st',
        academic_year: schedule.academic_year || ''
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        course_id: '',
        faculty_id: '',
        section: '',
        room: '',
        lab: '',
        day: '',
        time_start: '',
        time_end: '',
        semester: '1st',
        academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await apiService.updateSchedule(editingSchedule.schedule_id, formData);
      } else {
        await apiService.createSchedule(formData);
      }
      handleCloseModal();
      fetchSchedules();
    } catch (err) {
      console.error('Error saving schedule:', err.response?.data || err.message);
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Validation errors:\n' + errorMessages);
      } else {
        alert('Failed to save schedule. Please check your data.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      await apiService.deleteSchedule(id);
      fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Failed to delete schedule.');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSchedules({ search: searchTerm });
      setSchedules(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          title="Schedule Management" 
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Schedules</h1>
              <p className="text-gray-600">Manage class schedules and room assignments</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add Schedule</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by course, faculty, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchSchedules();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Schedules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading schedules...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No schedules found</p>
                <p className="text-gray-400 text-sm">Click "Add Schedule" to create your first schedule</p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div 
                  key={schedule.schedule_id || schedule.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
                    <h3 className="font-bold text-white text-lg">
                      {schedule.course?.course_code || schedule.course_id}
                    </h3>
                    <p className="text-orange-100 text-sm">{schedule.course?.course_title || ''}</p>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-orange-600" />
                        <span>{schedule.faculty?.name || schedule.faculty_id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>{schedule.day} • {schedule.time_start} - {schedule.time_end}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>{schedule.room}{schedule.lab ? ` (${schedule.lab})` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span>Section {schedule.section}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleOpenModal(schedule)}
                        className="flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.schedule_id || schedule.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                      <select
                        required
                        value={formData.course_id}
                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_code} - {course.course_title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
                      <select
                        required
                        value={formData.faculty_id}
                        onChange={(e) => setFormData({...formData, faculty_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Faculty</option>
                        {faculty.map(f => (
                          <option key={f.faculty_id} value={f.faculty_id}>
                            {f.name} ({f.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                      <input
                        type="text"
                        required
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., A, B, C"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
                      <input
                        type="text"
                        required
                        value={formData.room}
                        onChange={(e) => setFormData({...formData, room: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Room 301"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lab (Optional)</label>
                      <input
                        type="text"
                        value={formData.lab}
                        onChange={(e) => setFormData({...formData, lab: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Lab 101"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
                      <select
                        required
                        value={formData.day}
                        onChange={(e) => setFormData({...formData, day: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Day</option>
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                      <input
                        type="time"
                        required
                        value={formData.time_start}
                        onChange={(e) => setFormData({...formData, time_start: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                      <input
                        type="time"
                        required
                        value={formData.time_end}
                        onChange={(e) => setFormData({...formData, time_end: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                      <select
                        required
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {semesters.map(sem => (
                          <option key={sem} value={sem}>{sem} Semester</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                      <input
                        type="text"
                        required
                        value={formData.academic_year}
                        onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., 2026-2027"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all font-semibold shadow-lg"
                    >
                      {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Schedules;
