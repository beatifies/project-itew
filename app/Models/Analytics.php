<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytics extends Model
{
    protected $table = 'analytics';
    protected $primaryKey = 'analytics_id';

    protected $fillable = [
        'student_performance_metrics',
        'faculty_load_reports',
        'event_summaries',
        'program_trends',
    ];

    protected $casts = [
        'student_performance_metrics' => 'array',
        'faculty_load_reports' => 'array',
        'event_summaries' => 'array',
        'program_trends' => 'array',
    ];
}
