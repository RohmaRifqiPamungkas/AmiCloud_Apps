<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            ['id' => 1, 'name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password'), 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'User', 'email' => 'user@example.com', 'password' => bcrypt('password'), 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'User Public', 'email' => 'userpublic@example.com', 'password' => bcrypt('password'), 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}