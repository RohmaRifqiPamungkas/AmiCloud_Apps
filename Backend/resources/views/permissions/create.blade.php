<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Permission / Create') }}
            </h2>
            <!-- Tombol Back to List di samping title -->
            <a href="{{ route('permissions.index') }}" 
               class="text-indigo-600 hover:text-indigo-900 inline-flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                    <!-- Menampilkan pesan error jika ada -->
                    @if ($errors->any())
                        <div class="mb-4">
                            <ul class="text-red-500 list-disc list-inside text-sm">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('permissions.store') }}" class="space-y-6">
                        @csrf
                        <div>
                            <label for="name" class="block text-lg font-medium dark:text-gray-100 mb-2">
                                Name
                            </label>
                            <input type="text" id="name" name="name" placeholder="Enter Name"
                                value="{{ old('name') }}"
                                class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 px-4 py-2">
                        </div>
                        
                        <!-- Tombol Submit -->
                        <div class="flex justify-start">
                            <x-primary-button>{{ __('Submit') }}</x-primary-button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
