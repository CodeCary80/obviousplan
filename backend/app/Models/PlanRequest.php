<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'energy_level',
        'budget_preference',
        'company_type',
        'user_latitude',
        'user_longitude',
        'location_shared',
        'session_id'
    ];

    protected $casts = [
        'user_latitude' => 'decimal:8',
        'user_longitude' => 'decimal:8',
        'location_shared' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function generatedSchedules()
    {
        return $this->hasMany(GeneratedSchedule::class);
    }

    // Helper methods
    public function hasLocation()
    {
        return $this->location_shared && 
               !is_null($this->user_latitude) && 
               !is_null($this->user_longitude);
    }
}