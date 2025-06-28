<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('cuisine_type');
            $table->text('description_snippet')->nullable();
            $table->enum('budget_tag', ['$', '$$', '$$$', '$$$$', '$$$$$']);
            $table->string('budget_display_text')->nullable();
            $table->enum('energy_tag', ['Low', 'Medium', 'High']);
            $table->enum('people_tag', ['Solo', 'Date', 'Small Group', 'Large Group']);
            $table->string('people_display_text')->nullable();
            $table->string('ambiance_tags')->nullable();
            $table->string('website_url')->nullable();
            $table->string('booking_url')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('curated_image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};