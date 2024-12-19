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
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Membuat Roles
        $admin = Role::create(['name' => 'admin']);
        $user = Role::create(['name' => 'user']);
        $public = Role::create(['name' => 'public']);

        // Memberikan Permissions pada Role admin
        $admin->givePermissionTo(Permission::all()); // Memberi semua permissions pada admin

        // Memberikan Permissions pada Role user
        $user->givePermissionTo([
            'view articles',
            'edit articles',
            'view users',
            'view permissions'
        ]);

        // Memberikan Permissions pada Role public
        $public->givePermissionTo([
            'view articles',
        ]);
    }
}