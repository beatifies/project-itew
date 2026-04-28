import { useState } from 'react';
import { Filter, X } from 'lucide-react';

function QueryFilter({ onFilter, onClear }) {
  const [filters, setFilters] = useState({
    skill: '',
    affiliation_type: '',
    affiliation_name: '',
    gpa_min: '',
    gpa_max: '',
    academic_status: '',
    year_level: '',
    program: '',
    clean_record: false,
  });

  const skills = [
    'Python', 'JavaScript', 'Java', 'C++', 'Basketball', 'Swimming',
    'Graphic Design', 'Public Speaking', 'Photography', 'Volleyball',
    'Web Development', 'Data Analysis', 'Mobile Development'
  ];

  const affiliationTypes = ['organization', 'sports', 'club'];
  
  const affiliationNames = {
    organization: ['Student Council', 'IEEE', 'ACS', 'Honor Society'],
    sports: ['Basketball Team', 'Volleyball Team', 'Swimming Team', 'Track and Field'],
    club: ['Coding Club', 'Debate Club', 'Photography Club', 'Robotics Club', 'Chess Club', 'Music Club'],
  };

  const programs = [
    'BS Information Technology',
    'BS Computer Science',
    'BS Engineering',
    'BS Business Administration'
  ];

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Reset affiliation name when type changes
      ...(field === 'affiliation_type' && { affiliation_name: '' })
    }));
  };

  const applyFilters = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== false) {
        activeFilters[key] = filters[key];
      }
    });
    onFilter(activeFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      skill: '',
      affiliation_type: '',
      affiliation_name: '',
      gpa_min: '',
      gpa_max: '',
      academic_status: '',
      year_level: '',
      program: '',
      clean_record: false,
    });
    onClear();
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(v => v !== '' && v !== false).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-orange-600" />
          <h3 className="text-lg font-bold text-gray-800">Advanced Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Skill Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
          <select
            value={filters.skill}
            onChange={(e) => handleInputChange('skill', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Skills</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        {/* Affiliation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation Type</label>
          <select
            value={filters.affiliation_type}
            onChange={(e) => handleInputChange('affiliation_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Types</option>
            {affiliationTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Affiliation Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation Name</label>
          <select
            value={filters.affiliation_name}
            onChange={(e) => handleInputChange('affiliation_name', e.target.value)}
            disabled={!filters.affiliation_type}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
          >
            <option value="">All Affiliations</option>
            {filters.affiliation_type && affiliationNames[filters.affiliation_type]?.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* GPA Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min GPA</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={filters.gpa_min}
            onChange={(e) => handleInputChange('gpa_min', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="0.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max GPA</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={filters.gpa_max}
            onChange={(e) => handleInputChange('gpa_max', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="5.0"
          />
        </div>

        {/* Academic Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Status</label>
          <select
            value={filters.academic_status}
            onChange={(e) => handleInputChange('academic_status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="probation">Probation</option>
            <option value="graduated">Graduated</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        {/* Year Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
          <select
            value={filters.year_level}
            onChange={(e) => handleInputChange('year_level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {/* Program */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select
            value={filters.program}
            onChange={(e) => handleInputChange('program', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Programs</option>
            {programs.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clean Record Checkbox */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.clean_record}
            onChange={(e) => handleInputChange('clean_record', e.target.checked)}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Show only students with clean discipline record</span>
        </label>
      </div>

      {/* Apply Button */}
      <div className="flex gap-3">
        <button
          onClick={applyFilters}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all font-semibold shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default QueryFilter;
