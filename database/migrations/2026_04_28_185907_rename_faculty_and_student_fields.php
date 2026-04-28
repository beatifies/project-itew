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
        // Rename faculty fields to singular
        if (Schema::hasColumn('faculty', 'expertise_areas')) {
            Schema::table('faculty', function (Blueprint $table) {
                $table->renameColumn('expertise_areas', 'expertise_area');
            });
        }
        
        if (Schema::hasColumn('faculty', 'research_areas')) {
            Schema::table('faculty', function (Blueprint $table) {
                $table->renameColumn('research_areas', 'research_area');
            });
        }
        
        // Rename student scholarships to scholarship (singular)
        if (Schema::hasColumn('students', 'scholarships')) {
            Schema::table('students', function (Blueprint $table) {
                $table->renameColumn('scholarships', 'scholarship');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse faculty field renames
        if (Schema::hasColumn('faculty', 'expertise_area')) {
            Schema::table('faculty', function (Blueprint $table) {
                $table->renameColumn('expertise_area', 'expertise_areas');
            });
        }
        
        if (Schema::hasColumn('faculty', 'research_area')) {
            Schema::table('faculty', function (Blueprint $table) {
                $table->renameColumn('research_area', 'research_areas');
            });
        }
        
        // Reverse student field rename
        if (Schema::hasColumn('students', 'scholarship')) {
            Schema::table('students', function (Blueprint $table) {
                $table->renameColumn('scholarship', 'scholarships');
            });
        }
    }
};
