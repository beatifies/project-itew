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
        Schema::create('students', function (Blueprint $table) {
            $table->string('student_id')->primary();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('program');
            $table->integer('year_level');
            $table->string('section');
            $table->decimal('gpa', 3, 2)->nullable();
            $table->enum('academic_status', ['active', 'probation', 'graduated', 'dropped'])->default('active');
            $table->json('honors')->nullable();
            $table->json('scholarships')->nullable();
            $table->json('special_skills')->nullable();
            $table->json('certifications')->nullable();
            $table->json('club_memberships')->nullable();
            $table->string('officer_role')->nullable();
            $table->enum('attendance_status', ['excellent', 'good', 'fair', 'poor'])->default('good');
            $table->enum('discipline_status', ['clean', 'minor_violation', 'major_violation'])->default('clean');
            $table->enum('enrollment_status', ['enrolled', 'irregular', 'graduated', 'dropped'])->default('enrolled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
