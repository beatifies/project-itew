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
                $q->where('personal_info.first_name', 'like', "%{$search}%")
                  ->orWhere('personal_info.last_name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('academic.program', 'like', "%{$search}%");
            });
        }

        // Filter by program
        if ($request->has('program')) {
            $query->where('academic.program', $request->program);
        }

        // Filter by year level
        if ($request->has('year_level')) {
            $query->where('academic.year_level', (int)$request->year_level);
        }

        // Filter by academic status
        if ($request->has('academic_status')) {
            $query->where('academic.academic_status', $request->academic_status);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $students = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $students
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
            $query->where('skills', 'elemMatch', ['name' => $request->skill]);
        }

        // Filter by affiliation type and name
        if ($request->has('affiliation_type') && $request->has('affiliation_name')) {
            $query->where('affiliations', 'elemMatch', [
                'type' => $request->affiliation_type,
                'name' => $request->affiliation_name
            ]);
        }

        // Filter by GPA range
        if ($request->has('gpa_min')) {
            $query->where('academic.gpa', '>=', (float)$request->gpa_min);
        }
        if ($request->has('gpa_max')) {
            $query->where('academic.gpa', '<=', (float)$request->gpa_max);
        }

        // Filter by academic status
        if ($request->has('academic_status')) {
            $query->where('academic.academic_status', $request->academic_status);
        }

        // Filter by year level
        if ($request->has('year_level')) {
            $query->where('academic.year_level', (int)$request->year_level);
        }

        // Filter by program
        if ($request->has('program')) {
            $query->where('academic.program', $request->program);
        }

        // Filter by discipline status
        if ($request->has('discipline_status')) {
            $query->where('discipline_status', $request->discipline_status);
        }

        // Filter students with clean record (no violations)
        if ($request->has('clean_record') && $request->clean_record === 'true') {
            $query->where(function($q) {
                $q->whereNull('violations')
                  ->orWhere('violations', []);
            });
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
        $students = Student::withSkill($skill)->get();

        return response()->json([
            'success' => true,
            'data' => $students,
            'skill' => $skill,
            'count' => $students->count()
        ]);
    }

    /**
     * Query students by affiliation
     */
    public function queryByAffiliation(string $type, string $name): JsonResponse
    {
        $students = Student::withAffiliation($type, $name)->get();

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
            'personal_info.first_name' => 'required|string|max:255',
            'personal_info.last_name' => 'required|string|max:255',
            'academic.program' => 'required|string',
            'academic.year_level' => 'required|integer|between:1,5',
            'academic.section' => 'required|string',
            'academic.gpa' => 'nullable|numeric|between:0,5',
            'academic.academic_status' => 'required|in:active,probation,graduated,dropped',
            'academic.enrollment_status' => 'required|in:enrolled,irregular,graduated,dropped',
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
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'personal_info.first_name' => 'sometimes|required|string|max:255',
            'personal_info.last_name' => 'sometimes|required|string|max:255',
            'academic.program' => 'sometimes|required|string',
            'academic.year_level' => 'sometimes|required|integer|between:1,5',
            'academic.section' => 'sometimes|required|string',
            'academic.gpa' => 'nullable|numeric|between:0,5',
            'academic.academic_status' => 'sometimes|required|in:active,probation,graduated,dropped',
            'academic.enrollment_status' => 'sometimes|required|in:enrolled,irregular,graduated,dropped',
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
        $student = Student::find($id);

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
