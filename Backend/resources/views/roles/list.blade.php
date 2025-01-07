<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Roles') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <!-- Flash Message -->
            <x-message></x-message>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">
                            {{ __('Roles List') }}
                        </h3>
                        <a href="{{ route('roles.create') }}">
                            <x-primary-button>{{ __('Add New Role') }}</x-primary-button>
                        </a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-700 text-left">
                                    <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                        {{ __('ID') }}</th>
                                    <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                        {{ __('Name') }}</th>
                                    <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                        {{ __('Permissions') }}</th>
                                    <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                        {{ __('Created') }}</th>
                                    <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300 text-center">
                                        {{ __('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($roles as $role)
                                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {{ $role->id }}</td>
                                        <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {{ $role->name }}</td>
                                        <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {{ $role->permissions->isNotEmpty() ? $role->permissions->pluck('name')->implode(', ') : __('No permissions') }}
                                        </td>
                                        <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {{ $role->created_at->format('d M, Y') }}
                                        </td>
                                        <td class="border px-6 py-4 text-center flex justify-center space-x-3">
                                            @can('edit roles')
                                                <a href="{{ route('roles.edit', $role->id) }}"
                                                    class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
                                                    {{ __('Edit') }}
                                                </a>
                                            @endcan

                                            @can('delete roles')
                                                <button type="button" onclick="deleteRole({{ $role->id }})"
                                                    class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded">
                                                    {{ __('Delete') }}
                                                </button>
                                            @endcan
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5"
                                            class="border px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {{ __('No roles found.') }}
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>

                        <div class="mt-4">
                            {{ $roles->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <x-slot name="script">
        <script>
            async function deleteRole(id) {
                if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
                    try {
                        const response = await fetch(`/roles/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            alert('Role deleted successfully.');
                            location.reload();
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Failed to delete role.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred while deleting role.');
                    }
                }
            }
        </script>
    </x-slot>
</x-app-layout>
