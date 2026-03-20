<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instruction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class InstructionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Instruction::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $instructions = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $instructions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|string|exists:courses,course_id',
            'syllabus' => 'required|array',
            'lessons' => 'required|array',
            'teaching_materials' => 'nullable|array',
            'assessment_types' => 'required|array',
            'grading_rubric' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $instruction = Instruction::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Instruction created successfully',
            'data' => $instruction
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $instruction = Instruction::find($id);

        if (!$instruction) {
            return response()->json([
                'success' => false,
                'message' => 'Instruction not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $instruction
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $instruction = Instruction::find($id);

        if (!$instruction) {
            return response()->json([
                'success' => false,
                'message' => 'Instruction not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'sometimes|required|string|exists:courses,course_id',
            'syllabus' => 'sometimes|required|array',
            'lessons' => 'sometimes|required|array',
            'teaching_materials' => 'nullable|array',
            'assessment_types' => 'sometimes|required|array',
            'grading_rubric' => 'sometimes|required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $instruction->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Instruction updated successfully',
            'data' => $instruction
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $instruction = Instruction::find($id);

        if (!$instruction) {
            return response()->json([
                'success' => false,
                'message' => 'Instruction not found'
            ], 404);
        }

        $instruction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Instruction deleted successfully'
        ]);
    }
}
