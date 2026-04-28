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
        'first_name',
        'last_name',
        'program',
        'year_level',
        'section',
        'gpa',
        'academic_status',
        'honors',
        'scholarship',
        'special_skills',
        'certifications',
        'club_memberships',
        'officer_role',
        'attendance_status',
        'discipline_status',
        'enrollment_status',
    ];

    protected $casts = [
        'year_level' => 'integer',
        'gpa' => 'decimal:2',
        'honors' => 'array',
        'scholarship' => 'array',
        'special_skills' => 'array',
        'certifications' => 'array',
        'club_memberships' => 'array',
    ];

    // Query Scopes
    public function scopeByProgram($query, $program)
    {
        return $query->where('program', $program);
    }

    public function scopeByYearLevel($query, $year)
    {
        return $query->where('year_level', $year);
    }

    public function scopeByAcademicStatus($query, $status)
    {
        return $query->where('academic_status', $status);
    }

    public function scopeWithCleanRecord($query)
    {
        return $query->where('discipline_status', 'clean');
    }

    public function scopeHasHonor($query, $honor)
    {
        return $query->whereJsonContains('honors', $honor);
    }

    public function scopeHasScholarship($query, $scholarship)
    {
        return $query->whereJsonContains('scholarship', $scholarship);
    }

    public function scopeHasSkill($query, $skill)
    {
        return $query->whereJsonContains('special_skills', $skill);
    }
}
