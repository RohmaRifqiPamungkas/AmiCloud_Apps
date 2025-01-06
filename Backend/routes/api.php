<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Session\Middleware\StartSession;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Articles\ArticleController;
use App\Http\Controllers\Users\ProfileController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Features\RolesAndPermissions\PermissionController;
use App\Http\Controllers\Features\RolesAndPermissions\RoleController;
use App\Http\Controllers\Features\FileManagement\ImageUploadController;
use App\Http\Controllers\Features\FileManagement\LinkReuploadController;
use App\Http\Controllers\Features\FileManagement\FileManagementController;

// Route API
Route::prefix('v1')->middleware([StartSession::class])->group(function () {
    // Fitur otentikasi
    Route::middleware('guest')->group(function () {
        Route::post('register', [RegisteredUserController::class, 'store']);
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
        Route::post('forgot-password', [PasswordResetLinkController::class, 'store']);
        Route::post('reset-password', [NewPasswordController::class, 'store']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        // Mengambil informasi user
        Route::get('user', function (Request $request) {
            return $request->user();
        });

        // Verifikasi email
        Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store']);

        // Konfirmasi password
        Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

        // Ubah password
        Route::put('password', [PasswordController::class, 'update']);

        // Logout
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);

        // Profile User
        Route::get('profile', [ProfileController::class, 'edit'])->name('api.profile.edit');
        Route::patch('profile', [ProfileController::class, 'update'])->name('api.profile.update');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');

        // Articles
        Route::apiResource('articles', ArticleController::class, ['as' => 'api']);

        // Users Management
        Route::apiResource('users', UserController::class, ['as' => 'api']);

        // Permissions
        Route::apiResource('permissions', PermissionController::class, ['as' => 'api']);

        // Roles
        Route::apiResource('roles', RoleController::class, ['as' => 'api']);

        // Management File
        Route::apiResource('management_files', FileManagementController::class, ['as' => 'api']);

        // Upload Image (POST untuk mengunggah gambar)
        Route::post('file/upload/image', [ImageUploadController::class, 'upload'])
            ->middleware('throttle:upload-image')
            ->name('api.file.upload.image');

        // Upload Image URL (POST untuk mengupload link gambar)
        Route::post('file/link-upload', [LinkReuploadController::class, 'createLink'])
            ->middleware('throttle:link-upload')
            ->name('file.link.upload');
    });
});