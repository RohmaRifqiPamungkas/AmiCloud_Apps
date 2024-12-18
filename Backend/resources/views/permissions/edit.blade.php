<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Permession / Edit Permission') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <x-message></x-message>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <div class="flex justify-between mb-4">
                        <a href="{{ route('permissions.index') }}">
                            <x-secondary-button>{{ __('Back to List') }}</x-secondary-button>
                        </a>
                    </div>

                    @if ($errors->any())
                        <div class="mb-4">
                            <ul class="text-red-500 list-disc list-inside text-sm">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('permissions.update', $permission->id) }}" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <div>
                            <label for="name" class="block text-lg font-medium dark:text-gray-100 mb-2">
                                Name
                            </label>
                            <input type="text" id="name" name="name" placeholder="Enter Name"
                                value="{{ old('name', $permission->name) }}"
                                class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 px-4 py-2">
                        </div>

                        <div class="flex justify-start">
                            <x-primary-button>{{ __('Update') }}</x-primary-button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
