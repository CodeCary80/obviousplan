<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('activity_title'); // e.g., "Go Bowling"
            $table->string('activity_type'); // e.g., "Bowling", "Movie", "Art"
            $table->string('venue_name')->nullable(); // e.g., "The Ballroom Bowl"
            $table->text('description');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('budget_tag', ['$', '$$', '$$$', '$$$$', '$$$$$']);
            $table->string('budget_display_text'); // e.g., "$40"
            $table->enum('energy_tag', ['Low', 'Medium', 'High']);
            $table->enum('people_tag', ['Solo', 'Date', 'Small Group', 'Large Group']);
            $table->string('people_display_text'); // e.g., "2-6 people"
            $table->integer('estimated_duration_minutes');
            $table->enum('indoor_outdoor_status', ['Indoor', 'Outdoor', 'Both']);
            $table->text('required_materials')->nullable();
            $table->string('website_url')->nullable();
            $table->string('booking_url')->nullable();
            $table->string('curated_image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('activities');
    }
};