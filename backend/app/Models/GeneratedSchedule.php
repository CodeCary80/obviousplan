<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GeneratedSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_request_id',
        'restaurant_id',
        'activity_id',
        'tip_id',
        'total_estimated_budget',
        'schedule_hash',
        'was_viewed',
        'was_confirmed'
    ];

    protected $casts = [
        'total_estimated_budget' => 'decimal:2',
        'was_viewed' => 'boolean',
        'was_confirmed' => 'boolean',
    ];

    // Relationships
    public function planRequest()
    {
        return $this->belongsTo(PlanRequest::class);
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function tip()
    {
        return $this->belongsTo(Tip::class);
    }
    public function userPlanHistories()
    {
        return $this->hasMany(UserPlanHistory::class);
    }

    public function userPlanHistory()
    {
        return $this->hasOne(UserPlanHistory::class);
    }

    public function userFavorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    // Boot method to generate hash
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($schedule) {
            if (empty($schedule->schedule_hash)) {
                $schedule->schedule_hash = Str::random(32);
            }
        });
    }

    // Helper methods
    public function getUser()
    {
        return $this->planRequest->user;
    }

    public function isFavoritedBy($userId)
    {
        return $this->userFavorites()->where('user_id', $userId)->exists();
    }
}