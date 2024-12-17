<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Permission') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Tampilkan pesan sukses atau error -->
            <x-message></x-message>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <!-- Tombol Add New Permission -->
                    <div class="flex justify-end mb-4">
                        <a href="{{ route('permissions.create') }}">
                            <x-primary-button>{{ __('Add New Permission') }}</x-primary-button>
                        </a>
                    </div>

                    <!-- Tabel List Permissions -->
                    <div class="overflow-x-auto">
                        <table class="w-full table-auto border-collapse">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-700">
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">ID</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">Name</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{-- @forelse ($permissions as $permission)
                                    <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td class="border px-4 py-2">{{ $permission->id }}</td>
                                        <td class="border px-4 py-2">{{ $permission->name }}</td>
                                        <td class="border px-4 py-2 flex space-x-2">
                                            <!-- Tombol Edit -->
                                            <a href="{{ route('permissions.edit', $permission->id) }}"
                                               class="text-blue-500 hover:underline">Edit</a>
                                            <!-- Tombol Delete -->
                                            <form action="{{ route('permissions.destroy', $permission->id) }}" method="POST" onsubmit="return confirm('Are you sure?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-red-500 hover:underline">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="border px-4 py-2 text-center">No permissions found.</td>
                                    </tr>
                                @endforelse --}}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
