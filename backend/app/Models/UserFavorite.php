<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFavorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'generated_schedule_id',
        'user_notes'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function generatedSchedule()
    {
        return $this->belongsTo(GeneratedSchedule::class);
    }
}

