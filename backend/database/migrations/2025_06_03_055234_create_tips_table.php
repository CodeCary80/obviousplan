<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tips', function (Blueprint $table) {
            $table->id();
            $table->text('tip_text');
            $table->string('applies_to_activity_type')->nullable(); 
            $table->enum('applies_to_budget_tag', ['$', '$$', '$$$', '$$$$', '$$$$$'])->nullable();
            $table->enum('applies_to_energy_tag', ['Low', 'Medium', 'High'])->nullable();
            $table->boolean('is_generic')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tips');
    }
};