<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    protected $table = 'faculty';
    protected $primaryKey = 'faculty_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'faculty_id',
        'first_name',
        'last_name',
        'degrees',
        'certifications',
        'expertise_areas',
        'research_areas',
        'ccs_role',
        'teaching_load',
        'employment_status',
    ];

    protected $casts = [
        'degrees' => 'array',
        'certifications' => 'array',
        'expertise_areas' => 'array',
        'research_areas' => 'array',
        'teaching_load' => 'integer',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'faculty_id', 'faculty_id');
    }

    public function eventParticipations(): HasMany
    {
        return $this->hasMany(EventParticipation::class, 'faculty_id', 'faculty_id');
    }

    public function user(): HasMany
    {
        return $this->hasMany(User::class, 'user_id', 'faculty_id');
    }
}
