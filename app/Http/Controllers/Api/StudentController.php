<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Student::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('program', 'like', "%{$search}%");
            });
        }

        // Filter by program
        if ($request->has('program')) {
            $query->where('program', $request->program);
        }

        // Filter by year level
        if ($request->has('year_level')) {
            $query->where('year_level', (int)$request->year_level);
        }

        // Filter by academic status
        if ($request->has('academic_status')) {
            $query->where('academic_status', $request->academic_status);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $students = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $students,
            'last_page' => $students->lastPage(),
            'current_page' => $students->currentPage(),
            'total' => $students->total()
        ]);
    }

    /**
     * Advanced filter endpoint
     */
    public function filter(Request $request): JsonResponse
    {
        $query = Student::query();

        // Filter by skills
        if ($request->has('skill')) {
            $query->whereJsonContains('special_skills', $request->skill);
        }

        // Filter by GPA range
        if ($request->has('gpa_min')) {
            $query->where('gpa', '>=', (float)$request->gpa_min);
        }
        if ($request->has('gpa_max')) {
            $query->where('gpa', '<=', (float)$request->gpa_max);
        }

        // Filter by academic status
        if ($request->has('academic_status')) {
            $query->where('academic_status', $request->academic_status);
        }

        // Filter by year level
        if ($request->has('year_level')) {
            $query->where('year_level', (int)$request->year_level);
        }

        // Filter by program
        if ($request->has('program')) {
            $query->where('program', $request->program);
        }

        // Filter by discipline status
        if ($request->has('discipline_status')) {
            $query->where('discipline_status', $request->discipline_status);
        }

        // Filter students with clean record (no violations)
        if ($request->has('clean_record') && $request->clean_record === 'true') {
            $query->where('discipline_status', 'clean');
        }

        $perPage = $request->input('per_page', 20);
        $students = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $students,
            'filters_applied' => $request->all()
        ]);
    }

    /**
     * Query students by skill
     */
    public function queryBySkill(string $skill): JsonResponse
    {
        $students = Student::hasSkill($skill)->get();

        return response()->json([
            'success' => true,
            'data' => $students,
            'skill' => $skill,
            'count' => $students->count()
        ]);
    }

    public function queryByAffiliation(string $type, string $name): JsonResponse
    {
        // For backward compatibility - now searches club_memberships
        $students = Student::whereJsonContains('club_memberships', $name)->get();

        return response()->json([
            'success' => true,
            'data' => $students,
            'affiliation' => [
                'type' => $type,
                'name' => $name
            ],
            'count' => $students->count()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|string|unique:students,student_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'program' => 'required|in:BS Information Technology,BS Computer Science',
            'year_level' => 'required|integer|between:1,5',
            'section' => 'required|string',
            'gpa' => 'nullable|numeric|between:0,5',
            'academic_status' => 'required|in:active,probation,graduated,dropped',
            'enrollment_status' => 'required|in:enrolled,irregular,graduated,dropped',
            'honors' => 'nullable|array',
            'scholarship' => 'nullable|array',
            'special_skills' => 'nullable|array',
            'certifications' => 'nullable|array',
            'club_memberships' => 'nullable|array',
            'officer_role' => 'nullable|string',
            'attendance_status' => 'nullable|in:excellent,good,fair,poor',
            'discipline_status' => 'nullable|in:clean,minor_violation,major_violation',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $student = Student::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => $student
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $student
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $student = Student::where('student_id', $id)->first();

        if (!$student) {
            $student = Student::find($id);
        }

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'program' => 'sometimes|required|in:BS Information Technology,BS Computer Science',
            'year_level' => 'sometimes|required|integer|between:1,5',
            'section' => 'sometimes|required|string',
            'gpa' => 'nullable|numeric|between:0,5',
            'academic_status' => 'sometimes|required|in:active,probation,graduated,dropped',
            'enrollment_status' => 'sometimes|required|in:enrolled,irregular,graduated,dropped',
            'honors' => 'sometimes|nullable|array',
            'scholarship' => 'sometimes|nullable|array',
            'special_skills' => 'sometimes|nullable|array',
            'certifications' => 'sometimes|nullable|array',
            'club_memberships' => 'sometimes|nullable|array',
            'officer_role' => 'sometimes|nullable|string',
            'attendance_status' => 'sometimes|nullable|in:excellent,good,fair,poor',
            'discipline_status' => 'sometimes|nullable|in:clean,minor_violation,major_violation',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $student->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $student = Student::where('student_id', $id)->first();

        if (!$student) {
            $student = Student::find($id);
        }

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully'
        ]);
    }
}
