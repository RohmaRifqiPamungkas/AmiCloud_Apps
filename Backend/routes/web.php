<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Features\ImageUploadController;
use App\Http\Controllers\Features\LinkReuploadController;
use App\Http\Middleware\HandleRateLimit;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

// Rate Limiting: Batasi unggahan file hanya untuk pengguna publik
RateLimiter::for('upload-image', function (Request $request) {
    return $request->user()
        ? \Illuminate\Cache\RateLimiting\Limit::none() // Tanpa batas untuk pengguna login
        : \Illuminate\Cache\RateLimiting\Limit::perDay(3)->by($request->ip()); // Maksimal 3 unggahan/hari berdasarkan IP
});

Route::get('/', function () {
    return view('welcome');
});

// Rute untuk pengguna belum login (tanpa autentikasi)
Route::get('/features/not-login', function () {
    return view('features.not_login.landing');
})->name('features.not_login.landing');

// Rute untuk mengunggah gambar
Route::post(
    '/file/upload/image',
    [ImageUploadController::class, 'upload']
)
    ->middleware('throttle:upload-image') 
    ->name('file.upload.image');

// Rute dashboard dengan autentikasi
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rute yang membutuhkan autentikasi
Route::middleware('auth')->group(function () {
    // Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Permissions
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::get('/permissions/create', [PermissionController::class, 'create'])->name('permissions.create');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::get('/permissions/{id}/edit', [PermissionController::class, 'edit'])->name('permissions.edit');
    Route::put('/permissions/{id}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{id}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

    // Rute Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{id}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{id}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');

    // Rute Articles
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::get('/articles/{id}/edit', [ArticleController::class, 'edit'])->name('articles.edit');
    Route::put('/articles/{id}', [ArticleController::class, 'update'])->name('articles.update');
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy'])->name('articles.destroy');

    // Rute Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/features/', function () {
        return view('features.landing');
    })->middleware('throttle:features.limiter') // Rate limiter global untuk fitur
        ->name('features.landing');

    // Rute untuk file reupload/link upload
    Route::post('/file/reupload/link/{fileLink}', [LinkReuploadController::class, 'reupload'])->name('file.reupload.link');
    Route::post('/file/link-upload', [LinkReuploadController::class, 'createLink'])->name('file.link.create');
});

require __DIR__ . '/auth.php';