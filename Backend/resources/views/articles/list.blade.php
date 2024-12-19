<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Articles') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <!-- Flash Message -->
            <x-message></x-message>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <div class="flex justify-end mb-4">
                        <a href="{{ route('articles.create') }}">
                            <x-primary-button>{{ __('Add New Article') }}</x-primary-button>
                        </a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-700">
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('ID') }}</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Title') }}</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Text') }}</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Author') }}</th>
                                    <th class="border px-4 py-2 text-left dark:text-gray-100">{{ __('Created') }}</th>
                                    <th class="border px-4 py-2 text-center dark:text-gray-100">{{ __('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($articles as $article)
                                    <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td class="border px-4 py-2">{{ $article->id }}</td>
                                        <td class="border px-4 py-2">{{ $article->title }}</td>
                                        <td class="border px-4 py-2">{{ $article->text }}</td>
                                        <td class="border px-4 py-2">{{ $article->author }}</td>
                                        <td class="border px-4 py-2">
                                            {{ \Carbon\Carbon::parse($article->created_at)->format('d M, Y') }}
                                        </td>
                                        <td class="border px-4 py-2 text-center flex justify-center space-x-2">

                                            @can('edit articles')
                                                <a href="{{ route('articles.edit', $article->id) }}"
                                                    class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
                                                    {{ __('Edit') }}
                                                </a>
                                            @endcan

                                            @can('delete articles')
                                                <button type="button" onclick="deleteArticle({{ $article->id }})"
                                                    class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded">
                                                    {{ __('Delete') }}
                                                </button>
                                            @endcan

                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6"
                                            class="border px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                                            {{ __('No articles found.') }}
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>

                        <div class="mt-4">
                            {{ $articles->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <x-slot name="script">
        <script>
            async function deleteArticle(id) {
                if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
                    try {
                        const response = await fetch(`/articles/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            alert('Article deleted successfully.');
                            location.reload();
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Failed to delete article.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred while deleting article.');
                    }
                }
            }
        </script>
    </x-slot>
</x-app-layout>
