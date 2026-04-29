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
        $data = [
            'summary' => [
                'total_students' => 0,
                'total_faculty' => 0,
                'total_events' => 0,
                'total_schedules' => 0,
                'average_gpa' => 0,
                'average_teaching_load' => 0,
            ],
            'students' => ['by_program' => [], 'by_year_level' => [], 'by_status' => []],
            'faculty' => ['by_status' => [], 'by_role' => []],
            'events' => ['by_type' => [], 'upcoming' => []],
            'schedules' => ['by_semester' => []],
            'errors' => []
        ];

        // 1. Students
        try {
            $allStudents = Student::all();
            $data['summary']['total_students'] = $allStudents->count();
            $data['summary']['average_gpa'] = round($allStudents->avg('gpa') ?? 0, 2);
            
            $data['students']['by_program'] = $allStudents->groupBy('program')->map(fn($s, $p) => 
                ['program' => $p ?: 'Unassigned', 'count' => $s->count()])->values();
            
            $data['students']['by_year_level'] = $allStudents->groupBy('year_level')->map(fn($s, $y) => 
                ['year_level' => $y ?: 'N/A', 'count' => $s->count()])->sortBy('year_level')->values();
                
            $data['students']['by_status'] = $allStudents->groupBy('academic_status')->map(fn($s, $st) => 
                ['academic_status' => $st ?: 'Unknown', 'count' => $s->count()])->values();
        } catch (\Throwable $e) {
            $data['errors'][] = 'Students Error: ' . $e->getMessage();
        }

        // 2. Faculty
        try {
            $allFaculty = Faculty::all();
            $data['summary']['total_faculty'] = $allFaculty->count();
            $data['summary']['average_teaching_load'] = round($allFaculty->avg('teaching_load') ?? 0, 1);
            
            $data['faculty']['by_status'] = $allFaculty->groupBy('employment_status')->map(fn($f, $s) => 
                ['employment_status' => $s ?: 'Unknown', 'count' => $f->count()])->values();
                
            $data['faculty']['by_role'] = $allFaculty->groupBy('ccs_role')->map(fn($f, $r) => 
                ['ccs_role' => $r ?: 'Staff', 'count' => $f->count()])->values();
        } catch (\Throwable $e) {
            $data['errors'][] = 'Faculty Error: ' . $e->getMessage();
        }

        // 3. Events
        try {
            $allEvents = Event::all();
            $data['summary']['total_events'] = $allEvents->count();
            $data['events']['by_type'] = $allEvents->groupBy('event_type')->map(fn($e, $t) => 
                ['event_type' => $t ?: 'General', 'count' => $e->count()])->values();
                
            $data['events']['upcoming'] = Event::where('date', '>=', now()->startOfDay())
                ->orderBy('date')->limit(5)->get();
        } catch (\Throwable $e) {
            $data['errors'][] = 'Events Error: ' . $e->getMessage();
        }

        // 4. Schedules
        try {
            $allSchedules = Schedule::all();
            $data['summary']['total_schedules'] = $allSchedules->count();
            $data['schedules']['by_semester'] = $allSchedules->groupBy('semester')->map(fn($s, $sm) => 
                ['semester' => $sm ?: 'N/A', 'count' => $s->count()])->values();
        } catch (\Throwable $e) {
            $data['errors'][] = 'Schedules Error: ' . $e->getMessage();
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
