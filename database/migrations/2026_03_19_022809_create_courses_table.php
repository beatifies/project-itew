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
        Schema::create('courses', function (Blueprint $table) {
            $table->string('course_id')->primary();
            $table->string('course_code')->unique();
            $table->string('course_title');
            $table->string('program');
            $table->integer('units');
            $table->integer('year_level');
            $table->enum('semester', ['1st', '2nd', 'summer']);
            $table->json('learning_outcomes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
