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
        // Membuat users
        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'adminuser',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // ganti dengan password yang aman
            'is_active' => 1,
        ]);

        $user = User::create([
            'name' => 'Regular User',
            'username' => 'regularuser',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'is_active' => 1,
        ]);

        $public = User::create([
            'name' => 'Public User',
            'username' => 'publicuser',
            'email' => 'public@example.com',
            'password' => Hash::make('password'),
            'is_active' => 1,
        ]);

        // Menambahkan Role ke Users
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