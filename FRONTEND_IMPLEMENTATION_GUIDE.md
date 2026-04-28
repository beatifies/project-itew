# FRONTEND IMPLEMENTATION GUIDE - CRITICAL FIXES NEEDED

## Overview
This document provides step-by-step instructions to fix all frontend issues. The backend is now complete and functional.

---

## 1. FIX STUDENT MANAGEMENT SEARCH BAR

### File: `frontend/src/components/Students.jsx`

**Find the search input handler and replace with:**

```javascript
const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
    try {
        const response = await studentService.getAll({ 
            search: searchTerm,
            per_page: 50 
        });
        setStudents(response.data.data || []);
    } catch (error) {
        console.error('Search error:', error);
    }
};
```

**In the JSX, ensure search input has:**
```jsx
<input
    type="text"
    value={searchTerm}
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="Search students..."
    className="..."
/>
```

---

## 2. FIX STUDENT CARDS - PROPER DATA MAPPING

### File: `frontend/src/components/Students.jsx`

**Replace student card rendering with:**

```jsx
{students.map((student) => (
    <StudentCard 
        key={student.student_id}
        student={student}
        onView={() => handleViewStudent(student)}
        onEdit={() => handleEditStudent(student)}
        onDelete={() => handleDeleteStudent(student.student_id)}
    />
))}
```

### File: `frontend/src/components/StudentCard.jsx`

**Update to receive full student object:**

```jsx
function StudentCard({ student, onView, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.student_id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    student.academic_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {student.academic_status}
                </span>
            </div>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Program:</span>
                    <span className="font-medium">{student.program}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Year Level:</span>
                    <span className="font-medium">{student.year_level}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Section:</span>
                    <span className="font-medium">{student.section}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">GPA:</span>
                    <span className="font-medium">{student.gpa || 'N/A'}</span>
                </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-4 flex gap-2">
                <button onClick={onView} className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View
                </button>
                <button onClick={onEdit} className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Edit
                </button>
                <button onClick={onDelete} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                </button>
            </div>
        </div>
    );
}
```

---

## 3. RESTRICT PROGRAMS TO BSIT AND BSCS ONLY

### File: `frontend/src/components/Students.jsx`

**Find program dropdown and replace:**

```jsx
<select 
    name="program" 
    value={formData.program} 
    onChange={handleChange}
    className="..."
>
    <option value="">Select Program</option>
    <option value="BS Information Technology">BS Information Technology</option>
    <option value="BS Computer Science">BS Computer Science</option>
</select>
```

### File: `frontend/src/components/Courses.jsx`

**Apply same program restriction.**

---

## 4. FIX EDIT FORMS - REMOVE JSON ARRAY DISPLAY

### File: `frontend/src/components/StudentDetail.jsx`

**CRITICAL FIX for array fields (honors, scholarship, special_skills, certifications, club_memberships):**

**Replace textarea with tag input:**

```jsx
// For special_skills field
<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Special Skills
    </label>
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
```

**Apply this same pattern to:**
- `honors` array
- `scholarship` array
- `certifications` array
- `club_memberships` array

---

## 5. FIX HEADER SEARCH BAR

### File: `frontend/src/components/layout/Header.jsx`

**Add functionality:**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Search } from 'lucide-react';

const Header = ({ toggleSidebar, title }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    // ... existing state

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const currentPath = window.location.pathname;
            navigate(`${currentPath}?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="...">
            <div className="...">
                {/* Left Side - Keep existing */}
                
                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Search Bar - UPDATED */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center">
                        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none ml-2 text-gray-700 w-64"
                            />
                        </div>
                    </form>
                    
                    {/* Keep existing notifications and user profile */}
                </div>
            </div>
        </header>
    );
};
```

---

## 6. FIX FACULTY EDIT FORM

### File: `frontend/src/components/Faculty.jsx`

**Apply tag input pattern to:**
- `degrees` array
- `certifications` array
- `expertise_area` array (note: singular now)
- `research_area` array (note: singular now)

---

## 7. FIX COURSE EDIT FORM

### File: `frontend/src/components/Courses.jsx`

**Apply tag input pattern to:**
- `learning_outcomes` array

**Add program restriction (BSIT and BSCS only)**

---

## 8. FIX INSTRUCTION EDIT FORM

### File: `frontend/src/components/Instructions.jsx`

**Apply tag input pattern to:**
- `syllabus` (if array)
- `lessons` (if array)
- `teaching_materials` (if array)
- `assessment_type` (if array)
- `grading_rubric` (if array)

---

## 9. UPDATE API RESPONSE HANDLING

### All Component Files

**Backend now returns flat student data. Update all references:**

**OLD:**
```javascript
student.personal_info.first_name
student.academic.program
```

**NEW:**
```javascript
student.first_name
student.program
```

---

## 10. ADD EVENT PARTICIPATION SERVICE

### File: `frontend/src/services/api.js`

**Add at the end:**

```javascript
export const eventParticipationService = {
    getAll: async (params = {}) => {
        const response = await api.get('/api/event-participations', { params });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/api/event-participations', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/api/event-participations/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/api/event-participations/${id}`);
        return response.data;
    },
};
```

---

## TESTING CHECKLIST

After implementing all fixes:

1. ✅ Login as admin@ccs.edu / password
2. ✅ Verify all menu items visible for admin
3. ✅ Test student search by name, ID, program
4. ✅ Create new student - verify program dropdown only shows BSIT and BSCS
5. ✅ Edit student - verify array fields show as tags, not JSON
6. ✅ Save student - verify data saves correctly
7. ✅ Login as faculty (create test user)
8. ✅ Verify faculty menu (no Faculty management, no delete buttons)
9. ✅ Login as student (create test user)
10. ✅ Verify student sees only Dashboard and Events
11. ✅ Test header search bar

---

## DEPLOYMENT STEPS

1. Run migrations: `php artisan migrate`
2. Fresh seed database: `php artisan migrate:fresh --seed`
3. Clear cache: `php artisan config:clear && php artisan cache:clear`
4. Build frontend: `cd frontend && npm run build`
5. Test all functionality

---

## NOTES

- All backend changes are COMPLETE and functional
- Frontend changes require manual implementation following this guide
- The tag input pattern is the most critical UI fix
- Role-based access is enforced on backend - frontend just needs to show appropriate UI
