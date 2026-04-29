<?php

/**
 * DEPLOYMENT STABILITY VERIFICATION: 1.0.3
 * BALANCED SECURITY - Simplified Role Management.
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

// --- PUBLIC ROUTES ---
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/health', fn() => response()->json(['status' => 'ok', 'version' => '1.0.3']));
Route::get('/db-test', function () {
    try {
        \DB::connection('mongodb')->getMongoDB()->command(['ping' => 1]);
        return response()->json(['status' => 'connected']);
    } catch (\Throwable $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Emergency Admin Creator
Route::get('/create-admin', function () {
    $admin = \App\Models\User::updateOrCreate(['email' => 'admin@ccs.edu'], [
        'name' => 'Admin User', 'password' => 'password!', 'role' => 'admin', 'user_id' => 'ADMIN001'
    ]);
    return response()->json(['status' => 'success', 'user' => $admin]);
});

// --- PROTECTED ROUTES (LOGGED IN ONLY) ---
Route::middleware(['auth:sanctum'])->group(function () {
    
    // 1. SHARED (Everyone)
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // 2. ADMIN & FACULTY (Management & Dashboard)
    Route::middleware(['role:admin,faculty'])->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'index']);
        
        // Full access for Faculty/Admin (except delete for faculty)
        Route::apiResource('students', StudentController::class)->except(['destroy']);
        Route::apiResource('faculty', FacultyController::class)->except(['destroy']);
        Route::apiResource('courses', CourseController::class)->except(['destroy']);
        Route::apiResource('instructions', InstructionController::class);
        Route::apiResource('schedules', ScheduleController::class);
        Route::apiResource('events', EventController::class)->except(['destroy']);
        Route::apiResource('event-participations', EventParticipationController::class);
        
        // Search & Filters
        Route::get('/students/filter', [StudentController::class, 'filter']);
        Route::get('/students/query/skill/{skill}', [StudentController::class, 'queryBySkill']);
    });

    // 3. ADMIN ONLY (Destructive Actions)
    Route::middleware(['role:admin'])->group(function () {
        Route::delete('/students/{id}', [StudentController::class, 'destroy']);
        Route::delete('/faculty/{id}', [FacultyController::class, 'destroy']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);
    });

    // 4. STUDENT ONLY (View Personal Data)
    Route::middleware(['role:student'])->group(function () {
        Route::get('/my-profile', fn(Request $request) => $request->user());
        Route::get('/view-courses', [CourseController::class, 'index']);
        Route::get('/view-events', [EventController::class, 'index']);
    });
});
