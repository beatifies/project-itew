# CCS PROFILING SYSTEM - SETUP GUIDE

## Prerequisites
- XAMPP (with MySQL) installed
- PHP 8.2+ installed
- Composer installed
- Node.js 18+ installed
- Git (optional)

---

## INSTALLATION STEPS

### Step 1: Database Setup
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. The database 'ccs_profiling' should already be created from migrations

### Step 2: Backend Setup (Laravel)
```bash
# Navigate to project directory
cd C:\xampp\htdocs\ITEW_6

# Install PHP dependencies (already done)
composer install

# Verify .env file exists and has correct DB settings
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ccs_profiling
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations (if not already run)
php artisan migrate:fresh

# Seed sample data
php artisan db:seed --class=CcsDatabaseSeeder

# Start Laravel development server
php artisan serve --host=0.0.0.0 --port=8000
```

The backend API is now running at: **http://localhost:8000**

### Step 3: Frontend Setup (React)
```bash
# Open a NEW terminal window
cd C:\xampp\htdocs\ITEW_6\frontend

# Install Node.js dependencies (already done)
npm install

# Start React development server
npm run dev
```

The frontend is now running at: **http://localhost:5174** (or next available port)

---

## VERIFICATION

### Test Backend API:
1. Open browser or Postman
2. Visit: http://localhost:8000/api/students
3. You should see: `{"message":"Unauthenticated."}` (This is normal - auth is required)

### Test Frontend:
1. Open browser
2. Visit: http://localhost:5174
3. You should see the CCS Profiling System Dashboard
4. If you see a connection error, click "Retry"

---

## SAMPLE DATA INCLUDED

The seeder creates:
- ✅ 1 Admin user (admin@ccs.edu / password)
- ✅ 20 Students across different programs
- ✅ 10 Faculty members
- ✅ 5 Courses
- ✅ 2 Events (1 curricular, 1 extra-curricular)

---

## API TESTING WITH POSTMAN

### Login to get token:
```
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "admin@ccs.edu",
  "password": "password"
}
```

Response will include a `token` field. Use this token for subsequent requests.

### Get Students (with token):
```
GET http://localhost:8000/api/students
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Analytics:
```
GET http://localhost:8000/api/analytics
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## TROUBLESHOOTING

### Error: "SQLSTATE[HY000] [1049] Unknown database"
**Solution**: Create the database manually in phpMyAdmin:
```sql
CREATE DATABASE ccs_profiling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Connection Error" on frontend
**Solutions**:
1. Ensure Laravel server is running on port 8000
2. Check that `.env` file in frontend has: `VITE_API_URL=http://localhost:8000`
3. Clear browser cache and reload

### Error: "Port already in use"
**Solution**: Change the port:
- Laravel: `php artisan serve --port=8001`
- React: Already auto-selects next available port

### Error: "Class not found" or "Autoload files missing"
**Solution**: 
```bash
composer dump-autoload
```

### Error: Migration errors
**Solution**: Reset database and start fresh:
```bash
php artisan migrate:fresh --seed
```

---

## PROJECT STRUCTURE

```
ITEW_6/
├── app/
│   ├── Http/Controllers/Api/     # API Controllers
│   │   ├── StudentController.php
│   │   ├── FacultyController.php
│   │   ├── CourseController.php
│   │   ├── InstructionController.php
│   │   ├── ScheduleController.php
│   │   ├── EventController.php
│   │   └── AnalyticsController.php
│   └── Models/                    # Database Models
│       ├── Student.php
│       ├── Faculty.php
│       ├── Course.php
│       ├── Instruction.php
│       ├── Schedule.php
│       ├── Event.php
│       ├── EventParticipation.php
│       └── Analytics.php
├── database/
│   ├── migrations/                # Database Schema
│   └── seeders/                   # Sample Data
├── routes/
│   └── api.php                    # API Routes
├── frontend/                      # React Application
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
└── README.md

```

---

## NEXT DEVELOPMENT STEPS

The system is fully functional with:
✅ Complete backend API
✅ Working database with sample data
✅ Basic dashboard showing analytics

To expand the system, you can add:

1. **Student Management Module**
   - Student list with pagination
   - Add/Edit/Delete student forms
   - Student profile view

2. **Faculty Management Module**
   - Faculty directory
   - Teaching load visualization
   - Faculty profile management

3. **Course & Scheduling**
   - Course catalog management
   - Schedule builder with conflict detection
   - Room assignment interface

4. **Event Management**
   - Event calendar view
   - Participation tracking
   - Event outcome reporting

5. **Authentication UI**
   - Login page
   - User registration
   - Role-based access control

6. **Advanced Features**
   - Export to CSV/PDF
   - Advanced search filters
   - Real-time notifications
   - File upload for documents

---

## SUPPORT

For issues or questions:
1. Check the console logs in browser (F12)
2. Check Laravel logs: `storage/logs/laravel.log`
3. Verify all services are running (XAMPP MySQL, Laravel, React)

---

## SUCCESS! 🎉

Your CCS Profiling System is now running!
- Backend: http://localhost:8000
- Frontend: http://localhost:5174
- Database: ccs_profiling (MySQL)
