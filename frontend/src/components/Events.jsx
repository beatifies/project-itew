import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { Calendar, Plus, Edit, Trash2, Search, X, Clock, MapPin, Users } from 'lucide-react';

function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    event_name: '',
    date: '',
    venue: '',
    event_type: 'curricular',
    category: '',
    organizer: ''
  });

  const eventTypes = [
    { value: 'curricular', label: 'Curricular', color: 'blue' },
    { value: 'extra_curricular', label: 'Extra-Curricular', color: 'pink' }
  ];

  const categories = [
    'Seminar',
    'Workshop',
    'Competition',
    'Conference',
    'Training',
    'Meeting',
    'Other'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents();
      // Handle different response structures
      const eventData = response.data?.data || response.data || [];
      setEvents(Array.isArray(eventData) ? eventData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        event_name: event.event_name || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        venue: event.venue || '',
        event_type: event.event_type || 'curricular',
        category: event.category || '',
        organizer: event.organizer || ''
      });
    } else {
      setEditingEvent(null);
      setFormData({
        event_name: '',
        date: '',
        venue: '',
        event_type: 'curricular',
        category: '',
        organizer: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null
      };
      
      if (editingEvent) {
        await apiService.updateEvent(editingEvent.event_id, dataToSubmit);
      } else {
        await apiService.createEvent(dataToSubmit);
      }
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      console.error('Error saving event:', err.response?.data || err.message);
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Validation errors:\n' + errorMessages);
      } else {
        alert('Failed to save event. Please check your data.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await apiService.deleteEvent(id);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event.');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents({ search: searchTerm });
      setEvents(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching events:', err);
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
          title="Event Management" 
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Events</h1>
              <p className="text-gray-600">Manage CCS events and activities</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add Event</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchEvents();
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

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No events found</p>
                <p className="text-gray-400 text-sm">Click "Add Event" to create your first event</p>
              </div>
            ) : (
              events.map((event) => {
                const eventTypeColors = {
                  curricular: 'bg-blue-500',
                  extra_curricular: 'bg-pink-500',
                  research: 'bg-purple-500',
                  extension: 'bg-green-500'
                };

                return (
                  <div 
                    key={event.event_id || event.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                  >
                    {/* Event Type Badge */}
                    <div className={`${eventTypeColors[event.event_type] || 'bg-gray-500'} px-4 py-2`}>
                      <span className="text-white text-xs font-semibold uppercase tracking-wide">
                        {event.event_type}
                      </span>
                    </div>

                    {/* Event Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {event.event_name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-pink-600" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-pink-600" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>

                        {event.organizer && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-pink-600" />
                            <span className="line-clamp-1">{event.organizer}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleOpenModal(event)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
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
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.event_name}
                        onChange={(e) => setFormData({...formData, event_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="e.g., CCS Tech Summit 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="e.g., CCS Student Council"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                      <input
                        type="text"
                        required
                        value={formData.venue}
                        onChange={(e) => setFormData({...formData, venue: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="e.g., CCS Auditorium, Room 301"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                      <select
                        required
                        value={formData.event_type}
                        onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all font-semibold shadow-lg"
                    >
                      {editingEvent ? 'Update Event' : 'Create Event'}
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

export default Events;
