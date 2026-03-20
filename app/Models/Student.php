<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
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
        'scholarships',
        'special_skills',
        'certifications',
        'club_memberships',
        'officer_role',
        'attendance_status',
        'discipline_status',
        'enrollment_status',
    ];

    protected $casts = [
        'honors' => 'array',
        'scholarships' => 'array',
        'special_skills' => 'array',
        'certifications' => 'array',
        'club_memberships' => 'array',
        'year_level' => 'integer',
        'gpa' => 'decimal:2',
    ];

    public function eventParticipations(): HasMany
    {
        return $this->hasMany(EventParticipation::class, 'student_id', 'student_id');
    }

    public function user(): HasMany
    {
        return $this->hasMany(User::class, 'user_id', 'student_id');
    }
}
