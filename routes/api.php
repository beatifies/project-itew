<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\InstructionController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Public Auth Routes
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware(['auth:sanctum']);

// User Info
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware(['auth:sanctum']);

// Analytics/Dashboard - PUBLIC for demo purposes
Route::get('/analytics', [AnalyticsController::class, 'index']);

// Protected API Routes (require authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    // Student Routes
    Route::apiResource('students', StudentController::class);
    
    // Faculty Routes
    Route::apiResource('faculty', FacultyController::class);
    
    // Course Routes
    Route::apiResource('courses', CourseController::class);
    
    // Instruction Routes
    Route::apiResource('instructions', InstructionController::class);
    
    // Schedule Routes
    Route::apiResource('schedules', ScheduleController::class);
    
    // Event Routes
    Route::apiResource('events', EventController::class);
});
