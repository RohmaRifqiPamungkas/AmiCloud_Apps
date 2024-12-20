<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('AmiCloud Features') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <!-- Upload Image Section -->
                    <div class="mb-8">
                        <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200">Upload Image</h3>
                        <form method="POST" action="{{ route('file.upload.image') }}" enctype="multipart/form-data">
                            @csrf

                            <div class="mb-4">
                                <label for="image"
                                    class="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Select Image File
                                </label>
                                <input type="file" name="image" id="image" accept="image/*" required
                                    class="block w-full text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
                            </div>

                            <div class="flex justify-start">
                                <x-primary-button>{{ __('Upload Image') }}</x-primary-button>
                            </div>
                        </form>

                        @if (session('image_url'))
                            <div class="mt-4 text-green-500">
                                File berhasil diunggah. Akses file di:
                                <a href="{{ session('image_url') }}" target="_blank" class="text-blue-500 underline">
                                    {{ session('image_url') }}
                                </a>
                            </div>
                        @elseif(session('success') && !session('image_url'))
                            <div class="mt-4 text-green-500">
                                {{ session('success') }}
                            </div>
                        @endif
                    </div>

                    <div class="border-t border-gray-300 py-8"></div>

                    <!-- Upload Image via URL Section -->
                    <div>
                        <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200">Upload Image via URL</h3>
                        <form method="POST" action="{{ route('file.link.create') }}">
                            @csrf

                            <div class="mb-4">
                                <label for="image_url"
                                    class="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Paste Image URL
                                </label>
                                <input type="url" name="image_url" id="image_url"
                                    placeholder="https://example.com/image.jpg" required
                                    class="block w-full text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
                            </div>

                            <div class="flex justify-start">
                                <x-primary-button>{{ __('Upload via Link') }}</x-primary-button>
                            </div>
                        </form>

                        @if (session('url_image'))
                            <div class="mt-4 text-green-500">
                                {!! session('url_image') !!}
                            </div>
                        @endif

                        @if (session('error_url'))
                            <div class="mt-4 text-red-500">
                                {{ session('error_url') }}
                            </div>
                        @endif

                    </div>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
