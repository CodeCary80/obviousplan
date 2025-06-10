<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Restaurant;

class RestaurantSeeder extends Seeder
{
    public function run()
    {
        $restaurants = [
            [
                'name' => 'Osmow\'s Shawarma',
                'address' => '277 Victoria St, Toronto, ON M5B 1W2',
                'latitude' => 43.6569,
                'longitude' => -79.3805,
                'cuisine_type' => 'Middle Eastern',
                'description_snippet' => 'Fresh Mediterranean and Middle Eastern cuisine',
                'budget_tag' => '$',
                'budget_display_text' => '$10-20',
                'energy_tag' => 'Medium',
                'people_tag' => 'Small Group',
                'people_display_text' => 'Good for: Groups',
                'ambiance_tags' => 'Casual,Quick Service,Healthy',
                'website_url' => 'https://osmows.com',
                'phone_number' => '(416) 368-4299',
            ],
            [
                'name' => 'Canoe Restaurant',
                'address' => '66 Wellington St W, Toronto, ON M5K 1H6',
                'latitude' => 43.6481,
                'longitude' => -79.3808,
                'cuisine_type' => 'Contemporary Canadian',
                'description_snippet' => 'Fine dining with panoramic city views',
                'budget_tag' => '$$',
                'budget_display_text' => '$80-120',
                'energy_tag' => 'High',
                'people_tag' => 'Date',
                'people_display_text' => 'Perfect for: Special Occasions',
                'ambiance_tags' => 'Fine Dining,City Views,Romantic',
                'website_url' => 'https://oliverbonacini.com/canoe',
                'phone_number' => '(416) 364-0054',
            ],
            [
                'name' => 'St. Lawrence Market',
                'address' => '93 Front St E, Toronto, ON M5E 1C3',
                'latitude' => 43.6487,
                'longitude' => -79.3716,
                'cuisine_type' => 'Food Market',
                'description_snippet' => 'Historic market with diverse food vendors',
                'budget_tag' => '$',
                'budget_display_text' => '$10-30',
                'energy_tag' => 'Low',
                'people_tag' => 'Large Group',
                'people_display_text' => 'Fun for: Groups & Families',
                'ambiance_tags' => 'Lively,Casual,Historic',
                'website_url' => 'https://www.stlawrencemarket.com',
                'phone_number' => '(416) 392-7219',
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::create($restaurant);
        }
    }
}
