<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Student extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'students';
    protected $primaryKey = 'student_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'student_id',
        'personal_info',
        'academic',
        'skills',
        'affiliations',
        'activities',
        'violations',
        'attendance_status',
        'discipline_status',
    ];

    protected $casts = [
        'personal_info' => 'array',
        'academic' => 'array',
        'skills' => 'array',
        'affiliations' => 'array',
        'activities' => 'array',
        'violations' => 'array',
    ];

    // Query Scopes
    public function scopeWithSkill($query, $skillName)
    {
        return $query->where('skills', 'elemMatch', ['name' => $skillName]);
    }

    public function scopeWithAffiliation($query, $type, $name)
    {
        return $query->where('affiliations', 'elemMatch', [
            'type' => $type,
            'name' => $name
        ]);
    }

    public function scopeWithCleanRecord($query)
    {
        return $query->where(function($q) {
            $q->whereNull('violations')
              ->orWhere('violations', []);
        });
    }

    public function scopeWithGpaAbove($query, $gpa)
    {
        return $query->where('academic.gpa', '>=', $gpa);
    }

    public function scopeByYearLevel($query, $year)
    {
        return $query->where('academic.year_level', $year);
    }

    public function scopeByProgram($query, $program)
    {
        return $query->where('academic.program', $program);
    }

    public function scopeByAcademicStatus($query, $status)
    {
        return $query->where('academic.academic_status', $status);
    }
}
