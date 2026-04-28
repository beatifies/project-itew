# MongoDB Student Profiling System - Setup Guide

## Overview
This is a comprehensive student profiling system built with Laravel (MongoDB) and React. The system manages 1000+ student records with advanced filtering and query capabilities.

## Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MongoDB installed and running locally
- Git (optional)

---

## Installation Steps

### Step 1: Install MongoDB
If you don't have MongoDB installed:

**For Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service automatically

**Verify MongoDB is running:**
```bash
mongosh
```

### Step 2: Install Backend Dependencies

Open PowerShell/Command Prompt in the project directory:

```bash
cd c:\New-Itew\project-itew
```

Install PHP dependencies (including MongoDB package):

```bash
composer install
```

### Step 3: Configure Environment

1. Copy the environment file:
```bash
copy .env.example .env
```

2. Generate application key:
```bash
php artisan key:generate
```

3. The `.env` file is already configured for MongoDB:
```
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=student_profiling
DB_USERNAME=
DB_PASSWORD=
```

### Step 4: Seed the Database

Run migrations and seed 1000+ student records:

```bash
php artisan migrate
php artisan db:seed
```

This will:
- Create necessary MongoDB collections
- Seed 1000 realistic student records with:
  - Personal information
  - Academic history
  - Skills (Python, JavaScript, Basketball, etc.)
  - Affiliations (organizations, sports teams, clubs)
  - Activities and events
  - Violations (for some students)

### Step 5: Start the Backend Server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

### Step 6: Install Frontend Dependencies

Open a new terminal and navigate to the frontend directory:

```bash
cd c:\New-Itew\project-itew\frontend
npm install
```

### Step 7: Configure Frontend API URL

Edit `frontend/.env` (create if it doesn't exist):

```
VITE_API_URL=http://localhost:8000
```

### Step 8: Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## Features

### 1. Student Profile Management
- **Create, Read, Update, Delete** student records
- Comprehensive student data including:
  - Personal information (name, email, phone, address)
  - Academic records (GPA, program, year level, honors)
  - Skills with proficiency levels
  - Affiliations (organizations, sports, clubs)
  - Activities and event participation
  - Violations and discipline records

### 2. Multiple View Modes
- **Card View**: Beautiful card-based display with student summaries
- **Hierarchical View**: Grouped by program and section

### 3. Advanced Query & Filtering System
Click the **"Filters"** button to access:
- Filter by **Skill** (e.g., show all students with Basketball skill)
- Filter by **Affiliation** (e.g., show all Student Council members)
- Filter by **GPA Range** (min/max)
- Filter by **Academic Status** (active, probation, graduated, dropped)
- Filter by **Year Level**
- Filter by **Program**
- Filter by **Clean Discipline Record**

### 4. Student Detail View
Click **"View"** on any student card to see:
- Personal Information tab
- Academic History tab
- Skills & Certifications tab
- Affiliations & Activities tab
- Discipline & Violations tab

### 5. Pagination
- Automatically handles large datasets (1000+ records)
- 20 students per page in card view

---

## API Endpoints

### Student Management
- `GET /api/students` - List all students (paginated)
- `GET /api/students/{id}` - Get single student
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Query & Filtering
- `GET /api/students/filter?skill=Basketball` - Filter by multiple criteria
- `GET /api/students/query/skill/{skill}` - Query by skill
- `GET /api/students/query/affiliation/{type}/{name}` - Query by affiliation

### Filter Parameters
You can combine multiple filters:
```
/api/students/filter?skill=Python&gpa_min=3.5&academic_status=active
```

Available filters:
- `skill` - Skill name
- `affiliation_type` - organization, sports, or club
- `affiliation_name` - Specific affiliation name
- `gpa_min` - Minimum GPA
- `gpa_max` - Maximum GPA
- `academic_status` - active, probation, graduated, dropped
- `year_level` - 1, 2, 3, 4
- `program` - Program name
- `clean_record` - true (students with no violations)

---

## Example Queries

### 1. Find all students with Basketball skill
```
GET /api/students/query/skill/Basketball
```

### 2. Find all students with Programming skills
```
GET /api/students/query/skill/Python
GET /api/students/query/skill/JavaScript
```

### 3. Find all Student Council members
```
GET /api/students/query/affiliation/organization/Student%20Council
```

### 4. Find students with GPA > 4.0 and clean record
```
GET /api/students/filter?gpa_min=4.0&clean_record=true
```

### 5. Find all active CS students with Web Development skill
```
GET /api/students/filter?skill=Web%20Development&academic_status=active&program=BS%20Computer%20Science
```

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check MongoDB connection in `.env` file
- Test connection: `mongosh`

### Composer Install Fails
- Make sure PHP 8.2+ is installed
- Check if PHP MongoDB extension is enabled
- Run: `php -m | grep mongodb`

### Frontend Can't Connect to Backend
- Verify backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in frontend `.env`
- Clear browser cache and reload

### Database Seed Errors
- Clear existing data: `php artisan db:wipe`
- Re-run: `php artisan migrate && php artisan db:seed`

---

## Data Structure

Each student document in MongoDB has this structure:

```javascript
{
  student_id: "2024001",
  personal_info: {
    first_name: "Juan",
    last_name: "Santos",
    email: "juan.santos@university.edu",
    phone: "09123456789",
    date_of_birth: "2003-05-15",
    gender: "Male",
    address: {
      street: "123 Rizal St.",
      city: "Manila",
      province: "Metro Manila",
      zip_code: "1000"
    },
    emergency_contact: {
      name: "Maria Santos",
      relationship: "Parent",
      phone: "09987654321"
    }
  },
  academic: {
    program: "BS Information Technology",
    year_level: 3,
    section: "A",
    gpa: 4.25,
    academic_status: "active",
    enrollment_status: "enrolled",
    honors: ["Dean's Lister"],
    scholarships: ["Academic Scholarship"],
    academic_history: [...]
  },
  skills: [
    {
      name: "Python",
      proficiency_level: "Advanced",
      certifications: ["Certified Python Developer"]
    }
  ],
  affiliations: [
    {
      type: "organization",
      name: "Student Council",
      role: "Officer",
      year_joined: 2023,
      status: "Active"
    }
  ],
  activities: [
    {
      event_name: "Annual Hackathon",
      type: "Competition",
      date: "2024-03-15",
      role: "Participant",
      hours_participated: 8
    }
  ],
  violations: [],
  attendance_status: "excellent",
  discipline_status: "clean"
}
```

---

## Next Steps

1. **Customize Data**: Edit `StudentSeeder.php` to adjust data generation
2. **Add More Features**: Extend the system with attendance tracking, grade management, etc.
3. **Deploy**: Configure for production deployment
4. **Add Authentication**: The system already has Laravel Sanctum auth setup

---

## Support

For issues or questions:
- Check Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors
- Review API responses in Network tab

---

**Enjoy your Student Profiling System! 🎓**
