<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {

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
            
            // Permission Features
            'view features',
            'create features',

            // File Management
            'view file management',
            'show file management',
            'edit file management',
            'create file management',
            'delete file management',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);
        $public = Role::firstOrCreate(['name' => 'public']);

        $admin->givePermissionTo(Permission::all()); 

        $user->givePermissionTo([
            'view articles',
            'edit articles',
            'view users',
            'view file management',
            'show file management',
            'edit file management',
            'create file management',
        ]);

        $public->givePermissionTo([
            'view articles',
        ]);
    }
}