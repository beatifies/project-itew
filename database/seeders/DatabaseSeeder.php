<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user (skip if exists)
        User::firstOrCreate(
            ['email' => 'admin@ccs.edu'],
            [
                'user_id' => 'ADMIN001',
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        // Create faculty user (skip if exists)
        User::firstOrCreate(
            ['email' => 'maria.santos@ccs.edu'],
            [
                'user_id' => 'FAC001',
                'name' => 'Dr. Maria Santos',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'faculty_id' => 'FAC001',
            ]
        );

        // Create student user (skip if exists)
        User::firstOrCreate(
            ['email' => 'john.doe@ccs.edu'],
            [
                'user_id' => 'STU001',
                'name' => 'John Doe',
                'password' => bcrypt('password'),
                'role' => 'student',
                'student_id' => '2024-0001',
            ]
        );

        // Create test user (skip if exists)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'user_id' => 'TEST001',
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'role' => 'user',
            ]
        );

        // Seed 1000+ students
        $this->call([
            StudentSeeder::class,
            TestDataSeeder::class,
        ]);
    }
}
