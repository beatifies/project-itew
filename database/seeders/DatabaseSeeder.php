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
        // Create admin user for demo
        User::create([
            'user_id' => 'ADMIN001',
            'name' => 'Admin User',
            'email' => 'admin@ccs.edu',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create test user (avoid factories/Faker in production deploys)
        User::create([
            'user_id' => 'TEST001',
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }
}
