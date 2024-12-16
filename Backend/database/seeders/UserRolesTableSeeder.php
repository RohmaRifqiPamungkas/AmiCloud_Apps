<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_roles')->insert([
            [
                'user_id' => 1, // Menghubungkan ke Admin User
                'role_id' => 1, // Peran: Admin
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2, // Menghubungkan ke User
                'role_id' => 2, // Peran: User
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3, // Menghubungkan ke User Public
                'role_id' => 3, // Peran: User Public
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}