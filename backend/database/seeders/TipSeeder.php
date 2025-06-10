<?php

// database/seeders/TipSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tip;

class TipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tips = [
            [
                'tip_text' => 'Consider grabbing a coffee nearby before your activity to fuel up!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Perfect evening for a leisurely stroll between your dinner and activity.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Don\'t forget to check the venue\'s parking options beforehand.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => true,
            ],
            [
                'tip_text' => 'Movie theaters can get cold - bring a light jacket!',
                'applies_to_activity_type' => 'Movie',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Bowling shoes are provided, but you might want to bring your own socks.',
                'applies_to_activity_type' => 'Bowling',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Check the weather forecast if you\'re planning outdoor activities.',
                'applies_to_activity_type' => 'Walking', // Applies to outdoor activities like Walking
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Many restaurants offer happy hour specials - check their timing!',
                'applies_to_activity_type' => 'Dining', // Or null if it's generic for restaurants
                'applies_to_budget_tag' => '$$',       // Corrected from phone number to a budget tag
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'For upscale dining, consider making a reservation well in advance.',
                'applies_to_activity_type' => 'Dining', // Or null
                'applies_to_budget_tag' => '$$$$',       // Applies to higher budget tags
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Stay hydrated throughout your evening adventure!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => true,
            ],
            [
                'tip_text' => 'Escape rooms work best when everyone communicates and participates - get ready to collaborate!',
                'applies_to_activity_type' => 'Escape Room',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Comedy shows are often more fun when you sit closer to the stage.',
                'applies_to_activity_type' => 'Comedy',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Art galleries often have free or pay-what-you-can admission on certain evenings. Check their website!',
                'applies_to_activity_type' => 'Art',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
        ];

        foreach ($tips as $tip) {
            Tip::create($tip);
        }
    }
}