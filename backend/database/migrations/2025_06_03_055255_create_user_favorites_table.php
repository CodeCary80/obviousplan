<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('generated_schedule_id')->constrained()->onDelete('cascade');
            $table->string('user_notes')->nullable();
            $table->timestamps();
            
            // Ensure a user can't favorite the same schedule twice
            $table->unique(['user_id', 'generated_schedule_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_favorites');
    }
};
