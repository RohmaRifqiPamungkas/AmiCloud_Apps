<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Auth\Events\Verified;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'full_name',
        'phone',
        'birthday_date',
        'upload_count',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function markEmailAsVerified()
    {
        if (!$this->hasVerifiedEmail()) {
            $this->forceFill([
                'email_verified_at' => now(),
                'is_active' => 1,
            ])->save();

            event(new Verified($this));
        }
    }

    /**
     * Create a personal access token for the user.
     *
     * @param  string  $tokenName
     * @return string
     */
    public function createApiToken($tokenName)
    {
        $token = $this->createToken($tokenName);

        return $token->plainTextToken;
    }
}
