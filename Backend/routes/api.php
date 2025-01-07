<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Controllers\Users\UserController;
use Illuminate\Session\Middleware\StartSession;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Users\ProfileController;
use App\Http\Controllers\Articles\ArticleController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Features\RolesAndPermissions\RoleController;
use App\Http\Controllers\Features\FileManagement\ImageUploadController;
use App\Http\Controllers\Features\FileManagement\LinkReuploadController;
use App\Http\Controllers\Features\FileManagement\FileManagementController;
use App\Http\Controllers\Features\RolesAndPermissions\PermissionController;

// Route API
Route::prefix('v1')->middleware([StartSession::class])->group(function () {
    // Fitur otentikasi
    Route::middleware('guest')->group(function () {
        Route::post('register', [RegisteredUserController::class, 'store']);
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
        Route::post('forgot-password', [PasswordResetLinkController::class, 'store']);
        Route::post('reset-password', [NewPasswordController::class, 'store']);

        // Rate Limiting: Batasi unggahan file hanya untuk pengguna publik
        RateLimiter::for('upload-image', function (Request $request) {
            return $request->user()
            ? \Illuminate\Cache\RateLimiting\Limit::none()
            : \Illuminate\Cache\RateLimiting\Limit::perDay(3)->by($request->ip());
        });

        // Rate Limiting: Batasi unggahan link hanya untuk pengguna publik
        RateLimiter::for('link-upload', function (Request $request) {
            return $request->user()
            ? \Illuminate\Cache\RateLimiting\Limit::none()
            : \Illuminate\Cache\RateLimiting\Limit::perDay(3)->by($request->ip());
        });

        Route::get('/', function () {
            return view('welcome');
        });

        // Rute features belum login
        Route::get('/features/not-login', function () {
            return view('features.not_login.landing');
        })->name('features.not_login.landing');

        // Rute Upload Image 
        Route::post('/file/upload/image', [ImageUploadController::class, 'upload'])
        ->middleware('throttle:upload-image')
        ->name('file.upload.image');

        // Rute Reupload Link
        Route::post('/file/link-upload', [LinkReuploadController::class, 'createLink'])
        ->middleware(['throttle:link-upload'])
        ->name('file.link.create');
    });

    Route::middleware('auth:sanctum')->group(function () {
        // Mengambil informasi user
        Route::get('user', function (Request $request) {
            return $request->user();
        });

        // Verifikasi email
        Route::get('email/verify', [EmailVerificationPromptController::class, '__invoke'])
            ->name('api.verification.notice');

        Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1'])
            ->name('api.verification.verify');

        Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('api.verification.send');

        // Konfirmasi Password
        Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
            ->name('password.confirm');
        Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

        // Update Password
        Route::put('password', [PasswordController::class, 'update'])->name('password.update');

        // Logout
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');

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

        // Features
        Route::get('/features/', function () {
            return view('features.landing');
        })->middleware('throttle:features.limiter')
        ->name('features.landing');

        // Upload Image URL (POST untuk mengupload link gambar)
        Route::post('file/link-upload', [LinkReuploadController::class, 'createLink'])
            ->middleware('throttle:link-upload')
            ->name('file.link.upload');
    });
});