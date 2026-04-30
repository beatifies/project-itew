<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $collection = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'user_id',
        'student_id',
        'faculty_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            // NOTE: Do NOT cast password to 'hashed' here.
            // The AuthController handles both plain-text and bcrypt passwords manually.
            // The 'hashed' cast would auto-bcrypt on every save and break the plain-text flow.
        ];
    }

    /**
     * Overriding Sanctum's tokens relationship for MongoDB compatibility.
     */
    public function tokens()
    {
        return $this->morphMany(MongoPersonalAccessToken::class, 'tokenable');
    }

    /**
     * Overriding createToken to bypass SQL/PDO type-hinting issues.
     */
    public function createToken(string $name, array $abilities = ['*'], \DateTimeInterface $expiresAt = null)
    {
        $plainTextToken = \Illuminate\Support\Str::random(40);

        $token = $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainTextToken),
            'abilities' => $abilities,
            'expires_at' => $expiresAt,
            'tokenable_id' => (string) $this->getKey(),
            'tokenable_type' => get_class($this),
        ]);

        // Sanctum splits the bearer token on '|' and uses the left side as the record ID.
        // We use the MongoDB _id (hex string) — MongoPersonalAccessToken::find() handles this.
        $tokenId = (string) $token->getKey();

        return (object) [
            'accessToken' => $token,
            'plainTextToken' => $tokenId . '|' . $plainTextToken
        ];
    }
}
