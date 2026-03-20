<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->string('faculty_id')->primary();
            $table->string('first_name');
            $table->string('last_name');
            $table->json('degrees');
            $table->json('certifications')->nullable();
            $table->json('expertise_areas')->nullable();
            $table->json('research_areas')->nullable();
            $table->string('ccs_role');
            $table->integer('teaching_load')->default(0);
            $table->enum('employment_status', ['full_time', 'part_time', 'adjunct', 'on_leave'])->default('full_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty');
    }
};
