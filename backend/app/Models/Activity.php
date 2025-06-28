<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_title',
        'activity_type',
        'venue_name',
        'description',
        'address',
        'latitude',
        'longitude',
        'budget_tag',
        'budget_display_text',
        'energy_tag',
        'people_tag',
        'people_display_text',
        'estimated_duration_minutes',
        'indoor_outdoor_status',
        'required_materials',
        'website_url',
        'booking_url',
        'curated_image_url',
        'is_active'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'estimated_duration_minutes' => 'integer',
        'is_active' => 'boolean',
    ];

    public function generatedSchedules()
    {
        return $this->hasMany(GeneratedSchedule::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('activity_type', $type);
    }

    public function scopeByBudget($query, $budget)
    {
        return $query->where('budget_tag', $budget);
    }

    public function scopeByEnergy($query, $energy)
    {
        return $query->where('energy_tag', $energy);
    }

    public function scopeByPeople($query, $people)
    {
        return $query->where('people_tag', $people);
    }

    public function scopeIndoor($query)
    {
        return $query->whereIn('indoor_outdoor_status', ['Indoor', 'Both']);
    }

    public function scopeOutdoor($query)
    {
        return $query->whereIn('indoor_outdoor_status', ['Outdoor', 'Both']);
    }

    public function hasLocation()
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }

    public function getDurationInHours()
    {
        return round($this->estimated_duration_minutes / 60, 1);
    }
}