<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view roles', only: ['index']),
            new Middleware('permission:edit roles', only: ['edit']),
            new Middleware('permission:create roles', only: ['create']),
            new Middleware('permission:delete roles', only: ['destroy']),
        ];
    }

    public function index()
    {
        $roles = Role::orderBy('name', 'DESC')->paginate(10);
        return view('roles.list', [
            'roles' => $roles
        ]);
    }


    public function create()
    {
        $permissions = Permission::orderBy('name', 'ASC')->get();
        return view('roles.create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name|min:3'
        ]);

        if ($validator->passes()) {
            $role = Role::create([
                'name' => $request->name
            ]);

            if (!empty($request->permission)) {
                foreach ($request->permission as $name) {
                    $role->givePermissionTo($name);
                }
            }

            return redirect()->route('roles.index')->with('success', 'Roles add successfully.');
        } else {
            return redirect()->route('roles.create')->withInput()->withErrors($validator);
        }
    }

    public function edit($id)
    {
        $role = Role::findOrFail($id);
        $hasPermissions = $role->permissions->pluck('name');
        $permissions = Permission::orderBy('name', 'desc')->get();

        return view('roles.edit', [
            'permissions' => $permissions,
            'hasPermissions' => $hasPermissions,
            'role' => $role
        ]);
    }

    public function update($id, Request $request)
    {
        $role = Role::findOrFail($id);

        // Validasi data
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name,' . $id,
        ]);

        if ($validator->fails()) {
            return redirect()
                ->route('roles.edit', $id)
                ->withInput()
                ->withErrors($validator);
        }

        $role->name = $request->name;
        $role->save();

        if ($request->has('permissions')) {
            $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name');
            $role->syncPermissions($permissionNames);
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        try {
            $role->delete();
            return response()->json(['message' => 'Role deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete role.', 'error' => $e->getMessage()], 500);
        }
    }
}
