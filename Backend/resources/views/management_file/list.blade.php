<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('File Management') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <x-message></x-message>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">
                            {{ __('Uploaded Files') }}
                        </h3>
                        <a href="#upload-modal">
                            <x-primary-button>{{ __('Upload New File') }}</x-primary-button>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        @forelse ($uploads as $file)
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                                <div class="p-4">
                                    <img src="{{ asset($file->file_path) }}" alt="{{ $file->filename }}"
                                        class="w-full h-48 object-cover rounded">
                                </div>
                                <div class="px-4 py-2">
                                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                                        {{ $file->filename }}
                                    </h4>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ round($file->file_size / 1024, 2) }} KB
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ $file->created_at->format('d M, Y') }}
                                    </p>
                                </div>
                                <div class="flex justify-center space-x-3 p-4">
                                    <a href="{{ route('management_file.show', $file->id) }}"
                                        class="text-gray-500 hover:text-gray-600">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <button type="button" onclick="deleteFile({{ $file->id }}, 'upload')"
                                        class="text-red-500 hover:text-red-600">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <button type="button"
                                        onclick="copyToClipboard('{{ Storage::url($file->file_path) }}')"
                                        class="text-blue-500 hover:text-blue-600">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <button type="button" onclick="shareLink('{{ Storage::url($file->file_path) }}')"
                                        class="text-green-500 hover:text-green-600">
                                        <i class="fas fa-share-alt"></i>
                                    </button>
                                </div>
                            </div>
                        @empty
                            <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                                {{ __('No uploaded files found.') }}
                            </div>
                        @endforelse
                    </div>

                    <div class="mt-4">
                        {{ $uploads->links() }}
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">{{ __('External Links') }}</h3>

                <div class="overflow-x-auto mt-4">
                    <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg">
                        <thead>
                            <tr class="bg-gray-100 dark:bg-gray-700 text-left">
                                <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                    {{ __('Short URL') }}
                                </th>
                                <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                    {{ __('Original URL') }}
                                </th>
                                <th class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                                    {{ __('Date') }}
                                </th>
                                <th
                                    class="border px-6 py-3 font-bold text-sm text-gray-700 dark:text-gray-300 text-center">
                                    {{ __('Actions') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($links as $link)
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        <a href="{{ $link->url_image }}" target="_blank">{{ $link->url_image }}</a>
                                    </td>
                                    <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                                        style="word-wrap: break-word; word-break: break-word;">
                                        <a href="{{ $link->original_url }}"
                                            target="_blank">{{ $link->original_url }}</a>
                                    </td>
                                    <td class="border px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {{ $link->created_at->format('d M, Y') }}
                                    </td>
                                    <td class="border px-6 py-4 text-center flex justify-center space-x-3">
                                        <button type="button" onclick="deleteFile({{ $link->id }}, 'link')"
                                            class="text-red-500 hover:text-red-600">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                        <button type="button" onclick="copyToClipboard('{{ $link->original_url }}')"
                                            class="text-blue-500 hover:text-blue-600">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                        <button type="button" onclick="shareLink('{{ $link->original_url }}')"
                                            class="text-green-500 hover:text-green-600">
                                            <i class="fas fa-share-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5"
                                        class="border px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        {{ __('No external links found.') }}
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>

                    <div class="mt-4">
                        {{ $links->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <x-slot name="script">
        <script>
            async function deleteFile(id, type) {
                if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
                    try {
                        const response = await fetch(`/files/${id}/upload?type=${type}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            alert('File deleted successfully.');
                            location.reload();
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Failed to delete file.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred while deleting file.');
                    }
                }
            }

            function copyToClipboard(link) {
                navigator.clipboard.writeText(link).then(() => {
                    alert('Link successfully copied!');
                }).catch((err) => {
                    console.error('Failed to copy link:', err);
                });
            }

            function shareLink(link) {
                if (navigator.share) {
                    navigator.share({
                            title: 'Share Link',
                            url: link
                        })
                        .then(() => console.log('Link successfully shared'))
                        .catch((err) => console.error('Error sharing link:', err));
                } else {
                    alert('Sharing feature is not supported on this browser.');
                }
            }
        </script>
    </x-slot>
</x-app-layout>
