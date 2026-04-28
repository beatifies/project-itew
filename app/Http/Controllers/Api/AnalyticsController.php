<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Event;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    /**
     * Display dashboard analytics
     */
    public function index(): JsonResponse
    {
        // Student Statistics
        $totalStudents = Student::count();
        $allStudents = Student::all();
        
        $studentsByProgram = $allStudents->groupBy('academic.program')->map(function($students, $program) {
            return ['program' => $program, 'count' => $students->count()];
        })->values();
        
        $studentsByYearLevel = $allStudents->groupBy('academic.year_level')->map(function($students, $yearLevel) {
            return ['year_level' => $yearLevel, 'count' => $students->count()];
        })->sortBy('year_level')->values();
        
        $studentsByStatus = $allStudents->groupBy('academic.academic_status')->map(function($students, $status) {
            return ['academic_status' => $status, 'count' => $students->count()];
        })->values();
        
        $averageGPA = $allStudents->avg('academic.gpa');

        // Faculty Statistics
        $totalFaculty = Faculty::count();
        $allFaculty = Faculty::all();
        
        $facultyByStatus = $allFaculty->groupBy('employment_status')->map(function($faculty, $status) {
            return ['employment_status' => $status, 'count' => $faculty->count()];
        })->values();
        
        $facultyByRole = $allFaculty->groupBy('ccs_role')->map(function($faculty, $role) {
            return ['ccs_role' => $role, 'count' => $faculty->count()];
        })->values();
        
        $averageTeachingLoad = $allFaculty->avg('teaching_load');

        // Event Statistics
        $totalEvents = Event::count();
        $allEvents = Event::all();
        
        $eventsByType = $allEvents->groupBy('event_type')->map(function($events, $type) {
            return ['event_type' => $type, 'count' => $events->count()];
        })->values();
        
        $upcomingEvents = Event::where('date', '>=', now())
            ->orderBy('date')
            ->limit(5)
            ->get();

        // Schedule Statistics
        $totalSchedules = Schedule::count();
        $allSchedules = Schedule::all();
        
        $schedulesBySemester = $allSchedules->groupBy('semester')->map(function($schedules, $semester) {
            return ['semester' => $semester, 'count' => $schedules->count()];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_students' => $totalStudents,
                    'total_faculty' => $totalFaculty,
                    'total_events' => $totalEvents,
                    'total_schedules' => $totalSchedules,
                    'average_gpa' => round($averageGPA, 2),
                    'average_teaching_load' => round($averageTeachingLoad, 1),
                ],
                'students' => [
                    'by_program' => $studentsByProgram,
                    'by_year_level' => $studentsByYearLevel,
                    'by_status' => $studentsByStatus,
                ],
                'faculty' => [
                    'by_status' => $facultyByStatus,
                    'by_role' => $facultyByRole,
                ],
                'events' => [
                    'by_type' => $eventsByType,
                    'upcoming' => $upcomingEvents,
                ],
                'schedules' => [
                    'by_semester' => $schedulesBySemester,
                ],
            ]
        ]);
    }
}
