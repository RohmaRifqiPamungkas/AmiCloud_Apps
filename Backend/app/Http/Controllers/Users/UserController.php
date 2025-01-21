<?php

namespace App\Http\Controllers\Users;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Controllers\Controller;

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
        $searchTerm = $request->input('search');
        $perPage = $request->query('per_page', 10);

        $usersQuery = User::with('roles');

        if ($searchTerm) {
            $usersQuery->where(function ($query) use ($searchTerm) {
                $query->where('full_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('username', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%');
            });
        }

        $users = $usersQuery->latest()->paginate(10);

        if ($request->expectsJson()) {
            return response()->json([
                'users' => $users->through(function ($user) {
                    return array_merge($user->toArray(), [
                        'roles' => $user->roles->pluck('name'),
                    ]);
                }),
            ]);
        }

        return view('users.list', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $roles = Role::orderBy('name', 'ASC')->get();

        if ($request->expectsJson()) {
            return response()->json(['roles' => $roles]);
        }

        return view('users.create', compact('roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|min:3',
            'username' => 'required|string|min:3',
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
            'full_name' => $request->full_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'image_profile' => 'images/profiles/default-profile.png',
        ]);

        if ($request->has('roles')) {
            $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->assignRole($roles);
        }

        $token = $user->createApiToken('web');

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'User created successfully.',
                'user' => array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames(),
                ]),
                'token' => $token,
            ], 201);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
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
                'hasRoles' => $hasRoles,
            ]);
        }

        return view('users.edit', compact('user', 'roles', 'hasRoles'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // Validasi data input
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|min:3',
            'username' => 'required|string|min:3|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'nullable|array',
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

        $data = $request->only(['full_name', 'username', 'email']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);

        if ($request->has('roles')) {
            $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->syncRoles($roles);
        } else {
            $user->syncRoles([]);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'User updated successfully.',
                'user' => array_merge($user->toArray(), [
                    'roles' => $user->roles->pluck('name')->toArray(),
                ]),
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