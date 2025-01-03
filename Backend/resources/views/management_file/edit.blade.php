<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Articles / Edit') }}
            </h2>
            <a href="{{ route('articles.index') }}"
                class="text-indigo-600 hover:text-indigo-900 inline-flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M5 12h13" />
                </svg>
                <span>{{ __('Back to Articles List') }}</span>
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

                    <form method="POST" action="{{ route('articles.update', $article->id) }}" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <div>
                            <label for="title" class="block text-lg font-medium dark:text-gray-100 mb-2">
                                Title
                            </label>
                            <input type="text" id="title" name="title" placeholder="Enter Title"
                                value="{{ old('title', $article->title) }}"
                                class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 px-4 py-2">
                        </div>

                        <div>
                            <label for="email" class="block text-lg font-medium dark:text-gray-100 mb-2">
                                Content
                            </label>
                            <textarea name="text" id="text"
                                class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 px-4 py-2" placeholder="Enter Content"
                                cols="30" rows="10">{{ old('text', $article->text) }}</textarea>
                        </div>

                         <div>
                            <label for="author" class="block text-lg font-medium dark:text-gray-100 mb-2">
                                Author
                            </label>
                            <input type="text" id="author" name="author" placeholder="Enter Author"
                                value="{{ old('author', $article->author) }}"
                                class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 px-4 py-2">
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
