<?php

namespace App\Http\Controllers\Features\RolesAndPermissions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Controllers\Controller;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view permissions', only: ['index']),
            new Middleware('permission:edit permissions', only: ['edit']),
            new Middleware('permission:create permissions', only: ['create']),
            new Middleware('permission:delete permissions', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $permissions = Permission::orderBy('created_at', 'desc')->paginate(10);

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'permissions' => $permissions,
                'message' => 'Permissions retrieved successfully.',
            ], 200);
        }

        return view('permissions.list', [
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        return view('permissions.create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:permissions,name|min:3'
        ]);

        if ($validator->passes()) {
            Permission::create([
                'name' => $request->name
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Permission created successfully.'
                ], 201);
            }

            return redirect()->route('permissions.index')->with('success', 'Permission successfully added.');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        return redirect()->route('permissions.create')->withInput()->withErrors($validator);
    }

    public function edit($id)
    {
        $permission = Permission::findOrFail($id);

        return view('permissions.edit', [
            'permission' => $permission
        ]);
    }

    public function update($id, Request $request)
    {
        $permission = Permission::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3|unique:permissions,name,' . $id . ',id'
        ]);

        if ($validator->passes()) {
            $permission->name = $request->name;
            $permission->save();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Permission updated successfully.',
                    'permission' => $permission,
                ], 200);
            }

            return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        return redirect()->route('permissions.edit', $id)->withInput()->withErrors($validator);
    }

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);

        try {
            $permission->delete();

            if (request()->expectsJson()) {
                return response()->json(['message' => 'Permission deleted successfully.'], 200);
            }

            return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {

            if (request()->expectsJson()) {
                return response()->json(['message' => 'Failed to delete permission.', 'error' => $e->getMessage()], 500);
            }

            return redirect()->route('permissions.index')->with('error', 'Failed to delete permission.');
        }
    }
}