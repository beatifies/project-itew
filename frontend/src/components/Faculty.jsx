import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { GraduationCap, Plus, Edit, Trash2, Search, X } from 'lucide-react';

function Faculty() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    faculty_id: '',
    first_name: '',
    last_name: '',
    degrees: [],
    ccs_role: '',
    employment_status: 'full_time'
  });

  const roleOptions = [
    'Program Chair',
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Instructor I',
    'Instructor II',
    'Instructor III'
  ];

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFaculty();
      setFaculty(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setError('Failed to load faculty members. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingFaculty(member);
      setFormData({
        faculty_id: member.faculty_id || '',
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        degrees: member.degrees || [],
        ccs_role: member.ccs_role || '',
        employment_status: member.employment_status || 'full_time'
      });
    } else {
      setEditingFaculty(null);
      setFormData({
        faculty_id: '',
        first_name: '',
        last_name: '',
        degrees: [''],
        ccs_role: '',
        employment_status: 'full_time'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        degrees: formData.degrees.filter(d => d.trim() !== '')
      };
      
      if (editingFaculty) {
        await apiService.updateFaculty(editingFaculty.id, dataToSubmit);
      } else {
        await apiService.createFaculty(dataToSubmit);
      }
      handleCloseModal();
      fetchFaculty();
    } catch (err) {
      console.error('Error saving faculty:', err);
      alert('Failed to save faculty member. Please check your data.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    
    try {
      await apiService.deleteFaculty(id);
      fetchFaculty();
    } catch (err) {
      console.error('Error deleting faculty:', err);
      alert('Failed to delete faculty member.');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFaculty({ search: searchTerm });
      setFaculty(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDegree = () => {
    setFormData({
      ...formData,
      degrees: [...formData.degrees, '']
    });
  };

  const removeDegree = (index) => {
    setFormData({
      ...formData,
      degrees: formData.degrees.filter((_, i) => i !== index)
    });
  };

  const updateDegree = (index, value) => {
    const newDegrees = [...formData.degrees];
    newDegrees[index] = value;
    setFormData({ ...formData, degrees: newDegrees });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          title="Faculty Management" 
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Faculty Members</h1>
              <p className="text-gray-600">Manage faculty records and assignments</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add Faculty</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or faculty ID..."
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
                    fetchFaculty();
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

          {/* Faculty Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading faculty...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degrees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {faculty.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No faculty members found. Click "Add Faculty" to create one.
                        </td>
                      </tr>
                    ) : (
                      faculty.map((member) => (
                        <tr key={member.faculty_id || member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.faculty_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.first_name} {member.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.ccs_role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              member.employment_status === 'full_time' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {member.employment_status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {member.degrees && member.degrees.length > 0 
                              ? member.degrees.join(', ')
                              : 'No degrees listed'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleOpenModal(member)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Faculty ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.faculty_id}
                        onChange={(e) => setFormData({...formData, faculty_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={!!editingFaculty}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CCS Role *</label>
                      <select
                        required
                        value={formData.ccs_role}
                        onChange={(e) => setFormData({...formData, ccs_role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Role</option>
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
                      <select
                        required
                        value={formData.employment_status}
                        onChange={(e) => setFormData({...formData, employment_status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="adjunct">Adjunct</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degrees *</label>
                      {formData.degrees.map((degree, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={degree}
                            onChange={(e) => updateDegree(index, e.target.value)}
                            placeholder="Enter degree (e.g., PhD Computer Science)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {formData.degrees.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDegree(index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addDegree}
                        className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                      >
                        <Plus size={16} /> Add Another Degree
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                    >
                      {editingFaculty ? 'Update Faculty Member' : 'Create Faculty Member'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

export default Faculty;
