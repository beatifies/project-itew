import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { BookOpen, Plus, Edit, Trash2, Search, X, FileText, Users, Calendar } from 'lucide-react';

function Courses() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    course_id: '',
    course_code: '',
    course_title: '',
    program: '',
    units: '',
    year_level: '',
    semester: '1st',
    learning_outcomes: ''
  });

  const programs = [
    'BS Computer Science',
    'BS Information Technology',
    'BS Entertainment and Multimedia Computing',
    'BS Multimedia Arts'
  ];

  const semesters = ['1st', '2nd', 'summer'];
  const yearLevels = [1, 2, 3, 4];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCourses();
      const courseData = response.data?.data || response.data || [];
      setCourses(Array.isArray(courseData) ? courseData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        course_id: course.course_id || '',
        course_code: course.course_code || '',
        course_title: course.course_title || '',
        program: course.program || '',
        units: course.units || '',
        year_level: course.year_level || '',
        semester: course.semester || '1st',
        learning_outcomes: typeof course.learning_outcomes === 'object' 
          ? JSON.stringify(course.learning_outcomes, null, 2) 
          : course.learning_outcomes
      });
    } else {
      setEditingCourse(null);
      setFormData({
        course_id: '',
        course_code: '',
        course_title: '',
        program: '',
        units: '',
        year_level: '',
        semester: '1st',
        learning_outcomes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        units: parseInt(formData.units),
        year_level: parseInt(formData.year_level),
        learning_outcomes: JSON.parse(formData.learning_outcomes)
      };

      if (editingCourse) {
        await apiService.updateCourse(editingCourse.course_id, dataToSubmit);
      } else {
        await apiService.createCourse(dataToSubmit);
      }
      handleCloseModal();
      fetchCourses();
    } catch (err) {
      console.error('Error saving course:', err.response?.data || err.message);
      if (err.message.includes('JSON')) {
        alert('Invalid JSON format for learning outcomes. Please use array format. Example: ["Outcome 1", "Outcome 2"]');
      } else {
        const errors = err.response?.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join('\n');
          alert('Validation errors:\n' + errorMessages);
        } else {
          alert('Failed to save course. Please check your data.');
        }
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await apiService.deleteCourse(id);
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course.');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCourses({ search: searchTerm });
      setCourses(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching courses:', err);
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
          title="Course Management" 
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Courses</h1>
              <p className="text-gray-600">Manage curriculum and course offerings</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add Course</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses by code or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchCourses();
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

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No courses found</p>
                <p className="text-gray-400 text-sm">Click "Add Course" to create your first course</p>
              </div>
            ) : (
              courses.map((course) => (
                <div 
                  key={course.course_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                    <h3 className="font-bold text-white text-lg">
                      {course.course_code}
                    </h3>
                    <p className="text-green-100 text-sm">{course.course_title}</p>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span>{course.program}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Year {course.year_level} • {course.units} units</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{course.semester} Semester</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleOpenModal(course)}
                        className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.course_id)}
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
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.course_id}
                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., CS101"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.course_code}
                        onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., CC 101"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.course_title}
                        onChange={(e) => setFormData({...formData, course_title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Introduction to Programming"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                      <select
                        required
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Program</option>
                        {programs.map(prog => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Units *</label>
                        <input
                          type="number"
                          required
                          value={formData.units}
                          onChange={(e) => setFormData({...formData, units: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Level *</label>
                        <select
                          required
                          value={formData.year_level}
                          onChange={(e) => setFormData({...formData, year_level: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Year</option>
                          {yearLevels.map(level => (
                            <option key={level} value={level}>Year {level}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                      <select
                        required
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {semesters.map(sem => (
                          <option key={sem} value={sem}>{sem} Semester</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes (JSON Array) *</label>
                      <textarea
                        required
                        value={formData.learning_outcomes}
                        onChange={(e) => setFormData({...formData, learning_outcomes: e.target.value})}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                        placeholder='Example: ["Understand programming fundamentals", "Apply problem-solving skills"]'
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                    >
                      {editingCourse ? 'Update Course' : 'Create Course'}
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

export default Courses;
