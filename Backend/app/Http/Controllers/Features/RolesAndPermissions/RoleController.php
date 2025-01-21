<?php

namespace App\Http\Controllers\Features\RolesAndPermissions;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Controllers\Controller;

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

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $rolesPaginated = Role::with('permissions')->orderBy('name', 'DESC')->paginate($perPage);

        $rolesPaginated->setCollection(
            $rolesPaginated->getCollection()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'access' => $role->permissions->pluck('name')->implode(', '),
                    'created_at' => $role->created_at->toIso8601String(),
                    'updated_at' => $role->updated_at->toIso8601String(),
                    'permission_id' => $role->permissions->pluck('id')->toArray(),
                ];
            })
        );

        if ($request->expectsJson()) {
            return response()->json($rolesPaginated, 200);
        }

        return view('roles.list', [
            'roles' => $rolesPaginated,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $permissions = Permission::orderBy('name', 'ASC')->get();

        if ($request->expectsJson()) {
            return response()->json([
                'permissions' => $permissions,
            ]);
        }

        return view('roles.create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name|min:3'
        ]);

        if ($validator->passes()) {
            $role = Role::create([
                'name' => $request->name,
                'guard_name' => $request->guard_name ?? 'web'
            ]);

            if (!empty($request->permission)) {
                foreach ($request->permission as $name) {
                    $role->givePermissionTo($name);
                }
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Role created successfully.',
                    'role' => $role,
                ], 201);
            }

            return redirect()->route('roles.index')->with('success', 'Role created successfully.');
        } else {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            return redirect()->route('roles.create')->withInput()->withErrors($validator);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::findOrFail($id);

        return view('roles.index', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, Request $request)
    {
        $role = Role::findOrFail($id);
        $permissions = Permission::orderBy('name', 'desc')->get();
        // $hasPermissions = $role->permissions->pluck('name');
        $hasPermissions = $role->permissions->pluck('id')->toArray();

        if ($request->expectsJson()) {
            return response()->json([
                'role' => $role,
                'permissions' => $permissions,
                'hasPermissions' => $hasPermissions
            ]);
        }

        return view('roles.edit', [
            'role' => $role,
            'permissions' => $permissions,
            'hasPermissions' => $hasPermissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name,' . $id,
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            return redirect()->route('roles.edit', $id)->withInput()->withErrors($validator);
        }

        $role->name = $request->name;
        $role->save();

        if ($request->has('permissions')) {
            // $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name');
            // $role->syncPermissions($permissionNames);
            $permissionIds = $request->permissions;
            $role->syncPermissions($permissionIds);
        } else {
            $role->syncPermissions([]);
        }

        // Mengambil permissions yang sudah disinkronkan
        $role->load('permissions');  // Mengambil relation permissions yang terkait dengan role

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Role updated successfully.',
                'role' => $role,
                'permissions' => $role->permissions,  // Tambahkan permissions dalam response
            ]);
        }

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        $role = Role::findOrFail($id);

        try {
            $role->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Role deleted successfully.',
                ], 200);
            }

            return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to delete role.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return redirect()->route('roles.index')->withErrors(['error' => $e->getMessage()]);
        }
    }
}