<?php

/**
 * DEPLOYMENT STABILITY VERIFICATION: 1.0.1
 * IF YOU SEE THIS, THE CODE IS UPDATING CORRECTLY locally.
 */

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
        'version' => '1.0.1'
    ]);
});

// Database Connection Diagnostic Endpoint (Public)
Route::get('/db-test', function () {
    try {
        $db = \DB::connection('mongodb')->getMongoDB();
        $db->command(['ping' => 1]);
        return response()->json([
            'status' => 'connected',
            'database' => \DB::connection('mongodb')->getDatabaseName(),
            'ping' => 'ok'
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
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

// Faculty and Admin - Shared access to analytics and management
Route::middleware(['auth:sanctum', 'role:admin,faculty'])->group(function () {
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
