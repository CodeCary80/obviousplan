<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $activities = [
            [
                'activity_title' => 'Go Bowling',
                'activity_type' => 'Bowling',
                'venue_name' => 'The Ballroom Bowl',
                'description' => 'Vintage bowling alley with a retro atmosphere, full bar and restaurant.',
                'address' => '1 Dupont St, Toronto, ON M5R 1V3',
                'latitude' => 43.6747,
                'longitude' => -79.4040,
                'budget_tag' => '$',
                'budget_display_text' => '$25-40',
                'energy_tag' => 'Medium',
                'people_tag' => 'Small Group',
                'people_display_text' => '2-6 people',
                'estimated_duration_minutes' => 120,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None - shoes provided',
                'website_url' => 'https://theballroom.ca',
                'booking_url' => 'https://theballroom.ca/reservations',
            ],
            [
                'activity_title' => 'Watch a Movie',
                'activity_type' => 'Movie',
                'venue_name' => 'TIFF Bell Lightbox',
                'description' => 'Premium cinema experience with latest blockbusters and indie films.',
                'address' => '350 King St W, Toronto, ON M5V 3X5',
                'latitude' => 43.6467,
                'longitude' => -79.3917,
                'budget_tag' => '$', 
                'budget_display_text' => '$12-18',
                'energy_tag' => 'Low',
                'people_tag' => 'Date', // Or 'Solo', 'Small Group'
                'people_display_text' => 'Perfect for: Date Night',
                'estimated_duration_minutes' => 150,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None',
                'website_url' => 'https://tiff.net/lightbox',
                'booking_url' => 'https://tiff.net/tickets',
            ],
            [
                'activity_title' => 'Escape Room Challenge',
                'activity_type' => 'Escape Room',
                'venue_name' => 'Casa Loma Escape Series',
                'description' => 'Immersive escape room experiences in a castle setting.',
                'address' => '1 Austin Terrace, Toronto, ON M5R 1X8',
                'latitude' => 43.6780,
                'longitude' => -79.4094,
                'budget_tag' => '$$', 
                'budget_display_text' => '$35-50',
                'energy_tag' => 'High',
                'people_tag' => 'Small Group',
                'people_display_text' => '2-8 people',
                'estimated_duration_minutes' => 90,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None',
                'website_url' => 'https://casaloma.ca/escape-series',
                'booking_url' => 'https://casaloma.ca/escape-series/book',
            ],
            [
                'activity_title' => 'Art Gallery Visit',
                'activity_type' => 'Art',
                'venue_name' => 'Art Gallery of Ontario',
                'description' => 'World-class art collection featuring Canadian and international works.',
                'address' => '317 Dundas St W, Toronto, ON M5T 1G4',
                'latitude' => 43.6536,
                'longitude' => -79.3925,
                'budget_tag' => '$$', 
                'budget_display_text' => '$15-25', 
                'energy_tag' => 'Low',
                'people_tag' => 'Solo', // Or 'Couples', 'Small Group'
                'people_display_text' => 'Great for: Solo or Couples',
                'estimated_duration_minutes' => 120,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None',
                'website_url' => 'https://ago.ca',
                'booking_url' => 'https://ago.ca/tickets',
            ],
            [
                'activity_title' => 'Comedy Show',
                'activity_type' => 'Comedy',
                'venue_name' => 'Second City Toronto',
                'description' => 'Live improv and sketch comedy performances.',
                'address' => '51 Mercer St, Toronto, ON M5V 1H2', 
                'latitude' => 43.6447, 
                'longitude' => -79.3932, 
                'budget_tag' => '$',
                'budget_display_text' => '$20-35',
                'energy_tag' => 'Medium',
                'people_tag' => 'Small Group',
                'people_display_text' => 'Fun for: Friends',
                'estimated_duration_minutes' => 90,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None',
                'website_url' => 'https://secondcity.com/toronto',
                'booking_url' => 'https://secondcity.com/toronto/shows',
            ],
            [
                'activity_title' => 'Waterfront Walk',
                'activity_type' => 'Walking',
                'venue_name' => 'Harbourfront Centre',
                'description' => 'Scenic walk along Toronto\'s waterfront with city skyline views.',
                'address' => '235 Queens Quay W, Toronto, ON M5J 2G8',
                'latitude' => 43.6386,
                'longitude' => -79.3816,
                'budget_tag' => '$', 
                'budget_display_text' => 'Free',
                'energy_tag' => 'Low',
                'people_tag' => 'Date', 
                'people_display_text' => 'Romantic for: Couples',
                'estimated_duration_minutes' => 60,
                'indoor_outdoor_status' => 'Outdoor',
                'required_materials' => 'Comfortable walking shoes',
                'website_url' => 'https://harbourfrontcentre.com',
            ],
            [
                'activity_title' => 'Karaoke Night',
                'activity_type' => 'Karaoke',
                'venue_name' => 'Echo Karaoke & Lounge',
                'description' => 'Private karaoke rooms with extensive song selection.',
                'address' => '693 Bloor Street W Toronto, ON M6G 1L5',
                'latitude' => 43.6627,
                'longitude' => -79.4397,
                'budget_tag' => '$$', 
                'budget_display_text' => '$30-50', 
                'energy_tag' => 'High',
                'people_tag' => 'Small Group',
                'people_display_text' => 'Perfect for: Groups',
                'estimated_duration_minutes' => 120,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None',
                'website_url' => 'https://www.echokaraoke.ca/', 
                'booking_url' => 'https://www.echokaraoke.ca/booking', 
            ],
            [
                'activity_title' => 'Broadway Tour',
                'activity_type' => 'Music',
                'venue_name' => 'Princess of Wales Theatre',
                'description' => 'Intimate venue featuring local and touring artists.',
                'address' => '300 King St W, Toronto, ON M5V 1J2',
                'latitude' => 43.6426,
                'longitude' => -79.3876,
                'budget_tag' => '$$$',
                'budget_display_text' => '$60-80', 
                'energy_tag' => 'High',
                'people_tag' => 'Small Group', 
                'people_display_text' => 'Great for: Musical Lovers',
                'estimated_duration_minutes' => 180,
                'indoor_outdoor_status' => 'Indoor',
                'required_materials' => 'None',
                'website_url' => 'https://www.mirvish.com/visit/theatres/princess-of-wales-theatre',
                'booking_url' => 'https://tickets.mirvish.com/events?_gl=1*1x9v9jc*_gcl_au*MTE0NzU1NTc1LjE3NDg5ODE2OTY.#_ga=2.264546572.2046077280.1748981697-442720194.1748981696',
            ],
        ];

        foreach ($activities as $activityData) {
            // Check if all required fields for Activity model are present
            // This is a basic check, your Activity model might have specific fillable attributes
            if (isset($activityData['activity_title'], $activityData['activity_type'])) {
                Activity::create($activityData);
            } else {
                // Optionally log an error or skip this entry
                // echo "Skipping entry due to missing required fields: " . print_r($activityData, true);
            }
        }
    }
}