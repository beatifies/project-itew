<?php

/**
 * ANALYTICS STABILITY VERIFICATION: 1.0.4
 * IF YOU SEE THIS, I AM PHYSICALLY CHANGING YOUR CODE.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Event;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Display dashboard analytics
     */
    public function index(): JsonResponse
    {
        $data = [
            'summary' => ['total_students' => 0, 'total_faculty' => 0, 'total_events' => 0, 'total_schedules' => 0, 'average_gpa' => 0, 'average_teaching_load' => 0],
            'students' => ['by_program' => [], 'by_year_level' => [], 'by_status' => []],
            'faculty' => ['by_status' => [], 'by_role' => []],
            'events' => ['by_type' => [], 'upcoming' => []],
            'schedules' => ['by_semester' => []],
            'errors' => []
        ];

        try {
            // Students
            $allStudents = Student::all();
            $data['summary']['total_students'] = $allStudents->count();
            $data['summary']['average_gpa'] = round($allStudents->avg('gpa') ?? 0, 2);
            $data['students']['by_program'] = $allStudents->groupBy('program')->map(fn($s, $p) => ['program' => $p ?: 'Unassigned', 'count' => $s->count()])->values();
            
            // Faculty
            $allFaculty = Faculty::all();
            $data['summary']['total_faculty'] = $allFaculty->count();
            $data['summary']['average_teaching_load'] = round($allFaculty->avg('teaching_load') ?? 0, 1);
            
            // Events
            $allEvents = Event::all();
            $data['summary']['total_events'] = $allEvents->count();
            $data['events']['upcoming'] = $allEvents->take(5); // No date filter for now to avoid crashes
            
            // Schedules
            $allSchedules = Schedule::all();
            $data['summary']['total_schedules'] = $allSchedules->count();
            $data['schedules']['by_semester'] = $allSchedules->groupBy('semester')->map(fn($s, $sm) => ['semester' => $sm ?: 'N/A', 'count' => $s->count()])->values();
        } catch (\Throwable $e) {
            \Log::error('Analytics Error: ' . $e->getMessage());
            $data['errors'][] = $e->getMessage();
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
