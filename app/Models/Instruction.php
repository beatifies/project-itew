<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Instruction extends Model
{
    protected $table = 'instructions';
    protected $primaryKey = '_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'course_id',
        'syllabus',
        'lessons',
        'teaching_materials',
        'assessment_types',
        'grading_rubric',
    ];

    protected $casts = [
        'syllabus' => 'array',
        'lessons' => 'array',
        'teaching_materials' => 'array',
        'assessment_types' => 'array',
        'grading_rubric' => 'array',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}
