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
        // Registrasi
        Route::get('register', [RegisteredUserController::class, 'create'])
            ->name('register');
        Route::post('register', [RegisteredUserController::class, 'store']);

        // Login
        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        // Lupa Password
        Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
            ->name('password.request');
        Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
            ->name('password.email');

        // Reset Password
        Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
            ->name('password.reset');
        Route::post('reset-password', [NewPasswordController::class, 'store'])
            ->name('password.store');

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

        // Rute Profile
        Route::get('/profile', [ProfileController::class, 'edit'])->name('api.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('api.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');

        // Rute Permissions
        Route::get('/permissions', [PermissionController::class, 'index'])->name('api.permissions.index');
        Route::get('/permissions/create', [PermissionController::class, 'create'])->name('api.permissions.create');
        Route::post('/permissions', [PermissionController::class, 'store'])->name('api.permissions.store');
        Route::get('/permissions/{id}/edit', [PermissionController::class, 'edit'])->name('api.permissions.edit');
        Route::put('/permissions/{id}', [PermissionController::class, 'update'])->name('api.permissions.update');
        Route::delete('/permissions/{id}', [PermissionController::class, 'destroy'])->name('api.permissions.destroy');

        // Rute Roles
        Route::get('/roles', [RoleController::class, 'index'])->name('api.roles.index');
        Route::get('/roles/create', [RoleController::class, 'create'])->name('api.roles.create');
        Route::post('/roles', [RoleController::class, 'store'])->name('api.roles.store');
        Route::get('/roles/{id}/edit', [RoleController::class, 'edit'])->name('api.roles.edit');
        Route::put('/roles/{id}', [RoleController::class, 'update'])->name('api.roles.update');
        Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->name('api.roles.destroy');

        // Rute Articles
        Route::get('/articles', [ArticleController::class, 'index'])->name('api.articles.index');
        Route::get('/articles/create', [ArticleController::class, 'create'])->name('api.articles.create');
        Route::post('/articles', [ArticleController::class, 'store'])->name('api.articles.store');
        Route::get('/articles/{id}/edit', [ArticleController::class, 'edit'])->name('api.articles.edit');
        Route::put('/articles/{id}', [ArticleController::class, 'update'])->name('api.articles.update');
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy'])->name('api.articles.destroy');

        // Rute Users
        Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('api.users.create');
        Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('api.users.edit');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('api.users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');

        // Management File
        Route::get('/management_files', [FileManagementController::class, 'index'])->name('api.management_files.index');
        Route::get('/management_files/{id}', [FileManagementController::class, 'show'])->name('api.management_files.show');
        Route::post('/management_files', [FileManagementController::class, 'store'])->name('api.management_files.store');
        Route::put('/management_files/{id}', [FileManagementController::class, 'update'])->name('api.management_files.update');
        Route::delete('/management_files/{id}', [FileManagementController::class, 'destroy'])->name('api.management_files.destroy');

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
