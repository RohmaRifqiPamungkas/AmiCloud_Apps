<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'nullable|array', // Validasi roles jika ada
        ]);

        // Jika validasi gagal, kirimkan respons error
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        // Membuat user baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Menambahkan roles jika ada
        if ($request->has('roles')) {
            $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->assignRole($roles);
        }

        // Mengirimkan response sukses
        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], 201); // Status code 201 untuk sukses pembuatan resource
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Tampilkan user berdasarkan id
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Update user berdasarkan id
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Hapus user berdasarkan id
    }
}