import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { Users, Plus, Edit, Trash2, Search, X, ChevronRight, ChevronDown, FolderOpen, UserCheck } from 'lucide-react';

function Students() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Grouped students state
  const [groupedStudents, setGroupedStudents] = useState({});
  const [expandedPrograms, setExpandedPrograms] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    program: '',
    year_level: 1,
    section: '',
    gpa: '',
    academic_status: 'active',
    enrollment_status: 'enrolled'
  });

  const programs = [
    'BS Information Technology',
    'BS Computer Science'
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudents();
      const studentsData = response.data?.data || response.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      groupStudents(studentsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const groupStudents = (studentsList) => {
    const grouped = {};
    
    studentsList.forEach(student => {
      const program = student.program || 'Other';
      const section = student.section || 'Unassigned';
      
      if (!grouped[program]) {
        grouped[program] = {};
      }
      
      if (!grouped[program][section]) {
        grouped[program][section] = [];
      }
      
      grouped[program][section].push(student);
    });

    // Sort students alphabetically within each section
    Object.keys(grouped).forEach(program => {
      Object.keys(grouped[program]).forEach(section => {
        grouped[program][section].sort((a, b) => {
          const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
          const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      });
    });

    setGroupedStudents(grouped);
  };

  const toggleProgram = (program) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [program]: !prev[program]
    }));
  };

  const toggleSection = (program, section) => {
    const key = `${program}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        student_id: student.student_id || '',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        program: student.program || '',
        year_level: student.year_level || 1,
        section: student.section || '',
        gpa: student.gpa || '',
        academic_status: student.academic_status || 'active',
        enrollment_status: student.enrollment_status || 'enrolled'
      });
    } else {
      setEditingStudent(null);
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        program: '',
        year_level: 1,
        section: '',
        gpa: '',
        academic_status: 'active',
        enrollment_status: 'enrolled'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await apiService.updateStudent(editingStudent.student_id || editingStudent.id, formData);
      } else {
        await apiService.createStudent(formData);
      }
      handleCloseModal();
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err.response?.data || err.message);
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Validation errors:\n' + errorMessages);
      } else {
        alert('Failed to save student. Please check your data.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await apiService.deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student.');
    }
  };

  const getTotalStudents = () => {
    let total = 0;
    Object.values(groupedStudents).forEach(programs => {
      Object.values(programs).forEach(sections => {
        total += sections.length;
      });
    });
    return total;
  };

  const getStudentCountByProgram = (program) => {
    if (!groupedStudents[program]) return 0;
    let count = 0;
    Object.values(groupedStudents[program]).forEach(sections => {
      count += sections.length;
    });
    return count;
  };

  const getStudentCountBySection = (program, section) => {
    return groupedStudents[program]?.[section]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          title="Student Management" 
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Students by Program & Section</h1>
              <p className="text-gray-600">Organized hierarchical view with alphabetical sorting</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add Student</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{getTotalStudents()}</p>
                </div>
                <Users className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Programs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{Object.keys(groupedStudents).length}</p>
                </div>
                <FolderOpen className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {students.filter(s => s.academic_status === 'active').length}
                  </p>
                </div>
                <UserCheck className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Hierarchical View */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading students...</p>
              </div>
            ) : Object.keys(groupedStudents).length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No students found</p>
                <p className="text-gray-400 text-sm">Click "Add Student" to create your first student</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {Object.entries(groupedStudents).map(([program, sections]) => (
                  <div key={program}>
                    {/* Program Header */}
                    <button
                      onClick={() => toggleProgram(program)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all flex items-center justify-between border-b border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        {expandedPrograms[program] ? (
                          <ChevronDown className="w-5 h-5 text-orange-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-orange-600" />
                        )}
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900">{program}</h3>
                          <p className="text-sm text-gray-600">{getStudentCountByProgram(program)} students</p>
                        </div>
                      </div>
                      <FolderOpen className="w-6 h-6 text-orange-600 opacity-50" />
                    </button>

                    {/* Sections */}
                    {expandedPrograms[program] && (
                      <div className="bg-white">
                        {Object.entries(sections).map(([section, sectionStudents]) => {
                          const sectionKey = `${program}-${section}`;
                          return (
                            <div key={section}>
                              {/* Section Header */}
                              <button
                                onClick={() => toggleSection(program, section)}
                                className="w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-between border-b border-gray-200 pl-12"
                              >
                                <div className="flex items-center gap-3">
                                  {expandedSections[sectionKey] ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                  <div className="text-left">
                                    <h4 className="font-semibold text-gray-800">Section {section}</h4>
                                    <p className="text-xs text-gray-600">{sectionStudents.length} students</p>
                                  </div>
                                </div>
                              </button>

                              {/* Students Table */}
                              {expandedSections[sectionKey] && (
                                <div className="overflow-x-auto pl-12">
                                  <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {sectionStudents.map((student) => (
                                        <tr key={student.student_id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.student_id}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {student.first_name} {student.last_name}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">Year {student.year_level}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{student.gpa || 'N/A'}</td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                              student.academic_status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                              {student.academic_status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => handleOpenModal(student)}
                                                className="text-blue-600 hover:text-blue-900"
                                              >
                                                <Edit size={18} />
                                              </button>
                                              <button
                                                onClick={() => handleDelete(student.student_id || student.id)}
                                                className="text-red-600 hover:text-red-900"
                                              >
                                                <Trash2 size={18} />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.student_id}
                        onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={!!editingStudent}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                      <select
                        required
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Program</option>
                        {programs.map(prog => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Level *</label>
                      <select
                        required
                        value={formData.year_level}
                        onChange={(e) => setFormData({...formData, year_level: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                      <input
                        type="text"
                        required
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., A, B, C"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        value={formData.gpa}
                        onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Status *</label>
                      <select
                        required
                        value={formData.academic_status}
                        onChange={(e) => setFormData({...formData, academic_status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="active">Active</option>
                        <option value="probation">Probation</option>
                        <option value="graduated">Graduated</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all font-semibold shadow-lg"
                    >
                      {editingStudent ? 'Update Student' : 'Create Student'}
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

export default Students;
