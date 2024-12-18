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

                    <div class="flex justify-end mb-4">
                        <a href="{{ route('roles.create') }}">
                            <x-primary-button>{{ __('Add New Role') }}</x-primary-button>
                        </a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-700">
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('ID') }}</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Name') }}</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Permission') }}
                                    </th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Created') }}</th>
                                    <th class="border px-4 py-2 text-center dark:text-gray-100">{{ __('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($roles as $role)
                                    <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td class="border px-4 py-2">{{ $role->id }}</td>
                                        <td class="border px-4 py-2">{{ $role->name }}</td>
                                        <td class="border px-4 py-2">
                                            {{ $role->permissions->pluck('name')->isNotEmpty()
                                                ? $role->permissions->pluck('name')->implode(', ')
                                                : __('No permissions') }}
                                        </td>
                                        <td class="border px-4 py-2">
                                            {{ \Carbon\Carbon::parse($role->created_at)->format('d M, Y') }}
                                        </td>
                                        <td class="border px-4 py-2 text-center flex justify-center space-x-2">
                                            <a href="{{ route('roles.edit', $role->id) }}"
                                                class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
                                                {{ __('Edit') }}
                                            </a>
                                            <button type="button" onclick="deleteRole({{ $role->id }})"
                                                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded">
                                                {{ __('Delete') }}
                                            </button>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5"
                                            class="border px-4 py-2 text-center text-gray-500 dark:text-gray-400">
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
