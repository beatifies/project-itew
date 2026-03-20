<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faculty::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('faculty_id', 'like', "%{$search}%");
            });
        }

        // Filter by employment status
        if ($request->has('employment_status')) {
            $query->where('employment_status', $request->employment_status);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $faculty = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $faculty
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'faculty_id' => 'required|string|unique:faculty,faculty_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'degrees' => 'required|array',
            'ccs_role' => 'required|string',
            'employment_status' => 'required|in:full_time,part_time,adjunct,on_leave',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $faculty = Faculty::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Faculty created successfully',
            'data' => $faculty
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $faculty
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'degrees' => 'sometimes|required|array',
            'ccs_role' => 'sometimes|required|string',
            'employment_status' => 'sometimes|required|in:full_time,part_time,adjunct,on_leave',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $faculty->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Faculty updated successfully',
            'data' => $faculty
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty not found'
            ], 404);
        }

        $faculty->delete();

        return response()->json([
            'success' => true,
            'message' => 'Faculty deleted successfully'
        ]);
    }
}
