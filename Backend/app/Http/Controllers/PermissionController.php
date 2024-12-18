<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::orderBy('created_at', 'desc')->paginate(10);

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

            return redirect()->route('permissions.index')->with('success', 'Permission successfully added.');
        } else {
            return redirect()->route('permissions.create')->withInput()->withErrors($validator);
        }
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

            return redirect()->route('permissions.index')->with('success', 'Permission update successfully.');
        } else {
            return redirect()->route('permissions.edit', $id)->withInput()->withErrors($validator);
        }
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:permissions,id',
        ]);

        $permission = Permission::findOrFail($request->id);

        $permission->delete();

        session()->flash('success', 'Permission deleted successfully.');
        return response()->json([
            'status' => true
        ]);
    }
}