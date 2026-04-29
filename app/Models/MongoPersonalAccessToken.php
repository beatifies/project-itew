<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class MongoPersonalAccessToken extends Model implements HasAbilities
{
    protected $collection = 'personal_access_tokens';

    protected $fillable = [
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
        'tokenable_id',
        'tokenable_type',
    ];

    protected $hidden = [
        'token',
    ];

    protected $casts = [
        'abilities' => 'array',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function tokenable()
    {
        return $this->morphTo();
    }

    public function can($ability)
    {
        return in_array('*', $this->abilities) || in_array($ability, $this->abilities);
    }

    public function canAny($abilities)
    {
        return in_array('*', $this->abilities) || array_intersect($abilities, $this->abilities);
    }

    public function cant($ability)
    {
        return !$this->can($ability);
    }
}
