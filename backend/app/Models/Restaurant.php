<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'cuisine_type',
        'description_snippet',
        'budget_tag',
        'budget_display_text',
        'energy_tag',
        'people_tag',
        'people_display_text',
        'ambiance_tags',
        'website_url',
        'booking_url',
        'phone_number',
        'curated_image_url',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function generatedSchedules()
    {
        return $this->hasMany(GeneratedSchedule::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByBudget($query, $budget)
    {
        return $query->where('budget_tag', $budget);
    }

    public function scopeByEnergy($query, $energy)
    {
        return $query->where('energy_tag', $energy);
    }

    // Note: Your 'restaurants' migration uses 'people_tag', but your diagram uses 'partcipant_tag'
    // I am following your migration file here.
    public function scopeByPeople($query, $people)
    {
        return $query->where('people_tag', $people);
    }

    // Helper methods
    public function hasLocation()
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }
}