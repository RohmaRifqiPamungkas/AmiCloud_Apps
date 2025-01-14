<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $verifiedAt = now();
        $defaultProfileImage = 'images/profiles/default-profile.png';

        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'adminuser',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'image_profile' => $defaultProfileImage,
            'is_active' => 1,
            'email_verified_at' => $verifiedAt,
        ]);

        $user = User::create([
            'name' => 'User',
            'username' => 'regularuser',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'image_profile' => $defaultProfileImage,
            'is_active' => 1,
            'email_verified_at' => $verifiedAt,
        ]);

        $public = User::create([
            'name' => 'Public User',
            'username' => 'publicuser',
            'email' => 'public@example.com',
            'password' => Hash::make('password'),
            'image_profile' => $defaultProfileImage,
            'is_active' => 1,
            'email_verified_at' => $verifiedAt,
        ]);

        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();
        $publicRole = Role::where('name', 'public')->first();

        if ($adminRole) {
            $admin->assignRole($adminRole);
        }

        if ($userRole) {
            $user->assignRole($userRole);
        }

        if ($publicRole) {
            $public->assignRole($publicRole);
        }
    }
}