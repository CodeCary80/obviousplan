<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tip;

class TipSeeder extends Seeder
{
    public function run()
    {
        $tips = [
            // ENERGY-BASED TIPS (Generic)
            [
                'tip_text' => 'Perfect evening for a leisurely stroll between your dinner and activity.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Consider grabbing a coffee nearby before your activity to fuel up!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Take your time and enjoy the moderate pace of your evening.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],

            // BUDGET-BASED TIPS (Generic for budget tags)
            [
                'tip_text' => 'Many places offer student discounts - don\'t forget to ask and bring your ID!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Look for happy hour specials to get more value for your money!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Consider making a reservation to ensure the best experience, especially on weekends.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Dress code may apply for some venues - check their website beforehand.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'For upscale dining/activities, consider making a reservation well in advance, especially for peak times.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Prepare for a truly exclusive experience; these high-tier options often come with personalized service.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],

            // ACTIVITY-SPECIFIC TIPS
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
            [
                'tip_text' => 'Check the weather forecast and dress accordingly if you\'re planning outdoor activities.',
                'applies_to_activity_type' => 'Walking',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Don\'t forget your comfortable shoes for exploring markets and walking tours!',
                'applies_to_activity_type' => 'Walking',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'Low', // Added to specific combo for walking
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Board game cafes can get busy; consider going during off-peak hours for a quieter experience.',
                'applies_to_activity_type' => 'Games',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'For sports games, arrive early to soak in the pre-game atmosphere and find your seats.',
                'applies_to_activity_type' => 'Sports',
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Check the menu beforehand if you have dietary restrictions; many restaurants are accommodating.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => true, // Generic for any restaurant
            ],
            [
                'tip_text' => 'Some events might require booking in advance, especially during peak seasons. Plan ahead!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => true, // Generic for any activity
            ],
            [
                'tip_text' => 'Verify operating hours and any special requirements (e.g., ID, age restrictions) before you go.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => null,
                'applies_to_energy_tag' => null,
                'is_generic' => true, // Generic for any activity/restaurant
            ],

            // FILLING ALL COMBINATIONS - TIPS
            // Low Energy, Solo
            [
                'tip_text' => 'Enjoy the quiet solitude; perfect for reflection and personal enjoyment.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Treat yourself to a relaxing solo escape; pampering is always a good idea.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Indulge in a personal luxury; this solo experience will be unforgettable.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This is an opportunity for ultimate solo indulgence and relaxation.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Experience unparalleled exclusivity tailored just for you.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],

            // Low Energy, Date
            [
                'tip_text' => 'A relaxed and intimate setting for meaningful conversations.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Enjoy a cozy and romantic atmosphere perfect for a quiet date night.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This budget allows for a lovely, relaxed date with a touch of elegance.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A luxurious and romantic experience awaits; perfect for a special anniversary.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This is the ultimate romantic gesture for an unforgettable evening.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],

            // Low Energy, Small Group
            [
                'tip_text' => 'Keep it low-key and casual for your small group; perfect for bonding without pressure.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A comfortable setting for your small group to relax and enjoy each other\'s company.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Ideal for a cozy gathering with close friends; enjoy the finer things together.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Spoil your small group with a premium, relaxed experience that everyone will appreciate.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'An exclusive and luxurious experience for your inner circle.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],

            // Low Energy, Large Group
            [
                'tip_text' => 'Opt for places with ample seating and easy flow for large, relaxed groups.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Finding a balance between cost and comfort for your large group is key here.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A relaxed setting that can comfortably accommodate your larger group for a pleasant time.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Consider booking a private room or dedicated space for your large group to enjoy luxury in comfort.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'For the most grand affairs, a truly lavish experience for your entire group.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Low',
                'is_generic' => false,
            ],

            // Medium Energy, Solo
            [
                'tip_text' => 'Perfect for a solo adventure that keeps you engaged but not exhausted.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A balanced solo outing, offering good value and a moderate level of activity.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A solo treat that offers a lively, yet comfortable, experience.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Indulge in a premium solo experience that offers engagement and comfort.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'An opulent individual experience that combines activity with luxury.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],

            // Medium Energy, Date
            [
                'tip_text' => 'A fun and interactive date idea that won\'t break the bank.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This budget provides a fantastic balance for an engaging and enjoyable date.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A lively and memorable date experience within a comfortable budget.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Elevate your date night with a premium experience that offers engagement and sophistication.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Create truly unforgettable memories with this high-end, engaging date experience.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],

            // Medium Energy, Small Group
            [
                'tip_text' => 'Great for an active and affordable outing with your small group.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Enjoy a fun and interactive experience with your small group at a reasonable price.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This budget allows for a dynamic group experience that offers good value and fun.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A fantastic option for a memorable small group outing, combining activity with luxury.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'For a truly exceptional small group experience, this option offers unparalleled quality and excitement.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],

            // Medium Energy, Large Group
            [
                'tip_text' => 'Look for group deals or special packages to make this active outing more affordable for everyone.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A lively spot that can accommodate your large group without feeling too cramped or expensive.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Perfect for a dynamic large group gathering where everyone can participate and have fun.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Consider a semi-private space for your large group to enjoy a premium, engaging experience.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'For a truly grand event, this option provides an exclusive and high-energy setting for your large group.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'Medium',
                'is_generic' => false,
            ],

            // High Energy, Solo
            [
                'tip_text' => 'Embrace the thrill! This high-energy solo experience will push your limits.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A dynamic solo adventure that offers excitement without excessive cost.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Prepare for an exhilarating solo journey; this option is for the adventurous spirit.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'An ultimate solo thrill-seeking experience for those who crave excitement and premium quality.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This is the pinnacle of high-energy solo experiences, offering unmatched excitement and exclusivity.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],

            // High Energy, Date
            [
                'tip_text' => 'An exciting and budget-friendly date idea to get your adrenaline pumping together.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Share an exhilarating and memorable date experience without overspending.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'An energetic date that combines fun with a good value, ensuring a dynamic evening.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This is a premium and thrilling date idea for couples who love excitement.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Celebrate a truly special occasion with an ultra-luxurious and high-octane date experience.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],

            // High Energy, Small Group
            [
                'tip_text' => 'Get ready for some fast-paced fun with your small group, without breaking the bank.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A fantastic option for an active small group looking for excitement and good value.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Challenge your small group with an exhilarating activity; great for team building and fun!',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A high-octane and premium experience for your small group to enjoy together.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This ultimate adventure is designed for an exclusive and thrilling small group experience.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],

            // High Energy, Large Group
            [
                'tip_text' => 'Choose activities that foster high energy and group participation while staying budget-friendly.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A dynamic option for large groups looking for a lively and engaging experience at a good price.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'Perfect for a high-energy group celebration, offering excitement and a great atmosphere.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'A premium experience designed for large groups seeking both high energy and luxury.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
            [
                'tip_text' => 'This is the ultimate lavish experience for a large group looking for an unparalleled high-energy event.',
                'applies_to_activity_type' => null,
                'applies_to_budget_tag' => '$$$$$',
                'applies_to_energy_tag' => 'High',
                'is_generic' => false,
            ],
        ];

        foreach ($tips as $tip) {
            Tip::create($tip);
        }
    }
}