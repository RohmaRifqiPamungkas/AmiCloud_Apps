<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        // Membuat Permissions
        $permissions = [
            // Articles Management
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',

            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Permission Management
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',

            // File Management
            'view file management',
            'show file management',
            'edit file management',
            'create file management',
            'delete file management',
        ];

        // Membuat permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Membuat Roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);
        $public = Role::firstOrCreate(['name' => 'public']);

        // Memberikan Permissions pada Role admin
        $admin->givePermissionTo(Permission::all()); // Semua permissions untuk admin

        // Memberikan Permissions pada Role user
        $user->givePermissionTo([
            'view articles',
            'edit articles',
            'view users',
            'view file management',
            'show file management',
            'edit file management',
            'create file management',
        ]);

        // Memberikan Permissions pada Role public
        $public->givePermissionTo([
            'view articles',
        ]);
    }
}