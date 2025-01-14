<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'upload_count')) {
                $table->integer('upload_count')->default(0);
            }

            if (!Schema::hasColumn('users', 'image_profile')) {
                $table->string('image_profile')->nullable()->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'image_profile')) {
                $table->dropColumn('image_profile');
            }

            if (Schema::hasColumn('users', 'upload_count')) {
                $table->dropColumn('upload_count');
            }
        });
    }
};