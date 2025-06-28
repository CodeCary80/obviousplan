<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Models\Activity;
use App\Models\Tip;
use App\Models\PlanRequest;
use App\Models\GeneratedSchedule;
use Illuminate\Support\Collection;

class PlanGenerationService
{
    /**
     * Generate a complete evening schedule
     */
    public function generateSchedule(PlanRequest $planRequest): GeneratedSchedule
    {
        // Find matching restaurant
        $restaurant = $this->findRestaurant($planRequest);
        
        // Find matching activity
        $activity = $this->findActivity($planRequest);
        
        // Find relevant tip
        $tip = $this->findTip($planRequest, $activity);
        
        // Calculate total estimated budget
        $totalBudget = $this->calculateTotalBudget($restaurant, $activity);
        
        // Create and return the generated schedule
        return GeneratedSchedule::create([
            'plan_request_id' => $planRequest->id,
            'restaurant_id' => $restaurant->id,
            'activity_id' => $activity->id,
            'tip_id' => $tip->id,
            'total_estimated_budget' => $totalBudget,
        ]);
    }

    /**
     * Find a suitable restaurant based on plan request
     */
    protected function findRestaurant(PlanRequest $planRequest): Restaurant
    {
        $query = Restaurant::active()
            ->byBudget($planRequest->budget_preference)
            ->byEnergy($planRequest->energy_level)
            ->byPeople($planRequest->company_type);
    
        // If location is provided, prioritize nearby restaurants
        if ($planRequest->hasLocation()) {
            \Log::info('Location-based restaurant search', [
                'user_lat' => $planRequest->user_latitude,
                'user_lng' => $planRequest->user_longitude
            ]);
    
            // First try: Get restaurants within 15km
            $nearbyRestaurants = $this->filterByProximity(
                $query->whereNotNull('latitude')->whereNotNull('longitude')->get(),
                $planRequest->user_latitude,
                $planRequest->user_longitude,
                15
            );
    
            if ($nearbyRestaurants->isNotEmpty()) {
                $topChoices = $nearbyRestaurants->take(3); // Top 3 closest
                return $topChoices->random();
            }
    
            // Second try: Expand to 30km
            $expandedSearch = $this->filterByProximity(
                $query->whereNotNull('latitude')->whereNotNull('longitude')->get(),
                $planRequest->user_latitude,
                $planRequest->user_longitude,
                30
            );
    
            if ($expandedSearch->isNotEmpty()) {
                return $expandedSearch->random();
            }
        }
    
        // Fallback to any matching restaurant
        $restaurant = $query->inRandomOrder()->first();
        
        if (!$restaurant) {
            throw new \Exception('No suitable restaurant found matching your preferences');
        }
    
        return $restaurant;
    }

    /**
     * Find alternative restaurant (for shuffling)
     */
    public function findAlternativeRestaurant(PlanRequest $planRequest, int $excludeId): ?Restaurant
    {
        $query = Restaurant::active()
            ->byBudget($planRequest->budget_preference)
            ->byEnergy($planRequest->energy_level)
            ->byPeople($planRequest->company_type)
            ->where('id', '!=', $excludeId);

        if ($planRequest->hasLocation()) {
            $restaurants = $this->filterByProximity(
                $query->get(),
                $planRequest->user_latitude,
                $planRequest->user_longitude,
                10
            );
            
            if ($restaurants->isNotEmpty()) {
                return $restaurants->random();
            }
        }

        return $query->inRandomOrder()->first();
    }

    /**
     * Find a suitable activity based on plan request
     */
    protected function findActivity(PlanRequest $planRequest): Activity
    {
        $query = Activity::active()
            ->byBudget($planRequest->budget_preference)
            ->byEnergy($planRequest->energy_level)
            ->byPeople($planRequest->company_type);
    
        // If location is provided, prioritize nearby activities
        if ($planRequest->hasLocation()) {
            \Log::info('Location-based activity search', [
                'user_lat' => $planRequest->user_latitude,
                'user_lng' => $planRequest->user_longitude
            ]);
    
            // First try: Get activities within 20km
            $nearbyActivities = $this->filterByProximity(
                $query->whereNotNull('latitude')->whereNotNull('longitude')->get(),
                $planRequest->user_latitude,
                $planRequest->user_longitude,
                20
            );
    
            if ($nearbyActivities->isNotEmpty()) {
                $topChoices = $nearbyActivities->take(3); // Top 3 closest
                return $topChoices->random();
            }
    
            // Second try: Expand to 40km
            $expandedSearch = $this->filterByProximity(
                $query->whereNotNull('latitude')->whereNotNull('longitude')->get(),
                $planRequest->user_latitude,
                $planRequest->user_longitude,
                40
            );
    
            if ($expandedSearch->isNotEmpty()) {
                return $expandedSearch->random();
            }
        }
    
        // Fallback to any matching activity
        $activity = $query->inRandomOrder()->first();
        
        if (!$activity) {
            throw new \Exception('No suitable activity found matching your preferences');
        }
    
        return $activity;
    }

    /**
     * Find alternative activity (for shuffling)
     */
    public function findAlternativeActivity(PlanRequest $planRequest, int $excludeId): ?Activity
    {
        $query = Activity::active()
            ->byBudget($planRequest->budget_preference)
            ->byEnergy($planRequest->energy_level)
            ->byPeople($planRequest->company_type)
            ->where('id', '!=', $excludeId);

        if ($planRequest->hasLocation()) {
            $activities = $this->filterByProximity(
                $query->whereNotNull('latitude')->whereNotNull('longitude')->get(),
                $planRequest->user_latitude,
                $planRequest->user_longitude,
                15
            );
            
            if ($activities->isNotEmpty()) {
                return $activities->random();
            }
        }

        return $query->inRandomOrder()->first();
    }

    /**
     * Find a relevant tip
     */
    protected function findTip(PlanRequest $planRequest, Activity $activity): Tip
    {
        // Try to find activity-specific tip first
        $tip = Tip::active()
            ->forActivity($activity->activity_type)
            ->forBudget($planRequest->budget_preference)
            ->forEnergy($planRequest->energy_level)
            ->where('is_generic', false)
            ->inRandomOrder()
            ->first();

        // If no specific tip found, get a generic one
        if (!$tip) {
            $tip = Tip::active()
                ->generic()
                ->inRandomOrder()
                ->first();
        }

        if (!$tip) {
            throw new \Exception('No tips available');
        }

        return $tip;
    }

    /**
     * Calculate total estimated budget - FIXED VERSION
     */
    protected function calculateTotalBudget(Restaurant $restaurant, Activity $activity): float
    {
        $restaurantBudget = $this->parseBudgetFromDisplayText($restaurant->budget_display_text);
        $activityBudget = $this->parseBudgetFromDisplayText($activity->budget_display_text);
        
        return $restaurantBudget + $activityBudget;
    }

    /**
     * Parse budget from display text (e.g., "$150-250" -> 200)
     * This is more accurate than using generic budget tag midpoints
     */
    protected function parseBudgetFromDisplayText(string $budgetDisplayText): float
    {
       
        $text = strtolower($budgetDisplayText);
        
      
        if (strpos($text, 'free') !== false) {
            return 0;
        }
        
        // Extract all numbers from the string
        preg_match_all('/[\d,]+/', $text, $matches);
        
        if (empty($matches[0])) {
            return $this->budgetTagToMidpoint('$$'); 
        }
        
        $numbers = array_map(function($num) {
            return (float) str_replace(',', '', $num);
        }, $matches[0]);
        
        if (count($numbers) >= 2) {
            return ($numbers[0] + $numbers[1]) / 2;
        } elseif (count($numbers) == 1) {
            return $numbers[0];
        }
        
        // Final fallback
        return 50;
    }

    /**
     * Convert budget tag to estimated midpoint value (UPDATED VALUES)
     * This is now a fallback when display text parsing fails
     */
    protected function budgetTagToMidpoint(string $budgetTag): float
    {
        return match($budgetTag) {
            '$' => 15,        // $0-30
            '$$' => 45,       // $30-60  
            '$$$' => 85,      // $60-110
            '$$$$' => 150,    // $110-200
            '$$$$$' => 400,   // $200+
            default => 50,
        };
    }

    /**
     * Filter locations by proximity using Haversine formula
     */
    protected function filterByProximity(Collection $locations, float $userLat, float $userLng, float $radiusKm): Collection
    {
        return $locations->filter(function ($location) use ($userLat, $userLng, $radiusKm) {
            if (!$location->hasLocation()) {
                return false;
            }
    
            $distance = $this->calculateDistance(
                $userLat, 
                $userLng, 
                $location->latitude, 
                $location->longitude
            );
    
            return $distance <= $radiusKm;
        })->map(function ($location) use ($userLat, $userLng) {
            $location->distance = $this->calculateDistance(
                $userLat, 
                $userLng, 
                $location->latitude, 
                $location->longitude
            );
            return $location;
        })->sortBy('distance'); 
    }

    /**
     * Calculate distance between two points using Haversine formula
     */
    protected function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371; 

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}