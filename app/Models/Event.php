<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $table = 'events';
    protected $primaryKey = 'event_id';

    protected $fillable = [
        'event_name',
        'event_type',
        'category',
        'date',
        'time',
        'venue',
        'description',
        'max_participants',
        'status',
        'organizer',
        'outcome',
    ];
    
    protected $casts = [
        'date' => 'datetime',
        'max_participants' => 'integer',
    ];

    public function participations(): HasMany
    {
        return $this->hasMany(EventParticipation::class, 'event_id');
    }
}
