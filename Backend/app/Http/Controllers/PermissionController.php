<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        return view('permissions.list');
    }

    public function create()
    {
        return view('permissions.create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:permissions|min:3',
        ]);

        if ($validator->fails()) {
            return redirect()->route('permissions.create')
                ->withInput()
                ->withErrors($validator);
        }

        Permission::create([
            'name' => $request->input('name'),
        ]);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission successfully added.');
    }

    // public function edit($id)
    // {
    //     $permission = Permission::findOrFail($id);
    //     return view('permissions.edit', compact('permission'));
    // }

    // public function update(Request $request, $id)
    // {
    //     $permission = Permission::findOrFail($id);

    //     $request->validate([
    //         'name' => 'required|unique:permissions,name,' . $id . '|min:3',
    //     ]);

    //     $permission->update([
    //         'name' => $request->input('name'),
    //     ]);

    //     return redirect()->route('permissions.index')
    //         ->with('success', 'Permission berhasil diperbarui.');
    // }

    // public function destroy($id)
    // {
    //     $permission = Permission::findOrFail($id);
    //     $permission->delete();

    //     return redirect()->route('permissions.index')
    //         ->with('success', 'Permission berhasil dihapus.');
    // }
}