<?php

namespace App\Services;

class ProximityService
{
    /**
     * Get Google Maps directions URL
     */
    public static function getDirectionsUrl(?string $fromAddress, string $toAddress): string
    {
        $baseUrl = 'https://www.google.com/maps/dir/';
        
        if ($fromAddress) {
            return $baseUrl . urlencode($fromAddress) . '/' . urlencode($toAddress);
        }
        
        return 'https://www.google.com/maps/search/' . urlencode($toAddress);
    }

    /**
     * Get Google Maps directions URL from coordinates
     */
    public static function getDirectionsUrlFromCoords(?float $fromLat, ?float $fromLng, float $toLat, float $toLng): string
    {
        $baseUrl = 'https://www.google.com/maps/dir/';
        
        if ($fromLat && $fromLng) {
            return $baseUrl . $fromLat . ',' . $fromLng . '/' . $toLat . ',' . $toLng;
        }
        
        return 'https://www.google.com/maps/search/' . $toLat . ',' . $toLng;
    }

    /**
     * Validate coordinates
     */
    public static function validateCoordinates(?float $lat, ?float $lng): bool
    {
        if (is_null($lat) || is_null($lng)) {
            return false;
        }

        return $lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180;
    }
}

