# Connection Setup Summary

## ✅ Fixed Issues

### 1. Frontend-Backend Connection
- **Created** `frontend/.env` file with `VITE_API_URL=http://localhost:8000`
- **Fixed** CORS configuration in `config/cors.php` to properly use `env()` function
- **Updated** session and cache drivers from `database` to `file` (MongoDB doesn't support these SQL-specific features)
- **Changed** queue driver from `database` to `sync`

### 2. MongoDB Connection
- **Fixed** migration file `2026_03_19_023049_add_role_to_users_table.php` - removed `after()` method (not supported in MongoDB)
- **Updated** all models to use MongoDB Eloquent:
  - `Student.php` - already using `MongoDB\Laravel\Eloquent\Model`
  - `User.php` - already using `MongoDB\Laravel\Auth\User`
  - `Faculty.php` - changed to `MongoDB\Laravel\Eloquent\Model`
  - `Course.php` - changed to `MongoDB\Laravel\Eloquent\Model`
  - `Instruction.php` - changed to `MongoDB\Laravel\Eloquent\Model`
  - `Schedule.php` - changed to `MongoDB\Laravel\Eloquent\Model`
  - `Event.php` - changed to `MongoDB\Laravel\Eloquent\Model`
  - `EventParticipation.php` - changed to `MongoDB\Laravel\Eloquent\Model`
  - `Analytics.php` - changed to `MongoDB\Laravel\Eloquent\Model`

- **Fixed** `AnalyticsController.php`:
  - Changed from SQL-style `selectRaw()` to Laravel Collection methods
  - Used Eloquent's `all()` with `groupBy()` for MongoDB compatibility
  - Properly handles nested document fields (e.g., `academic.program`)

### 3. Database Setup
- ✅ MongoDB is running on `localhost:27017`
- ✅ Database `student_profiling` created
- ✅ All migrations executed successfully
- ✅ Database seeded with:
  - 1 admin user (admin@ccs.edu / password)
  - 1 test user (test@example.com / password)
  - 1000+ student records

## 🚀 Running the Application

### Backend (Laravel)
```bash
cd c:\New-Itew\project-itew
php artisan serve
```
Server running on: `http://localhost:8000`

### Frontend (React + Vite)
```bash
cd c:\New-Itew\project-itew\frontend
npm run dev
```
Server running on: `http://localhost:5173` (or next available port)

## 🧪 Testing the Connection

### Test Analytics Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/analytics" -Method GET -UseBasicParsing
```

Expected response:
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_students": 1001,
      "total_faculty": 0,
      "total_events": 0,
      "total_schedules": 0,
      "average_gpa": 3.19,
      "average_teaching_load": 0
    },
    "students": {
      "by_program": [...],
      "by_year_level": [...],
      "by_status": [...]
    }
  }
}
```

## 📝 Important Notes

1. **MongoDB Data Structure**: The Student model uses embedded documents (`academic`, `personal_info`, etc.) which are stored as JSON strings but automatically serialized/deserialized by Eloquent's `array` cast.

2. **CORS Configuration**: The backend allows requests from:
   - `http://localhost:5173` (local development)
   - `https://project-itew.vercel.app` (production)

3. **Authentication**: The app uses Laravel Sanctum for API authentication. Demo credentials:
   - Email: `admin@ccs.edu`
   - Password: `password`

4. **API Routes**: All student/faculty/course routes require authentication except `/api/analytics` (public for demo).

## 🔧 Troubleshooting

### If MongoDB connection fails:
1. Check if MongoDB is running: `mongosh --eval "db.runCommand({ping:1})"`
2. Verify `.env` settings: `DB_CONNECTION=mongodb`, `DB_PORT=27017`

### If frontend can't connect to backend:
1. Ensure backend is running on port 8000
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Verify CORS settings in `config/cors.php`

### If API returns 500 error:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Ensure all models use MongoDB Eloquent classes
3. Clear config cache: `php artisan config:clear`
