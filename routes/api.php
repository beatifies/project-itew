<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\InstructionController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventParticipationController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Public Auth Routes
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Health Check Endpoint (Public)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'service' => 'CCS Profiling Backend'
    ]);
});

// Database Connection Diagnostic Endpoint (Public — remove after debugging)
Route::get('/db-test', function () {
    $result = [
        'timestamp' => now()->toIso8601String(),
        'php_mongodb_ext' => extension_loaded('mongodb') ? phpversion('mongodb') : 'NOT LOADED',
        'mongodb_uri_set' => !empty(env('MONGODB_URI')),
        'mongodb_uri_type' => str_contains(env('MONGODB_URI', ''), 'mongodb+srv') ? 'SRV (Atlas)' : 'standard',
        'db_connection' => config('database.default'),
        'db_database' => config('database.connections.mongodb.database'),
    ];

    try {
        $connection = \Illuminate\Support\Facades\DB::connection('mongodb');
        $mongo = $connection->getMongoClient();
        $db = $mongo->selectDatabase(config('database.connections.mongodb.database'));

        // Test actual connection by running a ping command
        $pingResult = $db->command(['ping' => 1])->toArray();
        $result['ping'] = 'ok';

        // Count users
        $userCount = \App\Models\User::count();
        $result['user_count'] = $userCount;

        // List user emails (for verification)
        $users = \App\Models\User::all(['email', 'role', 'name'])->toArray();
        $result['users'] = array_map(fn($u) => [
            'email' => $u['email'] ?? 'N/A',
            'role' => $u['role'] ?? 'N/A',
            'name' => $u['name'] ?? 'N/A',
        ], $users);

        $result['status'] = 'connected';
    } catch (\Throwable $e) {
        $result['status'] = 'FAILED';
        $result['error'] = get_class($e) . ': ' . $e->getMessage();
        $result['error_file'] = $e->getFile() . ':' . $e->getLine();
    }

    return response()->json($result);
});

// User Info
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Admin Only - Full CRUD on everything
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('students', StudentController::class);
    Route::get('/students/filter', [StudentController::class, 'filter']);
    Route::get('/students/query/skill/{skill}', [StudentController::class, 'queryBySkill']);
    Route::get('/students/query/affiliation/{type}/{name}', [StudentController::class, 'queryByAffiliation']);
    
    Route::apiResource('faculty', FacultyController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('instructions', InstructionController::class);
    Route::apiResource('schedules', ScheduleController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('event-participations', EventParticipationController::class);
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});

// Faculty - Full access except delete on main entities
Route::middleware(['auth:sanctum', 'role:faculty'])->group(function () {
    Route::apiResource('students', StudentController::class)->except(['destroy']);
    Route::get('/students/filter', [StudentController::class, 'filter']);
    Route::get('/students/query/skill/{skill}', [StudentController::class, 'queryBySkill']);
    Route::get('/students/query/affiliation/{type}/{name}', [StudentController::class, 'queryByAffiliation']);
    
    Route::apiResource('faculty', FacultyController::class)->except(['destroy']);
    Route::apiResource('courses', CourseController::class)->except(['destroy']);
    Route::apiResource('instructions', InstructionController::class);
    Route::apiResource('schedules', ScheduleController::class);
    Route::apiResource('events', EventController::class)->except(['destroy']);
    Route::apiResource('event-participations', EventParticipationController::class);
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});

// Student - Own profile and view-only access
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::get('/event-participations', [EventParticipationController::class, 'index']);
});
