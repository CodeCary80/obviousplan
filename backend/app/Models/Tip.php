<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tip extends Model
{
    use HasFactory;

    protected $fillable = [
        'tip_text',
        'applies_to_activity_type',
        'applies_to_budget_tag',
        'applies_to_energy_tag',
        'is_generic',
        'is_active'
    ];

    protected $casts = [
        'is_generic' => 'boolean',
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

    public function scopeGeneric($query)
    {
        return $query->where('is_generic', true);
    }

    public function scopeForActivity($query, $activityType)
    {
        return $query->where('applies_to_activity_type', $activityType)
                    ->orWhere('is_generic', true);
    }

    public function scopeForBudget($query, $budget)
    {
        return $query->where('applies_to_budget_tag', $budget)
                    ->orWhere('is_generic', true);
    }

    public function scopeForEnergy($query, $energy)
    {
        return $query->where('applies_to_energy_tag', $energy)
                    ->orWhere('is_generic', true);
    }
}
