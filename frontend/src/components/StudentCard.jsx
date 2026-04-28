import { Edit, Eye, Award, Users, Star } from 'lucide-react';

function StudentCard({ student, onView, onEdit }) {
  const getInitials = () => {
    const firstName = student.personal_info?.first_name || '';
    const lastName = student.personal_info?.last_name || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      probation: 'bg-yellow-100 text-yellow-800',
      graduated: 'bg-blue-100 text-blue-800',
      dropped: 'bg-red-100 text-red-800',
      clean: 'bg-green-100 text-green-800',
      minor_violation: 'bg-yellow-100 text-yellow-800',
      major_violation: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTopSkills = () => {
    const skills = student.skills || [];
    return skills.slice(0, 3);
  };

  const getTopAffiliations = () => {
    const affiliations = student.affiliations || [];
    return affiliations.slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-2xl">
            {getInitials()}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {student.personal_info?.first_name} {student.personal_info?.last_name}
            </h3>
            <p className="text-sm opacity-90">{student.student_id}</p>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Program:</span>
            <span className="text-sm font-semibold text-gray-900">{student.academic?.program}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Year:</span>
            <span className="text-sm font-semibold text-gray-900">Year {student.academic?.year_level} - Section {student.academic?.section}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">GPA:</span>
            <span className="text-lg font-bold text-orange-600">{student.academic?.gpa || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.academic?.academic_status)}`}>
              {student.academic?.academic_status}
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {getTopSkills().length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {getTopSkills().map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Affiliations */}
      {getTopAffiliations().length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Affiliations</span>
          </div>
          <div className="space-y-1">
            {getTopAffiliations().map((aff, idx) => (
              <div key={idx} className="text-xs text-gray-600">
                <span className="font-medium">{aff.name}</span>
                <span className="text-gray-400"> • {aff.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Honors */}
      {student.academic?.honors?.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Honors</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {student.academic.honors.map((honor, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200"
              >
                {honor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 bg-gray-50 flex gap-2">
        <button
          onClick={() => onView(student)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye size={16} />
          View
        </button>
        <button
          onClick={() => onEdit(student)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          <Edit size={16} />
          Edit
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
