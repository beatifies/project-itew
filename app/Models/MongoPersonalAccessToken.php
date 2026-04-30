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
     *
     * The default Sanctum implementation does static::find($id) where $id is the
     * portion before the '|' in the bearer token. With MongoDB, that ID is a hex
     * ObjectId string, and laravel-mongodb does NOT reliably auto-cast hex strings
     * to BSON ObjectId for _id queries — so find() returns null → 401 on every
     * authenticated request.
     *
     * Solution: ignore the ID prefix entirely and query by the sha256 hash of the
     * plain-text token instead. This is equally secure (SHA-256 pre-image resistance)
     * and avoids all ObjectId casting issues.
     */
    public static function findToken($token)
    {
        // Strip the ID prefix if present (format: "{id}|{plainToken}")
        if (str_contains($token, '|')) {
            [, $token] = explode('|', $token, 2);
        }

        return static::where('token', hash('sha256', $token))->first();
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
