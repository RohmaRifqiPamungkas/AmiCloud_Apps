<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileLink extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'file_path', 'original_url', 'parsed_url'];

    public function getUrlImageAttribute()
    {
        return url($this->file_path);
    }
}
