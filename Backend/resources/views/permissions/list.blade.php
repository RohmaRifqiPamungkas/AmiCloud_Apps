<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Permission') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <x-message></x-message>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <div class="flex justify-end mb-4">
                        <a href="{{ route('permissions.create') }}">
                            <x-primary-button>{{ __('Add New Permission') }}</x-primary-button>
                        </a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full table-auto border-collapse">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-700">
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">ID</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">Name</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">Created</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($permissions as $permission)
                                    <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td class="border px-4 py-2">{{ $permission->id }}</td>
                                        <td class="border px-4 py-2">{{ $permission->name }}</td>
                                        <td class="border px-4 py-2">
                                            {{ \Carbon\Carbon::parse($permission->created_at)->format('d M, Y') }}</td>
                                        <td class="border px-4 py-2 flex space-x-2">

                                            <a href="{{ route('permissions.edit', $permission->id) }}">
                                                <button type="button"
                                                    class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
                                                    Edit
                                                </button>
                                            </a>

                                            <button type="button" onclick="deletePermission({{ $permission->id }})"
                                                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="border px-4 py-2 text-center text-gray-500">
                                            No permissions found.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                        <div class="mt-4">
                            {{ $permissions->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <x-slot name="script">
        <script>
            async function deletePermission(id) {
                if (confirm('Are you sure you want to delete this permission?')) {
                    try {
                        const response = await fetch(`/permissions/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            alert('Permission deleted successfully.');
                            location.reload();
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Failed to delete permission.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred while deleting permission.');
                    }
                }
            }
        </script>
    </x-slot>
</x-app-layout>
