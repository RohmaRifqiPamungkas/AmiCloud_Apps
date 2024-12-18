<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
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

            return redirect()->route('roles.index')->with('success', 'Roles berhasil ditambahkan.');
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

    public function destroy(request $request)
    {
        $id = $request->id;
        $role = Role::find($id);

        if ($role == null) {
            session()->flash('error', 'Role not found.');
            return response()->json([
                'status' => false
            ]);
        }

        $role->delete();

        session()->flash('success', 'Role deleted successfully.');
        return response()->json([
            'status' => true
        ]);
    }
}