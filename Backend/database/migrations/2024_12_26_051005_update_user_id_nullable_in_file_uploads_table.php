<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('file_uploads', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change(); // Mengubah kolom 'user_id' menjadi nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('file_uploads', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change(); // Menjadikan 'user_id' tidak nullable kembali
        });
    }
};