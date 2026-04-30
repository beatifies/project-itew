<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class MongoPersonalAccessToken extends Model implements HasAbilities
{
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
        'tokenable_id',
        'tokenable_type',
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

    /**
     * Override Sanctum's token lookup for MongoDB compatibility.
     * Sanctum calls this with the hashed token string to find the record.
     */
    public static function findToken($token)
    {
        if (!str_contains($token, '|')) {
            // Plain token (no ID prefix) — just hash-search
            return static::where('token', hash('sha256', $token))->first();
        }

        [$id, $plainToken] = explode('|', $token, 2);

        // Find by MongoDB _id (which is the hex ObjectId string we stored)
        $instance = static::find($id);

        if ($instance && hash_equals($instance->token, hash('sha256', $plainToken))) {
            return $instance;
        }

        return null;
    }

    public function can($ability)
    {
        return in_array('*', $this->abilities) ||
               array_key_exists($ability, array_flip($this->abilities));
    }

    public function cant($ability)
    {
        return ! $this->can($ability);
    }
}
