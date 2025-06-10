<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('generated_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->foreignId('tip_id')->constrained()->onDelete('cascade');
            $table->decimal('total_estimated_budget', 8, 2)->nullable();
            $table->string('schedule_hash')->unique(); // For sharing/referencing
            $table->boolean('was_viewed')->default(false);
            $table->boolean('was_confirmed')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('generated_schedules');
    }
};