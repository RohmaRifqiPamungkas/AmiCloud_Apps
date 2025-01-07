<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileUpload extends Model
{
    protected $fillable = [
        'user_id',
        'filename',
        'file_path',
        'file_size',
        'upload_type',
    ];
}