<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('course_code', 'like', "%{$search}%")
                  ->orWhere('course_title', 'like', "%{$search}%")
                  ->orWhere('program', 'like', "%{$search}%");
            });
        }

        // Filter by program
        if ($request->has('program')) {
            $query->where('program', $request->program);
        }

        // Filter by year level
        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        // Filter by semester
        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $courses = $query->orderBy('course_code')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|string|max:50|unique:courses,course_id',
            'course_code' => 'required|string|max:20|unique:courses,course_code',
            'course_title' => 'required|string|max:255',
            'program' => 'required|string|max:100',
            'units' => 'required|integer|min:1|max:10',
            'year_level' => 'required|integer|min:1|max:4',
            'semester' => 'required|in:1st,2nd,summer',
            'learning_outcomes' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $course = Course::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'sometimes|required|string|max:50|unique:courses,course_id,' . $id . ',course_id',
            'course_code' => 'sometimes|required|string|max:20|unique:courses,course_code,' . $id . ',course_id',
            'course_title' => 'sometimes|required|string|max:255',
            'program' => 'sometimes|required|string|max:100',
            'units' => 'sometimes|required|integer|min:1|max:10',
            'year_level' => 'sometimes|required|integer|min:1|max:4',
            'semester' => 'sometimes|required|in:1st,2nd,summer',
            'learning_outcomes' => 'sometimes|required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $course->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }
}
