<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as BaseToken;
use MongoDB\Laravel\Eloquent\HybridRelations;

class MongoPersonalAccessToken extends BaseToken
{
    use HybridRelations;

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
}
