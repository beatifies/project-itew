<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Event;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    /**
     * Display dashboard analytics.
     *
     * IMPORTANT: Every value placed in $data must be a plain PHP scalar or array.
     * Never store raw Eloquent model instances or MongoDB collections — the
     * MongoDB _id field is a BSON ObjectId that json_encode() cannot serialize,
     * which causes a 500 *outside* the try-catch block.
     */
    public function index(): JsonResponse
    {
        $data = [
            'summary'   => [
                'total_students'        => 0,
                'total_faculty'         => 0,
                'total_events'          => 0,
                'total_schedules'       => 0,
                'average_gpa'           => 0,
                'average_teaching_load' => 0,
            ],
            'students'  => ['by_program' => [], 'by_year_level' => [], 'by_status' => []],
            'faculty'   => ['by_status'  => [], 'by_role'       => []],
            'events'    => ['by_type'    => [], 'upcoming'      => []],
            'schedules' => ['by_semester' => []],
            'errors'    => [],
        ];

        // ── Students ──────────────────────────────────────────────────────────
        try {
            $allStudents = Student::all();
            $count = $allStudents->count();
            $data['summary']['total_students'] = $count;

            // avg('gpa') can return a string via the decimal:2 cast; cast to float safely
            $avgGpa = $count > 0 ? $allStudents->sum(fn($s) => (float) $s->gpa) / $count : 0;
            $data['summary']['average_gpa'] = round($avgGpa, 2);

            $data['students']['by_program'] = $allStudents
                ->groupBy('program')
                ->map(fn($group, $key) => [
                    'program' => (string) ($key ?: 'Unassigned'),
                    'count'   => $group->count(),
                ])
                ->values()
                ->toArray();

            $data['students']['by_year_level'] = $allStudents
                ->groupBy('year_level')
                ->map(fn($group, $key) => [
                    'year_level' => (string) ($key ?: 'N/A'),
                    'count'      => $group->count(),
                ])
                ->values()
                ->toArray();

            $data['students']['by_status'] = $allStudents
                ->groupBy('academic_status')
                ->map(fn($group, $key) => [
                    'status' => (string) ($key ?: 'Unknown'),
                    'count'  => $group->count(),
                ])
                ->values()
                ->toArray();

        } catch (\Throwable $e) {
            \Log::error('Analytics [students] error: ' . $e->getMessage());
            $data['errors'][] = 'students: ' . $e->getMessage();
        }

        // ── Faculty ───────────────────────────────────────────────────────────
        try {
            $allFaculty = Faculty::all();
            $fCount = $allFaculty->count();
            $data['summary']['total_faculty'] = $fCount;

            $avgLoad = $fCount > 0
                ? $allFaculty->sum(fn($f) => (float) ($f->teaching_load ?? 0)) / $fCount
                : 0;
            $data['summary']['average_teaching_load'] = round($avgLoad, 1);

            $data['faculty']['by_role'] = $allFaculty
                ->groupBy('ccs_role')
                ->map(fn($group, $key) => [
                    'ccs_role' => (string) ($key ?: 'Unassigned'),
                    'count'    => $group->count(),
                ])
                ->values()
                ->toArray();

            $data['faculty']['by_status'] = $allFaculty
                ->groupBy('status')
                ->map(fn($group, $key) => [
                    'status' => (string) ($key ?: 'Unknown'),
                    'count'  => $group->count(),
                ])
                ->values()
                ->toArray();

        } catch (\Throwable $e) {
            \Log::error('Analytics [faculty] error: ' . $e->getMessage());
            $data['errors'][] = 'faculty: ' . $e->getMessage();
        }

        // ── Events ────────────────────────────────────────────────────────────
        try {
            $allEvents = Event::all();
            $data['summary']['total_events'] = $allEvents->count();

            // Convert each event to a plain array — never pass models to the response.
            // The `date` cast is Carbon which json_encode handles, but _id is an ObjectId
            // which is NOT serializable. Using ->map()->toArray() forces serialization through
            // Eloquent's toArray() which converts ObjectId -> string automatically.
            $data['events']['upcoming'] = $allEvents
                ->take(5)
                ->map(fn($event) => [
                    'event_name'  => (string) ($event->event_name ?? ''),
                    'event_type'  => (string) ($event->event_type ?? ''),
                    'category'    => (string) ($event->category ?? ''),
                    'date'        => $event->date ? $event->date->toIso8601String() : null,
                    'time'        => (string) ($event->time ?? ''),
                    'venue'       => (string) ($event->venue ?? ''),
                    'description' => (string) ($event->description ?? ''),
                    'status'      => (string) ($event->status ?? ''),
                    'organizer'   => (string) ($event->organizer ?? ''),
                ])
                ->values()
                ->toArray();

            $data['events']['by_type'] = $allEvents
                ->groupBy('event_type')
                ->map(fn($group, $key) => [
                    'event_type' => (string) ($key ?: 'Unknown'),
                    'count'      => $group->count(),
                ])
                ->values()
                ->toArray();

        } catch (\Throwable $e) {
            \Log::error('Analytics [events] error: ' . $e->getMessage());
            $data['errors'][] = 'events: ' . $e->getMessage();
        }

        // ── Schedules ─────────────────────────────────────────────────────────
        try {
            $allSchedules = Schedule::all();
            $data['summary']['total_schedules'] = $allSchedules->count();

            $data['schedules']['by_semester'] = $allSchedules
                ->groupBy('semester')
                ->map(fn($group, $key) => [
                    'semester' => (string) ($key ?: 'N/A'),
                    'count'    => $group->count(),
                ])
                ->values()
                ->toArray();

        } catch (\Throwable $e) {
            \Log::error('Analytics [schedules] error: ' . $e->getMessage());
            $data['errors'][] = 'schedules: ' . $e->getMessage();
        }

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
