<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view users', only: ['index']),
            new Middleware('permission:create users', only: ['create', 'store']),
            new Middleware('permission:edit users', only: ['edit', 'update']),
            new Middleware('permission:delete users', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::latest()->paginate(10);

        if ($request->expectsJson()) {
            return response()->json([
                'users' => $users,
            ]);
        }

        return view('users.list', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $roles = Role::orderBy('name', 'ASC')->get();

        if ($request->expectsJson()) {
            return response()->json([
                'roles' => $roles,
            ]);
        }

        return view('users.create', compact('roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            return redirect()->back()->withInput()->withErrors($validator);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->has('roles')) {
            $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->assignRole($roles);
        }

        $token = $user->createApiToken('web');

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'User created successfully.',
                'user' => $user,
                'token' => $token
            ], 201);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return view('users.index', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, Request $request)
    {
        $user = User::findOrFail($id);
        $roles = Role::orderBy('name', 'ASC')->get();
        $hasRoles = $user->roles->pluck('id');

        if ($request->expectsJson()) {
            return response()->json([
                'user' => $user,
                'roles' => $roles,
                'hasRoles' => $hasRoles
            ]);
        }

        return view('users.edit', [
            'user' => $user,
            'roles' => $roles,
            'hasRoles' => $hasRoles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            return redirect()->route('users.edit', $id)->withInput()->withErrors($validator);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        if ($request->has('roles')) {
            $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->syncRoles($roles);
        } else {
            $user->syncRoles([]);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'User updated successfully.',
                'user' => $user,
            ]);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id, Request $request)
    {
        $user = User::findOrFail($id);

        try {
            $user->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'User deleted successfully.',
                ], 200);
            }

            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to delete user.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return redirect()->route('users.index')->withErrors(['error' => $e->getMessage()]);
        }
    }
}