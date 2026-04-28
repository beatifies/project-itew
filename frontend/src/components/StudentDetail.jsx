import { useState } from 'react';
import { X, User, BookOpen, Star, Users, AlertTriangle, Calendar } from 'lucide-react';

function StudentDetail({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'affiliations', label: 'Affiliations', icon: Users },
    { id: 'violations', label: 'Discipline', icon: AlertTriangle },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      probation: 'bg-yellow-100 text-yellow-800',
      graduated: 'bg-blue-100 text-blue-800',
      dropped: 'bg-red-100 text-red-800',
      clean: 'bg-green-100 text-green-800',
      minor_violation: 'bg-yellow-100 text-yellow-800',
      major_violation: 'bg-red-100 text-red-800',
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderPersonalInfo = () => {
    const info = student.personal_info || {};
    const address = info.address || {};
    const emergency = info.emergency_contact || {};

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">First Name</label>
            <p className="text-gray-900 font-semibold">{info.first_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Name</label>
            <p className="text-gray-900 font-semibold">{info.last_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{info.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="text-gray-900">{info.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Date of Birth</label>
            <p className="text-gray-900">{info.date_of_birth}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <p className="text-gray-900">{info.gender}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Address</label>
          <p className="text-gray-900">
            {address.street}, {address.city}, {address.province} {address.zip_code}
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Emergency Contact</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="text-gray-900">{emergency.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Relationship</label>
              <p className="text-gray-900">{emergency.relationship}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <p className="text-gray-900">{emergency.phone}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAcademic = () => {
    const academic = student.academic || {};
    const history = academic.academic_history || [];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Program</label>
            <p className="text-gray-900 font-semibold">{academic.program}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Year Level</label>
            <p className="text-gray-900">Year {academic.year_level} - Section {academic.section}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">GPA</label>
            <p className="text-2xl font-bold text-orange-600">{academic.gpa || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Academic Status</label>
            <p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(academic.academic_status)}`}>
                {academic.academic_status}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Enrollment Status</label>
            <p className="text-gray-900">{academic.enrollment_status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Attendance</label>
            <p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.attendance_status)}`}>
                {student.attendance_status}
              </span>
            </p>
          </div>
        </div>

        {academic.honors?.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-600">Honors</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {academic.honors.map((honor, idx) => (
                <span key={idx} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full border border-yellow-200">
                  {honor}
                </span>
              ))}
            </div>
          </div>
        )}

        {academic.scholarships?.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-600">Scholarships</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {academic.scholarships.map((scholarship, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                  {scholarship}
                </span>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Academic History</h4>
            <div className="space-y-2">
              {history.map((record, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{record.semester} {record.year}</span>
                    <span className="text-sm text-gray-600">{record.courses_taken} courses</span>
                  </div>
                  <p className="text-sm text-gray-600">GPA: {record.gpa}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSkills = () => {
    const skills = student.skills || [];

    if (skills.length === 0) {
      return <p className="text-gray-500 text-center py-8">No skills recorded</p>;
    }

    return (
      <div className="space-y-3">
        {skills.map((skill, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">{skill.name}</h4>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                skill.proficiency_level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                skill.proficiency_level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                skill.proficiency_level === 'Intermediate' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {skill.proficiency_level}
              </span>
            </div>
            {skill.certifications?.length > 0 && (
              <div className="mt-2">
                <label className="text-xs text-gray-600">Certifications:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.certifications.map((cert, cIdx) => (
                    <span key={cIdx} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded border border-orange-200">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAffiliations = () => {
    const affiliations = student.affiliations || [];
    const activities = student.activities || [];

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Organizations & Clubs</h4>
          {affiliations.length === 0 ? (
            <p className="text-gray-500">No affiliations recorded</p>
          ) : (
            <div className="space-y-2">
              {affiliations.map((aff, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{aff.name}</p>
                      <p className="text-sm text-gray-600">{aff.type} • Joined {aff.year_joined}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {aff.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Activities</h4>
          {activities.length === 0 ? (
            <p className="text-gray-500">No activities recorded</p>
          ) : (
            <div className="space-y-2">
              {activities.map((activity, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{activity.event_name}</p>
                      <p className="text-sm text-gray-600">{activity.type} • {activity.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        {activity.role}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">{activity.hours_participated} hrs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderViolations = () => {
    const violations = student.violations || [];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Discipline Status</label>
            <p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.discipline_status)}`}>
                {student.discipline_status}
              </span>
            </p>
          </div>
        </div>

        {violations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar size={32} className="text-green-600" />
            </div>
            <p className="text-green-600 font-semibold">Clean Record</p>
            <p className="text-sm text-gray-600">No violations recorded</p>
          </div>
        ) : (
          <div className="space-y-3">
            {violations.map((violation, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                violation.type === 'Major' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{violation.description}</p>
                    <p className="text-sm text-gray-600">{violation.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      violation.type === 'Major' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {violation.type}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">{violation.sanction}</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded mt-1 inline-block ${
                      violation.status === 'Resolved' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'
                    }`}>
                      {violation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {student.personal_info?.first_name} {student.personal_info?.last_name}
              </h2>
              <p className="text-sm text-gray-600">{student.student_id} • {student.academic?.program}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'academic' && renderAcademic()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'affiliations' && renderAffiliations()}
          {activeTab === 'violations' && renderViolations()}
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
