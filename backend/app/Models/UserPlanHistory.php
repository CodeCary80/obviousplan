<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPlanHistory extends Model
{
    use HasFactory;

    protected $table = 'user_plan_history';

    protected $fillable = [
        'user_id',
        'generated_schedule_id',
        'user_rating',
        'user_comment',
        'was_completed',
        'completed_at'
    ];

    protected $casts = [
        'user_rating' => 'integer',
        'was_completed' => 'boolean',
        'completed_at' => 'datetime',
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

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('was_completed', true);
    }

    public function scopeRated($query)
    {
        return $query->whereNotNull('user_rating');
    }
}
