<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Course extends Model
{
    protected $primaryKey = 'course_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'course_id',
        'course_code',
        'course_title',
        'program',
        'units',
        'year_level',
        'semester',
        'learning_outcomes',
    ];

    protected $casts = [
        'learning_outcomes' => 'array',
        'units' => 'integer',
        'year_level' => 'integer',
    ];

    public function instruction(): HasOne
    {
        return $this->hasOne(Instruction::class, 'course_id', 'course_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'course_id', 'course_id');
    }
}
