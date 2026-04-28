import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import StudentCard from './StudentCard';
import StudentDetail from './StudentDetail';
import QueryFilter from './QueryFilter';
import { Users, Plus, Edit, Trash2, Search, X, ChevronRight, ChevronDown, FolderOpen, UserCheck, Grid, List } from 'lucide-react';

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

  // New state for card view and filtering
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'hierarchy', 'table'
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    program: '',
    year_level: 1,
    section: '',
    gpa: '',
    academic_status: 'active',
    enrollment_status: 'enrolled',
    honors: [],
    scholarship: [],
    special_skills: [],
    certifications: [],
    club_memberships: [],
    officer_role: '',
    attendance_status: 'good',
    discipline_status: 'clean'
  });

  const programs = [
    'BS Information Technology',
    'BS Computer Science'
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = { page, per_page: 20, ...filters };
      const response = Object.keys(filters).length > 0
        ? await apiService.filterStudents(params)
        : await apiService.getStudents(params);
      
      const studentsData = response.data?.data || response.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      
      if (response.data?.last_page) {
        setTotalPages(response.data.last_page);
      }
      
      groupStudents(studentsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchStudents(1, filters);
  };

  const handleClearFilter = () => {
    setActiveFilters({});
    setCurrentPage(1);
    fetchStudents(1);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetail(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchStudents(newPage, activeFilters);
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
        enrollment_status: student.enrollment_status || 'enrolled',
        honors: student.honors || [],
        scholarship: student.scholarship || [],
        special_skills: student.special_skills || [],
        certifications: student.certifications || [],
        club_memberships: student.club_memberships || [],
        officer_role: student.officer_role || '',
        attendance_status: student.attendance_status || 'good',
        discipline_status: student.discipline_status || 'clean'
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
        enrollment_status: 'enrolled',
        honors: [],
        scholarship: [],
        special_skills: [],
        certifications: [],
        club_memberships: [],
        officer_role: '',
        attendance_status: 'good',
        discipline_status: 'clean'
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

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
    try {
      setLoading(true);
      const response = await apiService.getStudents({ 
        search: searchTerm,
        per_page: 50 
      });
      const studentsData = response.data?.data || response.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      groupStudents(studentsData);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search students.');
    } finally {
      setLoading(false);
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h1>
              <p className="text-gray-600">Comprehensive student profiling system</p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search students by name, ID, or program..."
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
              >
                <Search size={20} />
                <span>Filters</span>
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
              >
                <Plus size={20} />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid size={18} />
                Cards
              </button>
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'hierarchy' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
                Hierarchy
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {students.length} students
            </div>
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

          {/* Query Filter Panel */}
          {showFilter && (
            <QueryFilter onFilter={handleFilter} onClear={handleClearFilter} />
          )}

          {/* Card View */}
          {viewMode === 'cards' && (
            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No students found</p>
                  <p className="text-gray-400 text-sm">Click "Add Student" to create your first student</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {students.map((student) => (
                      <StudentCard
                        key={student.student_id}
                        student={student}
                        onView={handleViewStudent}
                        onEdit={handleOpenModal}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Hierarchical View */}
          {viewMode === 'hierarchy' && (
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
          )}

          {/* Student Detail Modal */}
          {showDetail && selectedStudent && (
            <StudentDetail
              student={selectedStudent}
              onClose={() => {
                setShowDetail(false);
                setSelectedStudent(null);
              }}
            />
          )}

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

                  {/* Array Fields - Tag Inputs */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                    
                    {/* Honors */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Honors</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.honors?.map((honor, index) => (
                          <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {honor}
                            <button 
                              type="button"
                              onClick={() => {
                                const updated = [...formData.honors];
                                updated.splice(index, 1);
                                setFormData({...formData, honors: updated});
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add honor and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newHonor = e.target.value.trim();
                            setFormData({
                              ...formData, 
                              honors: [...(formData.honors || []), newHonor]
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Scholarship */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.scholarship?.map((scholar, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {scholar}
                            <button 
                              type="button"
                              onClick={() => {
                                const updated = [...formData.scholarship];
                                updated.splice(index, 1);
                                setFormData({...formData, scholarship: updated});
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add scholarship and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newScholar = e.target.value.trim();
                            setFormData({
                              ...formData, 
                              scholarship: [...(formData.scholarship || []), newScholar]
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Special Skills */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Skills</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.special_skills?.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {skill}
                            <button 
                              type="button"
                              onClick={() => {
                                const updated = [...formData.special_skills];
                                updated.splice(index, 1);
                                setFormData({...formData, special_skills: updated});
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add skill and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newSkill = e.target.value.trim();
                            setFormData({
                              ...formData, 
                              special_skills: [...(formData.special_skills || []), newSkill]
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Certifications */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.certifications?.map((cert, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {cert}
                            <button 
                              type="button"
                              onClick={() => {
                                const updated = [...formData.certifications];
                                updated.splice(index, 1);
                                setFormData({...formData, certifications: updated});
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add certification and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newCert = e.target.value.trim();
                            setFormData({
                              ...formData, 
                              certifications: [...(formData.certifications || []), newCert]
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Club Memberships */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Club Memberships</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.club_memberships?.map((club, index) => (
                          <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {club}
                            <button 
                              type="button"
                              onClick={() => {
                                const updated = [...formData.club_memberships];
                                updated.splice(index, 1);
                                setFormData({...formData, club_memberships: updated});
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add club membership and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newClub = e.target.value.trim();
                            setFormData({
                              ...formData, 
                              club_memberships: [...(formData.club_memberships || []), newClub]
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Officer Role */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Officer Role</label>
                      <input
                        type="text"
                        value={formData.officer_role}
                        onChange={(e) => setFormData({...formData, officer_role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., President, Treasurer"
                      />
                    </div>

                    {/* Attendance & Discipline Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Status</label>
                        <select
                          value={formData.attendance_status}
                          onChange={(e) => setFormData({...formData, attendance_status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="good">Good</option>
                          <option value="warning">Warning</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discipline Status</label>
                        <select
                          value={formData.discipline_status}
                          onChange={(e) => setFormData({...formData, discipline_status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="clean">Clean</option>
                          <option value="warning">Warning</option>
                          <option value="violation">Violation</option>
                        </select>
                      </div>
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
