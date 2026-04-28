import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { FileText, Plus, Edit, Trash2, Search, X, BookOpen, Tag } from 'lucide-react';

function Instructions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    course_id: '',
    syllabus: '',
    lessons: '',
    teaching_materials: '',
    assessment_types: '',
    grading_rubric: ''
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchInstructions();
    fetchCourses();
  }, []);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInstructions();
      // Handle different response structures
      const instructionData = response.data?.data || response.data || [];
      setInstructions(Array.isArray(instructionData) ? instructionData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching instructions:', err);
      setError('Failed to load instructions. Make sure the backend is running.');
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

  const handleOpenModal = (instruction = null) => {
    if (instruction) {
      setEditingInstruction(instruction);
      setFormData({
        course_id: instruction.course_id || '',
        syllabus: typeof instruction.syllabus === 'object' ? JSON.stringify(instruction.syllabus, null, 2) : instruction.syllabus,
        lessons: typeof instruction.lessons === 'object' ? JSON.stringify(instruction.lessons, null, 2) : instruction.lessons,
        teaching_materials: typeof instruction.teaching_materials === 'object' ? JSON.stringify(instruction.teaching_materials, null, 2) : instruction.teaching_materials,
        assessment_types: typeof instruction.assessment_types === 'object' ? JSON.stringify(instruction.assessment_types, null, 2) : instruction.assessment_types,
        grading_rubric: typeof instruction.grading_rubric === 'object' ? JSON.stringify(instruction.grading_rubric, null, 2) : instruction.grading_rubric
      });
    } else {
      setEditingInstruction(null);
      setFormData({
        course_id: '',
        syllabus: '',
        lessons: '',
        teaching_materials: '',
        assessment_types: '',
        grading_rubric: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstruction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert JSON strings to arrays/objects
      const dataToSubmit = {
        course_id: formData.course_id,
        syllabus: JSON.parse(formData.syllabus),
        lessons: JSON.parse(formData.lessons),
        teaching_materials: formData.teaching_materials ? JSON.parse(formData.teaching_materials) : null,
        assessment_types: JSON.parse(formData.assessment_types),
        grading_rubric: JSON.parse(formData.grading_rubric)
      };

      if (editingInstruction) {
        await apiService.updateInstruction(editingInstruction.instruction_id, dataToSubmit);
      } else {
        await apiService.createInstruction(dataToSubmit);
      }
      handleCloseModal();
      fetchInstructions();
    } catch (err) {
      console.error('Error saving instruction:', err.response?.data || err.message);
      if (err.message.includes('JSON')) {
        alert('Invalid JSON format. Please ensure all fields are properly formatted JSON (arrays or objects). Example: ["item1", "item2"]');
      } else {
        const errors = err.response?.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join('\n');
          alert('Validation errors:\n' + errorMessages);
        } else {
          alert('Failed to save instruction. Please check your data.');
        }
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this instruction?')) return;
    
    try {
      await apiService.deleteInstruction(id);
      fetchInstructions();
    } catch (err) {
      console.error('Error deleting instruction:', err);
      alert('Failed to delete instruction.');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInstructions({ search: searchTerm });
      setInstructions(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching instructions:', err);
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
          title="Instruction Management" 
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Instructions</h1>
              <p className="text-gray-600">Manage instructional materials and guidelines</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add Instruction</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search instructions by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchInstructions();
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

          {/* Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading instructions...</p>
              </div>
            ) : instructions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No instructions found</p>
                <p className="text-gray-400 text-sm">Click "Add Instruction" to create your first instruction</p>
              </div>
            ) : (
              instructions.map((instruction) => {
                // Find the course for this instruction
                const course = courses.find(c => c.course_id === instruction.course_id);

                return (
                  <div 
                    key={instruction._id || instruction.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                  >
                    {/* Course Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                      <span className="text-white text-xs font-semibold">
                        {course ? `${course.course_code}` : instruction.course_id}
                      </span>
                      <h3 className="text-white font-bold text-sm mt-1">
                        {course ? course.course_title : 'Unknown Course'}
                      </h3>
                    </div>

                    {/* Instruction Content */}
                    <div className="p-4">
                      {/* Syllabus Preview */}
                      {instruction.syllabus && instruction.syllabus.course_description && (
                        <div className="mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <BookOpen size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">Course Description</p>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {instruction.syllabus.course_description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lessons Count */}
                      {instruction.lessons && Array.isArray(instruction.lessons) && (
                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                          <FileText size={16} className="text-green-600" />
                          <span className="font-medium">{instruction.lessons.length} Lessons</span>
                        </div>
                      )}

                      {/* Assessment Types */}
                      {instruction.assessment_types && Array.isArray(instruction.assessment_types) && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Assessment Types:</p>
                          <div className="flex flex-wrap gap-1">
                            {instruction.assessment_types.slice(0, 3).map((type, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                {type}
                              </span>
                            ))}
                            {instruction.assessment_types.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{instruction.assessment_types.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {instruction.syllabus && instruction.syllabus.prerequisites && (
                        <div className="mb-4 flex items-center gap-2 text-xs text-gray-600">
                          <Tag size={14} className="text-orange-600" />
                          <span>Prerequisites: {instruction.syllabus.prerequisites}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleOpenModal(instruction)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(instruction._id || instruction.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingInstruction ? 'Edit Instruction' : 'Add New Instruction'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                      <select
                        required
                        value={formData.course_id}
                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_name} ({course.course_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus (JSON Array) *</label>
                      <textarea
                        required
                        value={formData.syllabus}
                        onChange={(e) => setFormData({...formData, syllabus: e.target.value})}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder='Example: ["Week 1: Introduction", "Week 2: Basics"]'
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lessons (JSON Array) *</label>
                      <textarea
                        required
                        value={formData.lessons}
                        onChange={(e) => setFormData({...formData, lessons: e.target.value})}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder='Example: [{"title": "Lesson 1", "content": "..."}]'
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Materials (JSON Array)</label>
                      <textarea
                        value={formData.teaching_materials}
                        onChange={(e) => setFormData({...formData, teaching_materials: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder='Example: ["Textbook", "Slides", "Videos"]'
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Types (JSON Array) *</label>
                      <textarea
                        required
                        value={formData.assessment_types}
                        onChange={(e) => setFormData({...formData, assessment_types: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder='Example: ["Quiz", "Exam", "Project"]'
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grading Rubric (JSON Array) *</label>
                      <textarea
                        required
                        value={formData.grading_rubric}
                        onChange={(e) => setFormData({...formData, grading_rubric: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder='Example: [{"grade": "A", "min_score": 90}]'
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
                    >
                      {editingInstruction ? 'Update Instruction' : 'Create Instruction'}
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

export default Instructions;
