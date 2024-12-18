<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Roles / Edit') }}
            </h2>
            <a href="{{ route('roles.index') }}"
                class="text-indigo-600 hover:text-indigo-900 inline-flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M5 12h13" />
                </svg>
                <span>{{ __('Back to Permission List') }}</span>
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    @if ($errors->any())
                        <div class="mb-4">
                            <ul class="text-red-500 list-disc list-inside text-sm">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('roles.update', $role->id) }}" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <div>
                            <label for="name" class="block text-lg font-medium dark:text-gray-100 mb-2">
                                Name
                            </label>
                            <input type="text" id="name" name="name" placeholder="Enter Name"
                                value="{{ old('name', $role->name) }}"
                                class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 px-4 py-2">
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-lg font-medium dark:text-gray-100">Permissions</h3>

                            <input type="hidden" name="permissions[]" value="">

                            <div class="grid grid-cols-4 gap-4">
                                @if ($permissions->isNotEmpty())
                                    @foreach ($permissions as $permission)
                                        <div class="mt-3">
                                            <input type="checkbox" id="permission-{{ $permission->id }}"
                                                name="permissions[]" value="{{ $permission->id }}"
                                                {{ $hasPermissions->contains($permission->name) ? 'checked' : '' }}>
                                            <label for="permission-{{ $permission->id }}"
                                                class="ml-2 dark:text-gray-100">
                                                {{ $permission->name }}
                                            </label>
                                        </div>
                                    @endforeach
                                @else
                                    <p class="col-span-4 text-gray-500 dark:text-gray-400">
                                        No permissions available.
                                    </p>
                                @endif
                            </div>
                        </div>

                        <div class="flex justify-start">
                            <x-primary-button>{{ __('Submit') }}</x-primary-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
