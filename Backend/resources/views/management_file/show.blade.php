<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('File Management / Show') }}
            </h2>
            <a href="{{ route('management_file.index') }}"
                class="text-indigo-600 hover:text-indigo-900 inline-flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M5 12h13" />
                </svg>
                <span>{{ __('Back to File Management') }}</span>
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

            <!-- Kartu Preview Gambar -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 class="text-lg font-medium dark:text-gray-100 mb-4 text-center">
                    {{ __('Preview') }}
                </h3>
                <div class="flex justify-center">
                    <img src="{{ asset($fileUpload->file_path) }}" alt="{{ $fileUpload->filename }}"
                        class="w-auto h-64 object-contain rounded-lg shadow-lg">
                </div>
                <!-- Tombol Tindakan -->
                <div class="flex justify-center space-x-4 mt-6">
                    <a href="{{ route('management_file.show', $fileUpload->id) }}" class="text-gray-500 hover:text-gray-600">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button type="button" onclick="deleteFile({{ $fileUpload->id }}, 'upload')"
                        class="text-red-500 hover:text-red-600">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button type="button" onclick="copyToClipboard('{{ Storage::url($fileUpload->file_path) }}')"
                        class="text-blue-500 hover:text-blue-600">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" onclick="shareLink('{{ Storage::url($fileUpload->file_path) }}')"
                        class="text-green-500 hover:text-green-600">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>

            <!-- Kartu Detail Informasi -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 class="text-lg font-medium dark:text-gray-100 mb-4">
                    {{ __('File Details') }}
                </h3>
                <div class="grid grid-cols-2 gap-6">
                    <!-- Kolom Kiri -->
                    <div class="space-y-4">
                        <div>
                            <strong class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ __('Title') }}:
                            </strong>
                            <p class="text-lg font-semibold dark:text-white">{{ $fileUpload->filename }}</p>
                        </div>
                        <div>
                            <strong class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ __('File Size') }}:
                            </strong>
                            <p class="text-gray-700 dark:text-gray-300">
                                {{ round($fileUpload->file_size / 1024, 2) }} KB
                            </p>
                        </div>
                        <div>
                            <strong class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ __('Resolution') }}:
                            </strong>
                            <p class="text-gray-700 dark:text-gray-300">
                                {{ $imageResolution ?? __('N/A') }}
                            </p>
                        </div>
                    </div>

                    <!-- Kolom Kanan -->
                    <div class="space-y-4">
                        <div>
                            <strong class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ __('File Format') }}:
                            </strong>
                            <p class="text-gray-700 dark:text-gray-300">
                                {{ $fileUpload->upload_type ?? __('No description available.') }}
                            </p>
                        </div>
                        <div>
                            <strong class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ __('Created At') }}:
                            </strong>
                            <p class="text-gray-700 dark:text-gray-300">
                                {{ $fileUpload->created_at->format('d M Y H:i') }}
                            </p>
                        </div>
                        <div>
                            <strong class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ __('File Path') }}:
                            </strong>
                            <p class="text-gray-700 dark:text-gray-300">
                                <a href="{{ url($fileUpload->file_path) }}"
                                    class="text-indigo-500 hover:text-indigo-700" target="_blank">
                                    {{ __('Download/View File') }}
                                </a>
                            </p>
                        </div>
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
