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
        $studentsByProgram = Student::selectRaw('program, count(*) as count')
            ->groupBy('program')
            ->get();
        $studentsByYearLevel = Student::selectRaw('year_level, count(*) as count')
            ->groupBy('year_level')
            ->orderBy('year_level')
            ->get();
        $studentsByStatus = Student::selectRaw('academic_status, count(*) as count')
            ->groupBy('academic_status')
            ->get();
        $averageGPA = Student::avg('gpa');

        // Faculty Statistics
        $totalFaculty = Faculty::count();
        $facultyByStatus = Faculty::selectRaw('employment_status, count(*) as count')
            ->groupBy('employment_status')
            ->get();
        $facultyByRole = Faculty::selectRaw('ccs_role, count(*) as count')
            ->groupBy('ccs_role')
            ->get();
        $averageTeachingLoad = Faculty::avg('teaching_load');

        // Event Statistics
        $totalEvents = Event::count();
        $eventsByType = Event::selectRaw('event_type, count(*) as count')
            ->groupBy('event_type')
            ->get();
        $upcomingEvents = Event::where('date', '>=', now())
            ->orderBy('date')
            ->limit(5)
            ->get();

        // Schedule Statistics
        $totalSchedules = Schedule::count();
        $schedulesBySemester = Schedule::selectRaw('semester, count(*) as count')
            ->groupBy('semester')
            ->get();

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
