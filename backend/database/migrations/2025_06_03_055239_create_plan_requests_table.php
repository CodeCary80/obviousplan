<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plan_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('energy_level', ['Low', 'Medium', 'High']);
            $table->enum('budget_preference', ['$', '$$', '$$$', '$$$$', '$$$$$']);
            $table->enum('company_type', ['Solo', 'Date', 'Small Group', 'Large Group']);
            $table->decimal('user_latitude', 10, 8)->nullable();
            $table->decimal('user_longitude', 11, 8)->nullable();
            $table->boolean('location_shared')->default(false);
            $table->string('session_id')->nullable(); // For non-logged-in users
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('plan_requests');
    }
};