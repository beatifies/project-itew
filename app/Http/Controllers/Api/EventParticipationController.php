<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EventParticipation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class EventParticipationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = EventParticipation::with(['event', 'student', 'faculty']);

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('attendance_status')) {
            $query->where('attendance_status', $request->attendance_status);
        }

        $perPage = $request->input('per_page', 15);
        $participations = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $participations
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'event_id' => 'required|exists:events,event_id',
            'student_id' => 'nullable|exists:students,student_id',
            'faculty_id' => 'nullable|exists:faculty,faculty_id',
            'role' => 'required|string|max:255',
            'attendance_status' => 'required|in:present,absent,excused',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $participation = EventParticipation::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Event participation created successfully',
            'data' => $participation
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $participation = EventParticipation::with(['event', 'student', 'faculty'])->find($id);

        if (!$participation) {
            return response()->json([
                'success' => false,
                'message' => 'Event participation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $participation
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $participation = EventParticipation::find($id);

        if (!$participation) {
            return response()->json([
                'success' => false,
                'message' => 'Event participation not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'role' => 'sometimes|required|string|max:255',
            'attendance_status' => 'sometimes|required|in:present,absent,excused',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $participation->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Event participation updated successfully',
            'data' => $participation
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $participation = EventParticipation::find($id);

        if (!$participation) {
            return response()->json([
                'success' => false,
                'message' => 'Event participation not found'
            ], 404);
        }

        $participation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event participation deleted successfully'
        ]);
    }
}
